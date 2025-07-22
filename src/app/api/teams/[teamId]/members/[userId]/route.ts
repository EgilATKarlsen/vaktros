import { stackServerApp } from "@/stack";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string; userId: string }> }
) {
  try {
    const { teamId, userId } = await params;

    // Get the authenticated user
    const currentUser = await stackServerApp.getUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if current user is part of the team and is an admin
    const userTeams = await currentUser.listTeams();
    const currentTeam = userTeams.find(team => team.id === teamId);
    
    if (!currentTeam) {
      return NextResponse.json(
        { success: false, error: "Team not found or access denied" },
        { status: 404 }
      );
    }

    // Check if current user has admin permissions
    const currentUserPermissions = await currentUser.listPermissions(currentTeam);
    const isCurrentUserAdmin = currentUserPermissions.some(permission => permission.id === 'team_admin');
    
    if (!isCurrentUserAdmin) {
      return NextResponse.json(
        { success: false, error: "Admin permissions required" },
        { status: 403 }
      );
    }

    // Prevent self-removal
    if (currentUser.id === userId) {
      return NextResponse.json(
        { success: false, error: "Cannot remove yourself from the team" },
        { status: 400 }
      );
    }

    // Get the target user
    const targetUser = await stackServerApp.getUser({ userId });
    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check if target user is part of the team
    const targetUserTeams = await targetUser.listTeams();
    const targetUserInTeam = targetUserTeams.find(team => team.id === teamId);
    
    if (!targetUserInTeam) {
      return NextResponse.json(
        { success: false, error: "User is not a member of this team" },
        { status: 404 }
      );
    }

    // Remove member using Stack Auth SDK method
    try {
      await currentTeam.removeUser(userId);
      
      return NextResponse.json({
        success: true,
        message: "User removed from team successfully",
      });
    } catch (removeError) {
      console.error('Error removing user from team:', removeError);
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to remove member: ${removeError instanceof Error ? removeError.message : 'Unknown error'}` 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error removing team member:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to remove team member' 
      },
      { status: 500 }
    );
  }
} 