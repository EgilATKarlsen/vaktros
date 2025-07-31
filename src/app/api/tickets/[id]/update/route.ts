import { NextRequest, NextResponse } from "next/server";
import { getTicketById } from "@/lib/db";
import { stackServerApp } from "@/stack";
import { NotificationService } from "@/lib/notifications";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify user authentication
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const ticketId = parseInt(id);

    if (isNaN(ticketId)) {
      return NextResponse.json(
        { success: false, error: "Invalid ticket ID" },
        { status: 400 }
      );
    }

    // Get the ticket
    const ticket = await getTicketById(ticketId);
    if (!ticket) {
      return NextResponse.json(
        { success: false, error: "Ticket not found" },
        { status: 404 }
      );
    }

    // Verify user has access to this ticket (team member or creator)
    const userTeams = await user.listTeams();
    const hasTeamAccess = userTeams.some(team => team.id === ticket.team_id);
    const isCreator = user.id === ticket.creator_id;

    if (!hasTeamAccess && !isCreator) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const { updateType, updateDescription, notifyCreator = true } = await request.json();

    // Validate required fields
    if (!updateType) {
      return NextResponse.json(
        { success: false, error: "Update type is required" },
        { status: 400 }
      );
    }

    // Send notification to ticket creator (if not the creator making the update)
    if (notifyCreator && user.id !== ticket.creator_id) {
      NotificationService.notifyTicketUpdated(
        ticket,
        updateType,
        updateDescription || '',
        user.displayName || 'Team Member'
      ).catch(error => console.error('Notification error:', error));
    }

    return NextResponse.json({
      success: true,
      message: "Ticket update notification sent",
      ticket: ticket
    });

  } catch (error) {
    console.error("Ticket update API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
} 