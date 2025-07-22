import { NextRequest, NextResponse } from 'next/server';
import { getTicketsByTeam } from '@/lib/db';
import { stackServerApp } from '@/stack';

export async function GET(request: NextRequest) {
  try {
    // Get the user from the Stack auth
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's teams
    const userTeams = await user.listTeams();
    const currentTeam = userTeams?.[0] || null;

    if (!currentTeam) {
      return NextResponse.json({ error: 'No team found' }, { status: 404 });
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