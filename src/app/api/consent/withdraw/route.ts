import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { withdrawConsent, upsertUserProfile } from '@/lib/db';

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

    const { consentType, withdrawalReason } = await req.json();

    // Validate required fields
    if (!consentType) {
      return NextResponse.json(
        { success: false, error: 'Consent type is required' },
        { status: 400 }
      );
    }

    // Currently only supporting SMS consent withdrawal
    if (consentType !== 'sms_notifications') {
      return NextResponse.json(
        { success: false, error: 'Invalid consent type' },
        { status: 400 }
      );
    }

    try {
      // Record consent withdrawal in GDPR audit trail
      const withdrawalMethod = `user_request${withdrawalReason ? `_${withdrawalReason}` : ''}`;
      const consentRecord = await withdrawConsent(
        user.id,
        consentType,
        withdrawalMethod
      );

      if (!consentRecord) {
        return NextResponse.json(
          { success: false, error: 'No active consent found to withdraw' },
          { status: 404 }
        );
      }

      // Update user profile to disable SMS notifications
      await upsertUserProfile(user.id, {
        sms_notifications_enabled: false
      });

      // Update user metadata
      await user.update({
        clientMetadata: {
          ...user.clientMetadata,
          smsNotificationsEnabled: false,
          smsConsentGiven: false,
          smsConsentWithdrawnDate: new Date().toISOString(),
          smsConsentWithdrawnReason: withdrawalReason || 'user_request'
        }
      });

      console.log(`SMS consent withdrawn for user ${user.id} via ${withdrawalMethod}`);

      return NextResponse.json({
        success: true,
        message: 'SMS consent withdrawn successfully',
        withdrawalDate: consentRecord.withdrawal_date,
        consentRecordId: consentRecord.id
      });

    } catch (dbError) {
      console.error('Error withdrawing consent:', dbError);
      return NextResponse.json(
        { success: false, error: 'Failed to withdraw consent' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Consent withdrawal API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 