import { NextRequest, NextResponse } from 'next/server';
import { Twilio } from 'twilio';

// Load environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client
const client = new Twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
  try {
    // Verify environment variables
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.error('Missing Twilio environment variables');
      return NextResponse.json(
        { success: false, error: 'SMS service not configured' },
        { status: 500 }
      );
    }

    const { to, body } = await req.json();

    // Validate required fields
    if (!to || !body) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: to and body' },
        { status: 400 }
      );
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(to.replace(/\s|-|\(|\)/g, ''))) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    try {
      // Send SMS using Twilio
      const message = await client.messages.create({
        body: body,
        from: twilioPhoneNumber,
        to: to,
      });

      console.log(`SMS sent successfully to ${to}, SID: ${message.sid}`);

      // Return success response
      return NextResponse.json({ 
        success: true, 
        message: 'SMS sent successfully!', 
        sid: message.sid 
      });

    } catch (twilioError: any) {
      console.error('Twilio error:', twilioError);
      
      // Handle specific Twilio errors
      let errorMessage = 'Failed to send SMS';
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
          default:
            errorMessage = `SMS service error: ${twilioError.message}`;
        }
      }

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('SMS API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 