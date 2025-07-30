import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const sql = neon(process.env.DATABASE_URL);

// Types for our ticket system
export interface Ticket {
  id: number;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  category: 'Technical' | 'Billing' | 'Feature Request' | 'Bug Report' | 'General Support';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  team_id: string;
  creator_id: string;
  creator_name: string;
  creator_email: string;
  created_at: string;
  updated_at: string;
}

export interface TicketAttachment {
  id: number;
  ticket_id: number;
  filename: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

export interface UserProfile {
  id: number;
  user_id: string;
  phone_number: string | null;
  sms_notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConsentRecord {
  id: number;
  user_id: string;
  consent_type: string;
  consent_given: boolean;
  consent_date: string;
  consent_method: string;
  ip_address: string | null;
  user_agent: string | null;
  legal_basis: string | null;
  purpose: string | null;
  withdrawal_date: string | null;
  withdrawal_method: string | null;
  data_retention_period: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTicketData {
  title: string;
  description: string;
  severity: Ticket['severity'];
  category: Ticket['category'];
  team_id: string;
  creator_id: string;
  creator_name: string;
  creator_email: string;
}

// Database operations
export async function createTicket(data: CreateTicketData): Promise<Ticket> {
  const [ticket] = await sql`
    INSERT INTO tickets (
      title, description, severity, category, team_id, 
      creator_id, creator_name, creator_email
    ) VALUES (
      ${data.title}, ${data.description}, ${data.severity}, ${data.category}, 
      ${data.team_id}, ${data.creator_id}, ${data.creator_name}, ${data.creator_email}
    ) RETURNING *
  `;
  return ticket as Ticket;
}

export async function getTicketsByTeam(teamId: string): Promise<Ticket[]> {
  const tickets = await sql`
    SELECT * FROM tickets 
    WHERE team_id = ${teamId} 
    ORDER BY created_at DESC
  `;
  return tickets as Ticket[];
}

export async function getTicketsByCreator(creatorId: string): Promise<Ticket[]> {
  const tickets = await sql`
    SELECT * FROM tickets 
    WHERE creator_id = ${creatorId} 
    ORDER BY created_at DESC
  `;
  return tickets as Ticket[];
}

export async function getTicketById(ticketId: number): Promise<Ticket | null> {
  const [ticket] = await sql`
    SELECT * FROM tickets 
    WHERE id = ${ticketId}
  `;
  return ticket as Ticket || null;
}

export async function getTicketAttachments(ticketId: number): Promise<TicketAttachment[]> {
  const attachments = await sql`
    SELECT * FROM ticket_attachments 
    WHERE ticket_id = ${ticketId} 
    ORDER BY uploaded_at DESC
  `;
  return attachments as TicketAttachment[];
}

export async function addTicketAttachment(
  ticketId: number, 
  filename: string, 
  fileUrl: string, 
  fileSize: number, 
  mimeType: string
): Promise<TicketAttachment> {
  const [attachment] = await sql`
    INSERT INTO ticket_attachments (ticket_id, filename, file_url, file_size, mime_type)
    VALUES (${ticketId}, ${filename}, ${fileUrl}, ${fileSize}, ${mimeType})
    RETURNING *
  `;
  return attachment as TicketAttachment;
}

export async function updateTicketStatus(ticketId: number, status: Ticket['status']): Promise<Ticket> {
  const [ticket] = await sql`
    UPDATE tickets 
    SET status = ${status}, updated_at = NOW() 
    WHERE id = ${ticketId} 
    RETURNING *
  `;
  return ticket as Ticket;
}

// User Profile operations
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const [profile] = await sql`
    SELECT * FROM user_profiles 
    WHERE user_id = ${userId}
  `;
  return profile as UserProfile || null;
}

export async function createUserProfile(userId: string, phoneNumber?: string): Promise<UserProfile> {
  const [profile] = await sql`
    INSERT INTO user_profiles (user_id, phone_number)
    VALUES (${userId}, ${phoneNumber || null})
    RETURNING *
  `;
  return profile as UserProfile;
}

export async function updateUserProfile(userId: string, data: { phone_number?: string; sms_notifications_enabled?: boolean }): Promise<UserProfile> {
  const [profile] = await sql`
    UPDATE user_profiles 
    SET 
      phone_number = COALESCE(${data.phone_number || null}, phone_number),
      sms_notifications_enabled = COALESCE(${data.sms_notifications_enabled ?? null}, sms_notifications_enabled),
      updated_at = NOW()
    WHERE user_id = ${userId}
    RETURNING *
  `;
  return profile as UserProfile;
}

export async function upsertUserProfile(userId: string, data: { phone_number?: string; sms_notifications_enabled?: boolean }): Promise<UserProfile> {
  const [profile] = await sql`
    INSERT INTO user_profiles (user_id, phone_number, sms_notifications_enabled)
    VALUES (${userId}, ${data.phone_number || null}, ${data.sms_notifications_enabled ?? true})
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      phone_number = COALESCE(${data.phone_number || null}, user_profiles.phone_number),
      sms_notifications_enabled = COALESCE(${data.sms_notifications_enabled ?? null}, user_profiles.sms_notifications_enabled),
      updated_at = NOW()
    RETURNING *
  `;
  return profile as UserProfile;
}

export async function getTeamMembersWithProfiles(): Promise<Array<{
  userId: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  smsNotificationsEnabled: boolean;
}>> {
  // Note: This function will be used in combination with Stack Auth team member data
  // We'll implement the logic in the notification service to combine Stack Auth data with profiles
  const profiles = await sql`
    SELECT user_id, phone_number, sms_notifications_enabled 
    FROM user_profiles 
    WHERE phone_number IS NOT NULL AND sms_notifications_enabled = true
  `;
  return profiles.map(p => ({
    userId: p.user_id,
    displayName: '', // Will be filled from Stack Auth
    email: '', // Will be filled from Stack Auth
    phoneNumber: p.phone_number,
    smsNotificationsEnabled: p.sms_notifications_enabled
  }));
} 

// Consent management functions for GDPR compliance
export async function recordConsent(data: {
  userId: string;
  consentType: string;
  consentGiven: boolean;
  consentMethod: string;
  ipAddress?: string;
  userAgent?: string;
  legalBasis?: string;
  purpose?: string;
  dataRetentionPeriod?: string;
}): Promise<ConsentRecord> {
  const [record] = await sql`
    INSERT INTO consent_records (
      user_id, consent_type, consent_given, consent_method, 
      ip_address, user_agent, legal_basis, purpose, data_retention_period
    )
    VALUES (
      ${data.userId}, ${data.consentType}, ${data.consentGiven}, ${data.consentMethod},
      ${data.ipAddress || null}, ${data.userAgent || null}, ${data.legalBasis || null}, 
      ${data.purpose || null}, ${data.dataRetentionPeriod || null}
    )
    RETURNING *
  `;
  return record as ConsentRecord;
}

export async function withdrawConsent(
  userId: string, 
  consentType: string, 
  withdrawalMethod: string
): Promise<ConsentRecord | null> {
  const [record] = await sql`
    UPDATE consent_records 
    SET 
      consent_given = false,
      withdrawal_date = NOW(),
      withdrawal_method = ${withdrawalMethod},
      updated_at = NOW()
    WHERE user_id = ${userId} 
      AND consent_type = ${consentType} 
      AND consent_given = true
      AND withdrawal_date IS NULL
    RETURNING *
  `;
  return record as ConsentRecord || null;
}

export async function getConsentHistory(userId: string): Promise<ConsentRecord[]> {
  const records = await sql`
    SELECT * FROM consent_records 
    WHERE user_id = ${userId}
    ORDER BY consent_date DESC
  `;
  return records as ConsentRecord[];
}

export async function getCurrentConsent(
  userId: string, 
  consentType: string
): Promise<ConsentRecord | null> {
  const [record] = await sql`
    SELECT * FROM consent_records 
    WHERE user_id = ${userId} 
      AND consent_type = ${consentType}
      AND withdrawal_date IS NULL
    ORDER BY consent_date DESC
    LIMIT 1
  `;
  return record as ConsentRecord || null;
}

export async function hasValidConsent(
  userId: string, 
  consentType: string
): Promise<boolean> {
  const consent = await getCurrentConsent(userId, consentType);
  return consent?.consent_given === true;
} 