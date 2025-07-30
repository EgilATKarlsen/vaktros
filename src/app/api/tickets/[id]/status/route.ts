import { NextRequest, NextResponse } from "next/server";
import { getTicketById, updateTicketStatus } from "@/lib/db";
import { stackServerApp } from "@/stack";
import { NotificationService } from "@/lib/notifications";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ticketId = parseInt(id);

    if (isNaN(ticketId)) {
      return NextResponse.json(
        { success: false, error: "Invalid ticket ID" },
        { status: 400 }
      );
    }

    // Verify user authentication
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { status } = await request.json();

    // Validate status
    const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status. Must be one of: " + validStatuses.join(', ') },
        { status: 400 }
      );
    }

    // Get the current ticket
    const currentTicket = await getTicketById(ticketId);
    if (!currentTicket) {
      return NextResponse.json(
        { success: false, error: "Ticket not found" },
        { status: 404 }
      );
    }

    // Verify user is part of the team
    const userTeams = await user.listTeams();
    const currentTeam = userTeams.find(team => team.id === currentTicket.team_id);
    
    if (!currentTeam) {
      return NextResponse.json(
        { success: false, error: "Access denied: User not part of team" },
        { status: 403 }
      );
    }

    // Check if status is actually changing
    if (currentTicket.status === status) {
      return NextResponse.json(
        { success: true, ticket: currentTicket, message: "Status unchanged" }
      );
    }

    const oldStatus = currentTicket.status;

    // Update the ticket status
    const updatedTicket = await updateTicketStatus(ticketId, status);

    // Send notifications asynchronously (don't await to avoid blocking the response)
    NotificationService.notifyTicketStatusChanged(updatedTicket, oldStatus, status, user)
      .catch(error => console.error('Notification error:', error));

    return NextResponse.json({
      success: true,
      ticket: updatedTicket,
      message: `Ticket status updated from ${oldStatus} to ${status}`,
    });

  } catch (error) {
    console.error('Error updating ticket status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update ticket status' 
      },
      { status: 500 }
    );
  }
} 