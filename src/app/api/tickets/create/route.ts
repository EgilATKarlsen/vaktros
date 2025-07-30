import { NextRequest, NextResponse } from "next/server";
import { createTicket, addTicketAttachment, Ticket } from "@/lib/db";
import { stackServerApp } from "@/stack";
import { NotificationService } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const severity = formData.get('severity') as string;
    const category = formData.get('category') as string;
    const teamId = formData.get('teamId') as string;
    const userId = formData.get('userId') as string;
    const userName = formData.get('userName') as string;
    const userEmail = formData.get('userEmail') as string;

    // Validate required fields
    if (!title || !description || !severity || !category || !teamId || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify user is part of the team
    const userTeams = await user.listTeams();
    const currentTeam = userTeams.find(team => team.id === teamId);
    
    if (!currentTeam) {
      return NextResponse.json(
        { success: false, error: "Access denied: User not part of team" },
        { status: 403 }
      );
    }

    // Create the ticket
    const ticket = await createTicket({
      title,
      description,
      severity: severity as Ticket['severity'],
      category: category as Ticket['category'],
      team_id: teamId,
      creator_id: userId,
      creator_name: userName,
      creator_email: userEmail,
    });

    // Handle file uploads
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file-') && value instanceof File) {
        files.push(value);
      }
    }

    // Process file uploads (for now, we'll store them as data URLs)
    // In production, you'd want to upload to a proper file storage service
    for (const file of files) {
      try {
        // Convert file to data URL for simple storage
        // In production, upload to cloud storage and store the URL
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;
        
        await addTicketAttachment(
          ticket.id,
          file.name,
          dataUrl, // In production, this would be the cloud storage URL
          file.size,
          file.type
        );
      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError);
        // Continue with other files even if one fails
      }
    }

    // Send notifications asynchronously (don't await to avoid blocking the response)
    NotificationService.notifyTicketCreated(ticket, user)
      .catch(error => console.error('Notification error:', error));

    return NextResponse.json({
      success: true,
      ticket,
      message: "Ticket created successfully. SMS notifications sent to team members.",
    });

  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create ticket' 
      },
      { status: 500 }
    );
  }
} 