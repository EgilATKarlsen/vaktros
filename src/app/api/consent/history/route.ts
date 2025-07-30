import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { getConsentHistory } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // Verify user authentication
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      // Get the user's consent history
      const consentHistory = await getConsentHistory(user.id);

      // Format the history for the frontend
      const formattedHistory = consentHistory.map(record => ({
        id: record.id,
        consentType: record.consent_type,
        consentGiven: record.consent_given,
        consentDate: record.consent_date,
        consentMethod: record.consent_method,
        legalBasis: record.legal_basis,
        purpose: record.purpose,
        withdrawalDate: record.withdrawal_date,
        withdrawalMethod: record.withdrawal_method,
        dataRetentionPeriod: record.data_retention_period
      }));

      return NextResponse.json({
        success: true,
        consentHistory: formattedHistory,
        totalRecords: formattedHistory.length
      });

    } catch (dbError) {
      console.error('Error fetching consent history:', dbError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch consent history' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Consent history API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 