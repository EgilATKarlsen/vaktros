import { NextResponse } from 'next/server';
import { getTicketsByTeam } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth-utils';

export async function GET() {
  try {
    // Get the user from the Stack auth - handle redirect errors gracefully
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's teams
    const userTeams = await user.listTeams();
    const currentTeam = userTeams?.[0] || null;

    if (!currentTeam) {
      // Return empty state instead of 404 when user has no team
      return NextResponse.json({ 
        tickets: [], 
        team: null,
        message: 'No team found. Please create or join a team to view tickets.'
      });
    }

    // Get team tickets
    const tickets = await getTicketsByTeam(currentTeam.id);

    return NextResponse.json({ 
      tickets, 
      team: {
        id: currentTeam.id,
        displayName: currentTeam.displayName
      }
    });

  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 