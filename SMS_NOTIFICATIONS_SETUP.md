# Twilio SMS Notifications Setup Guide

This guide will help you set up SMS notifications for your ticket system using Twilio.

## 🚀 Features Implemented

- ✅ SMS notifications when tickets are created
- ✅ SMS notifications when ticket status changes (Open → In Progress → Resolved → Closed)
- ✅ User profile management for phone numbers
- ✅ SMS notification preferences (enable/disable)
- ✅ Team-wide notifications (all team members with phone numbers get notified)
- ✅ Comprehensive error handling and validation
- ✅ Phone number format validation

## 📋 Prerequisites

1. **Twilio Account** - Sign up at [twilio.com](https://twilio.com)
2. **Twilio Phone Number** - Purchase a phone number capable of sending SMS
3. **Environment Variables** - Configure your Twilio credentials

## 🔧 Setup Instructions

### Step 1: Configure Twilio Environment Variables

Add these to your `.env.local` file:

```env
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

You can find these values in your [Twilio Console Dashboard](https://console.twilio.com/).

### Step 2: Update Database Schema

The system includes a new `user_profiles` table. Run the database initialization:

```bash
npm run db:init
```

Or manually execute the SQL in `src/lib/db/schema.sql` which includes:

```sql
-- Create user_profiles table for additional user information
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL, -- Stack Auth user ID
  phone_number VARCHAR(20),
  sms_notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Step 3: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/dashboard/profile` to set up your phone number

3. Create a test ticket to verify SMS notifications work

## 📱 How to Use

### For Users

1. **Set Up Your Phone Number**:
   - Go to Dashboard → Profile
   - Enter your phone number with country code (e.g., +1234567890)
   - Toggle SMS notifications on/off as desired
   - Click "Update Notification Settings"

2. **Receive Notifications**:
   - Get SMS when new tickets are created
   - Get SMS when ticket status changes
   - Notifications include ticket details and direct links

### For Administrators

1. **Monitor Notifications**:
   - Check server logs for notification delivery status
   - Handle any Twilio API errors that may occur

## 📊 API Endpoints Added

### SMS Sending
- `POST /api/sms/send` - Send SMS messages via Twilio

### User Profile Management
- `GET /api/user/profile` - Get user profile with phone number
- `POST /api/user/profile` - Update user profile and SMS preferences

### Ticket Status Updates
- `PATCH /api/tickets/[id]/status` - Update ticket status with notifications

## 🛠️ Components Added

### User Interface Components
- `UserProfileForm` - Phone number and notification preferences form
- `TicketStatusSelector` - Dropdown to update ticket status
- Profile page at `/dashboard/profile`

### Backend Services
- `NotificationService` - Handles SMS notification logic
- Database functions for user profile management
- Enhanced ticket creation and status update with notifications

## 📝 Notification Message Examples

### Ticket Created
```
🎫 New Support Ticket Created
Title: Database Connection Issue
Severity: High
Category: Technical
Created by: John Doe

View ticket: https://yourapp.com/dashboard/tickets
```

### Status Changed
```
✅ Ticket Status Updated
Ticket: Database Connection Issue
Status: Open → Resolved
Severity: High

View ticket: https://yourapp.com/dashboard/tickets
```

## 🔍 Troubleshooting

### Common Issues

1. **SMS Not Sending**:
   - Check Twilio credentials in environment variables
   - Verify phone number format (+1234567890)
   - Check Twilio account balance
   - Review server logs for Twilio API errors

2. **Phone Number Validation Errors**:
   - Ensure phone numbers include country code
   - Remove spaces, dashes, parentheses
   - Use international format (e.g., +1234567890)

3. **No Team Members Receiving SMS**:
   - Verify team members have set up phone numbers
   - Check that SMS notifications are enabled in profiles
   - Confirm users are part of the correct team

### Error Codes

The system handles common Twilio error codes:
- `21211` - Invalid phone number
- `21608` - Phone number is not SMS capable  
- `21614` - SMS to this number is not allowed

## 🚦 Testing

### Manual Testing

1. **Test Phone Number Setup**:
   - Add/update phone number in profile
   - Toggle SMS notifications on/off
   - Verify profile updates successfully

2. **Test Ticket Creation Notifications**:
   - Create a new support ticket
   - Check that all team members with phone numbers receive SMS
   - Verify message content and format

3. **Test Status Change Notifications**:
   - Update ticket status (Open → In Progress → Resolved → Closed)
   - Check that SMS notifications are sent for each change
   - Verify message includes old and new status

### Production Considerations

1. **Rate Limiting**: Twilio has rate limits - consider implementing queues for high-volume usage
2. **Cost Management**: SMS messages cost money - monitor usage and implement cost controls
3. **International SMS**: Consider costs and regulations for international SMS
4. **Opt-out Compliance**: Ensure compliance with SMS regulations (TCPA, etc.)

## 🔐 Security Notes

- Twilio credentials are server-side only
- Phone numbers are validated before storage
- SMS content doesn't include sensitive information
- API endpoints require authentication

## 📈 Monitoring and Analytics

Monitor these metrics:
- SMS delivery success rate
- Failed SMS attempts and reasons
- User adoption of SMS notifications
- Twilio API usage and costs

## 🎯 Next Steps

Possible enhancements:
- SMS templates for different notification types
- Scheduled SMS reminders for open tickets
- SMS-based ticket status updates (reply to SMS)
- Integration with other notification channels (email, Slack)
- SMS notification preferences per ticket priority/category 