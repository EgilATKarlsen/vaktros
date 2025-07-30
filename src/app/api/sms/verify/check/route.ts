import { NextRequest, NextResponse } from 'next/server';
import { Twilio } from 'twilio';
import { stackServerApp } from '@/stack';
import { upsertUserProfile, recordConsent } from '@/lib/db';

// Load environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Initialize Twilio client
const client = new Twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
  try {
    // Verify user authentication
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify environment variables
    if (!accountSid || !authToken) {
      console.error('Missing Twilio environment variables');
      return NextResponse.json(
        { success: false, error: 'SMS verification service not configured' },
        { status: 500 }
      );
    }

    const { phoneNumber, code } = await req.json();

    // Validate required fields
    if (!phoneNumber || !code) {
      return NextResponse.json(
        { success: false, error: 'Phone number and verification code are required' },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanPhone = phoneNumber.replace(/\s|-|\(|\)/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Validate code format (6 digits)
    const codeRegex = /^\d{6}$/;
    if (!codeRegex.test(code)) {
      return NextResponse.json(
        { success: false, error: 'Verification code must be 6 digits' },
        { status: 400 }
      );
    }

    try {
      // Get verification service
      const services = await client.verify.v2.services.list({ limit: 1 });
      
      if (services.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Verification service not found' },
          { status: 400 }
        );
      }

      const verificationService = services[0];

      // Check verification code
      const verificationCheck = await client.verify.v2
        .services(verificationService.sid)
        .verificationChecks.create({
          to: cleanPhone,
          code: code
        });

      console.log(`Verification check for ${cleanPhone}, Status: ${verificationCheck.status}`);

      if (verificationCheck.status === 'approved') {
        // Phone number verified successfully - save to user profile with consent
        try {
          await upsertUserProfile(user.id, {
            phone_number: cleanPhone,
            sms_notifications_enabled: true
          });

          // Get client IP and User-Agent for GDPR compliance
          const clientIP = req.headers.get('x-forwarded-for') || 
                          req.headers.get('x-real-ip') || 
                          req.ip || 
                          'unknown';
          const userAgent = req.headers.get('user-agent') || 'unknown';

          // Record GDPR-compliant consent
          await recordConsent({
            userId: user.id,
            consentType: 'sms_notifications',
            consentGiven: true,
            consentMethod: 'onboarding_verification',
            ipAddress: clientIP,
            userAgent: userAgent,
            legalBasis: 'consent',
            purpose: 'Receive SMS notifications about support ticket updates and status changes',
            dataRetentionPeriod: 'Until consent is withdrawn or account is deleted'
          });

          // Update user metadata to record consent and verification
          const consentDate = new Date().toISOString();
          await user.update({
            clientMetadata: {
              ...user.clientMetadata,
              phoneVerified: true,
              phoneNumber: cleanPhone,
              smsNotificationsEnabled: true,
              smsConsentGiven: true,
              smsConsentDate: consentDate,
              smsConsentMethod: 'onboarding_verification',
            }
          });

          return NextResponse.json({
            success: true,
            message: 'Phone number verified and SMS consent recorded',
            verified: true,
            phoneNumber: cleanPhone,
            consentRecorded: true,
            consentDate: consentDate
          });

        } catch (profileError) {
          console.error('Error saving verified phone number:', profileError);
          return NextResponse.json(
            { success: false, error: 'Phone verified but failed to save to profile' },
            { status: 500 }
          );
        }

      } else {
        return NextResponse.json(
          { success: false, error: 'Invalid verification code' },
          { status: 400 }
        );
      }

    } catch (twilioError: any) {
      console.error('Twilio verification check error:', twilioError);
      
      // Handle specific Twilio errors
      let errorMessage = 'Failed to verify code';
      if (twilioError.code) {
        switch (twilioError.code) {
          case 20404:
            errorMessage = 'Verification code expired or not found';
            break;
          case 60202:
            errorMessage = 'Invalid verification code';
            break;
          case 60203:
            errorMessage = 'Maximum verification attempts exceeded';
            break;
          default:
            errorMessage = `Verification error: ${twilioError.message}`;
        }
      }

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('SMS verification check API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 