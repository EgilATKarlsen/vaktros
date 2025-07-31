import { stackServerApp } from "@/stack";
import { Ticket, getUserProfile, hasValidConsent } from "./db";
import type { User } from "@stackframe/stack";

interface NotificationRecipient {
  userId: string;
  displayName: string;
  phoneNumber: string;
  role: 'team_member' | 'ticket_creator';
}

export class NotificationService {
  static async getNotificationRecipients(teamId: string, excludeUserId?: string, user?: User): Promise<NotificationRecipient[]> {
    try {
      // Use provided user or get current authenticated user
      const currentUser = user || await stackServerApp.getUser();
      if (!currentUser) {
        console.log('No authenticated user found for notifications');
        return [];
      }

      // Get the team through the user's teams
      const userTeams = await (currentUser as unknown as { listTeams(): Promise<Array<{ id: string; listUsers(): Promise<Array<{ id: string; displayName?: string }>> }>> }).listTeams();
      const team = userTeams.find((t: { id: string; listUsers(): Promise<Array<{ id: string; displayName?: string }>> }) => t.id === teamId);
      
      if (!team) {
        console.log('Team not found in user teams:', teamId);
        return [];
      }

      // Get all team members using the correct Stack Auth pattern
      const teamUsers = await team.listUsers();
      const recipients: NotificationRecipient[] = [];

      for (const teamUser of teamUsers) {
        // Skip excluded user (to avoid duplicate notifications)
        if (excludeUserId && teamUser.id === excludeUserId) {
          continue;
        }

        try {
          // Get user profile with phone number
          const profile = await getUserProfile(teamUser.id);
          
          if (profile?.phone_number && profile.sms_notifications_enabled) {
            // Check for valid GDPR consent
            const hasConsent = await hasValidConsent(teamUser.id, 'sms_notifications');
            
            if (hasConsent) {
              recipients.push({
                userId: teamUser.id,
                displayName: teamUser.displayName || 'Unknown User',
                phoneNumber: profile.phone_number,
                role: 'team_member'
              });
            } else {
              console.log(`User ${teamUser.id} has no valid SMS consent, skipping notification`);
            }
          }
        } catch (error) {
          console.error(`Error getting profile for user ${teamUser.id}:`, error);
        }
      }

      console.log(`Found ${recipients.length} SMS notification recipients for team ${teamId}`);
      return recipients;
    } catch (error) {
      console.error('Error getting notification recipients:', error);
      return [];
    }
  }

  static async getTicketCreatorRecipient(creatorId: string): Promise<NotificationRecipient | null> {
    try {
      // Get creator user from Stack Auth using the server app
      const creator = await stackServerApp.getUser();
      if (!creator || creator.id !== creatorId) {
        console.log('Ticket creator not found:', creatorId);
        return null;
      }

      // Get creator profile with phone number
      const profile = await getUserProfile(creatorId);
      
      if (!profile?.phone_number || !profile.sms_notifications_enabled) {
        console.log(`Ticket creator ${creatorId} has no phone number or SMS disabled`);
        return null;
      }

      // Check for valid GDPR consent
      const hasConsent = await hasValidConsent(creatorId, 'sms_notifications');
      
      if (!hasConsent) {
        console.log(`Ticket creator ${creatorId} has no valid SMS consent`);
        return null;
      }

      return {
        userId: creatorId,
        displayName: creator.displayName || 'Unknown User',
        phoneNumber: profile.phone_number,
        role: 'ticket_creator'
      };
    } catch (error) {
      console.error(`Error getting ticket creator recipient ${creatorId}:`, error);
      return null;
    }
  }

  static async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/sms/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber,
          body: message
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log(`SMS sent successfully to ${phoneNumber}`);
        return true;
      } else {
        console.error(`Failed to send SMS to ${phoneNumber}:`, data.error);
        return false;
      }
    } catch (error) {
      console.error(`Error sending SMS to ${phoneNumber}:`, error);
      return false;
    }
  }

  static async notifyTicketCreated(ticket: Ticket, user?: User): Promise<void> {
    try {
      const recipients = await this.getNotificationRecipients(ticket.team_id, undefined, user);
      
      if (recipients.length === 0) {
        console.log('No SMS notification recipients found for ticket creation');
        return;
      }

      const message = `🎫 New Support Ticket Created

Title: ${ticket.title}
Severity: ${ticket.severity}
Category: ${ticket.category}
Created by: ${ticket.creator_name}

View ticket: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/tickets`;

      // Send notifications to all recipients
      const notifications = recipients.map(recipient => 
        this.sendSMS(recipient.phoneNumber, message)
      );

      const results = await Promise.allSettled(notifications);
      const successful = results.filter(result => result.status === 'fulfilled' && result.value).length;
      
      console.log(`Ticket creation notifications: ${successful}/${recipients.length} sent successfully`);
    } catch (error) {
      console.error('Error sending ticket creation notifications:', error);
    }
  }

  static async notifyTicketStatusChanged(ticket: Ticket, oldStatus: string, newStatus: string, user?: User): Promise<void> {
    try {
      // Get team members (excluding creator to avoid duplicate notifications)
      const teamRecipients = await this.getNotificationRecipients(ticket.team_id, ticket.creator_id, user);
      
      // Get ticket creator as a separate recipient
      const creatorRecipient = await this.getTicketCreatorRecipient(ticket.creator_id);
      
      // Combine all recipients
      const allRecipients = [...teamRecipients];
      if (creatorRecipient) {
        allRecipients.push(creatorRecipient);
      }
      
      if (allRecipients.length === 0) {
        console.log('No SMS notification recipients found for ticket status change');
        return;
      }

      const statusEmoji = this.getStatusEmoji(newStatus);
      
      // Send different messages to creator vs team members
      const notifications = allRecipients.map(recipient => {
        const message = recipient.role === 'ticket_creator' 
          ? `${statusEmoji} Your Ticket Status Updated

Title: ${ticket.title}
Status: ${oldStatus} → ${newStatus}
${ticket.severity} Priority

Your support ticket has been updated by our team.

View ticket: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/tickets`
          : `${statusEmoji} Ticket Status Updated

Title: ${ticket.title}
Status: ${oldStatus} → ${newStatus}
${ticket.severity} Priority
Created by: ${ticket.creator_name}

View ticket: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/tickets`;

        return this.sendSMS(recipient.phoneNumber, message);
      });

      const results = await Promise.allSettled(notifications);
      const successful = results.filter(result => result.status === 'fulfilled' && result.value).length;
      
      const creatorNotified = creatorRecipient ? 1 : 0;
      const teamNotified = successful - creatorNotified;
      
      console.log(`Ticket status change notifications: ${successful}/${allRecipients.length} sent successfully (${creatorNotified} creator, ${teamNotified} team members)`);
    } catch (error) {
      console.error('Error sending ticket status change notifications:', error);
    }
  }

  static async notifyTicketUpdated(ticket: Ticket, updateType: string, updateDescription: string, updatedBy: string): Promise<void> {
    try {
      // Only notify the ticket creator for general updates (not team members)
      const creatorRecipient = await this.getTicketCreatorRecipient(ticket.creator_id);
      
      if (!creatorRecipient) {
        console.log('No SMS notification recipient found for ticket creator');
        return;
      }

      const message = `💬 Your Ticket Updated

Title: ${ticket.title}
Update: ${updateType}
${updateDescription ? `Details: ${updateDescription}` : ''}
Updated by: ${updatedBy}

View ticket: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/tickets`;

      const success = await this.sendSMS(creatorRecipient.phoneNumber, message);
      
      console.log(`Ticket update notification: ${success ? 'sent' : 'failed'} to creator`);
    } catch (error) {
      console.error('Error sending ticket update notification:', error);
    }
  }

  static async notifyTicketCreatorOnly(ticket: Ticket, message: string): Promise<void> {
    try {
      // Utility function to send custom messages to ticket creator only
      const creatorRecipient = await this.getTicketCreatorRecipient(ticket.creator_id);
      
      if (!creatorRecipient) {
        console.log('No SMS notification recipient found for ticket creator');
        return;
      }

      const success = await this.sendSMS(creatorRecipient.phoneNumber, message);
      
      console.log(`Custom ticket notification: ${success ? 'sent' : 'failed'} to creator`);
    } catch (error) {
      console.error('Error sending custom ticket notification:', error);
    }
  }

  private static getStatusEmoji(status: string): string {
    switch (status.toLowerCase()) {
      case 'open': return '🆕';
      case 'in progress': return '🔄';
      case 'resolved': return '✅';
      case 'closed': return '🔒';
      default: return '📋';
    }
  }
} 