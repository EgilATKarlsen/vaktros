import { stackServerApp } from "@/stack";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;
    
    // Get the authenticated user
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is part of the team
    const userTeams = await user.listTeams();
    const currentTeam = userTeams.find(team => team.id === teamId);
    
    if (!currentTeam) {
      return NextResponse.json(
        { success: false, error: "Team not found or access denied" },
        { status: 404 }
      );
    }

    // Use Stack Auth's team.listUsers() method to get team members
    const teamMembers = await currentTeam.listUsers();
    
    // Transform the team member data to our format
    const members = await Promise.all(
      teamMembers.map(async (member) => {
        try {
          // Get user permissions for this team to determine role
          const permissions = await member.listPermissions(currentTeam);
          const isAdmin = permissions.some(permission => permission.id === 'team_admin');
          
          // Get team profile for display name
          const teamProfile = await member.getTeamProfile(currentTeam);
          
          return {
            userId: member.id,
            displayName: teamProfile?.displayName || member.displayName || 'Unknown User',
            email: member.primaryEmail || 'No email',
            role: isAdmin ? 'Admin' : 'Member',
            joinedAt: undefined, // Stack Auth doesn't provide join date in this API
          };
        } catch (error) {
          console.warn(`Error processing member ${member.id}:`, error);
          // Return basic info even if some operations fail
          return {
            userId: member.id,
            displayName: member.displayName || 'Unknown User',
            email: member.primaryEmail || 'No email',
            role: 'Member', // Default fallback
            joinedAt: undefined,
          };
        }
      })
    );

    console.log(`Found ${members.length} team members for team ${teamId}`);

    return NextResponse.json({
      success: true,
      members: members,
    });

  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch team members' 
      },
      { status: 500 }
    );
  }
} 