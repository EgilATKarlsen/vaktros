import { NextRequest, NextResponse } from 'next/server';
import { Twilio } from 'twilio';
import { stackServerApp } from '@/stack';

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

    const { phoneNumber } = await req.json();

    // Validate required fields
    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanPhone = phoneNumber.replace(/\s|-|\(|\)/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format. Please include country code (e.g., +1234567890)' },
        { status: 400 }
      );
    }

    try {
      // Create or get verification service
      let verificationService;
      try {
        // Try to get existing service
        const services = await client.verify.v2.services.list({ limit: 1 });
        if (services.length > 0) {
          verificationService = services[0];
        } else {
          // Create new verification service
          verificationService = await client.verify.v2.services.create({
            friendlyName: 'VAKTROS Phone Verification'
          });
        }
      } catch (serviceError) {
        console.error('Error with verification service:', serviceError);
        // Fallback to direct SMS if verify service fails
        const message = await client.messages.create({
          body: `Your VAKTROS verification code is: ${Math.floor(100000 + Math.random() * 900000)}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: cleanPhone,
        });

        return NextResponse.json({
          success: true,
          message: 'Verification code sent via SMS',
          sid: message.sid,
          fallback: true
        });
      }

      // Send verification code using Twilio Verify
      const verification = await client.verify.v2
        .services(verificationService.sid)
        .verifications.create({
          to: cleanPhone,
          channel: 'sms'
        });

      console.log(`Verification code sent to ${cleanPhone}, Status: ${verification.status}`);

      return NextResponse.json({
        success: true,
        message: 'Verification code sent successfully',
        status: verification.status,
        sid: verification.sid
      });

    } catch (twilioError: any) {
      console.error('Twilio verification error:', twilioError);
      
      // Handle specific Twilio errors
      let errorMessage = 'Failed to send verification code';
      if (twilioError.code) {
        switch (twilioError.code) {
          case 21211:
            errorMessage = 'Invalid phone number';
            break;
          case 21608:
            errorMessage = 'Phone number is not SMS capable';
            break;
          case 21614:
            errorMessage = 'SMS to this number is not allowed';
            break;
          case 60200:
            errorMessage = 'Invalid phone number format';
            break;
          default:
            errorMessage = `Verification service error: ${twilioError.message}`;
        }
      }

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('SMS verification API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 