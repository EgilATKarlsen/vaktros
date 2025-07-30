import { NextRequest, NextResponse } from "next/server";
import { getUserProfile, upsertUserProfile } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-utils";

export async function GET() {
  try {
    // Verify user authentication - handle redirect errors gracefully
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user profile
    const profile = await getUserProfile(user.id);

    return NextResponse.json({
      success: true,
      profile: profile || {
        user_id: user.id,
        phone_number: null,
        sms_notifications_enabled: true
      }
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch profile' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { phone_number, sms_notifications_enabled } = await request.json();

    // Validate phone number format if provided
    if (phone_number) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      const cleanPhone = phone_number.replace(/\s|-|\(|\)/g, '');
      
      if (!phoneRegex.test(cleanPhone)) {
        return NextResponse.json(
          { success: false, error: "Invalid phone number format. Please include country code (e.g., +1234567890)" },
          { status: 400 }
        );
      }
    }

    // Upsert user profile
    const profile = await upsertUserProfile(user.id, {
      phone_number,
      sms_notifications_enabled
    });

    return NextResponse.json({
      success: true,
      profile,
      message: "Profile updated successfully"
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update profile' 
      },
      { status: 500 }
    );
  }
} 