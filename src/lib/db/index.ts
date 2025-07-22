import { neon } from "@neondatabase/serverless";

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

export async function getTicketById(ticketId: number): Promise<Ticket | null> {
  const [ticket] = await sql`
    SELECT * FROM tickets WHERE id = ${ticketId}
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