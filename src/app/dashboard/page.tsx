"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Building, 
  Shield, 
  Activity,
  Ticket,
  Clock,
  AlertTriangle,
  CheckCircle,
  LifeBuoy,
  ArrowRight
} from "lucide-react";
import { Ticket as TicketType } from "@/lib/db";
import { CreateTicketDialog } from "@/components/create-ticket-dialog";
import { useDashboardHeader } from "@/components/dashboard-header-context";
import Link from "next/link";
import { useUser } from "@stackframe/stack";

interface Team {
  id: string;
  displayName: string;
}

interface DashboardData {
  tickets: TicketType[];
  team: Team;
}

export default function DashboardPage() {
  const user = useUser();
  const { setHeader } = useDashboardHeader();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!user) {
        redirect("/dashboard/teams");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get team and tickets data
        const response = await fetch('/api/tickets', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            redirect("/dashboard/teams");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: DashboardData = await response.json();
        setTickets(data.tickets);
        setCurrentTeam(data.team);

        // Set the header
        setHeader('Dashboard', 'Welcome to your surveillance network control center');

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
        setHeader('Dashboard', 'Error loading data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, setHeader]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-red-400">Error Loading Dashboard</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!currentTeam) {
    return null;
  }

  const recentTickets = tickets.slice(0, 5);

  // Calculate ticket statistics
  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length,
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500/20 text-red-400 border-red-500/20';
      case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/20';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/20';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      case 'In Progress': return 'bg-orange-500/20 text-orange-400 border-orange-500/20';
      case 'Resolved': return 'bg-green-500/20 text-green-400 border-green-500/20';
      case 'Closed': return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-end">
        <CreateTicketDialog
          teamId={currentTeam.id}
          userId={user?.id || ''}
          userName={user?.displayName || 'Unknown User'}
          userEmail={user?.primaryEmail || 'No email'}
        />
      </div>

      {/* Team Overview */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-500" />
            {currentTeam.displayName}
          </CardTitle>
          <CardDescription>
            Your surveillance network team overview and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Team Members:</span>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs">
                Active
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Security Status:</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                Operational
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">System Status:</span>
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 text-xs">
                Monitoring
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                <p className="text-2xl font-bold text-blue-400">{ticketStats.total}</p>
              </div>
              <Ticket className="h-8 w-8 text-blue-500/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open</p>
                <p className="text-2xl font-bold text-orange-400">{ticketStats.open}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-yellow-400">{ticketStats.inProgress}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-green-400">{ticketStats.resolved}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LifeBuoy className="h-5 w-5" />
              Recent Support Tickets
            </div>
            <Link href="/dashboard/tickets">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardTitle>
          <CardDescription>
            Latest support tickets from your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentTickets.length === 0 ? (
            <div className="text-center py-8">
              <LifeBuoy className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-3">No support tickets yet</p>
              <CreateTicketDialog
                teamId={currentTeam.id}
                userId={user?.id || ''}
                userName={user?.displayName || 'Unknown User'}
                userEmail={user?.primaryEmail || 'No email'}
                variant="default"
              />
            </div>
          ) : (
            <div className="space-y-3">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 border border-white/10 rounded-lg hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400 font-mono text-sm">#{ticket.id}</span>
                    <div>
                      <p className="font-medium text-sm">{ticket.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {ticket.creator_name} • {formatDate(ticket.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`${getSeverityColor(ticket.severity)} text-xs`}
                    >
                      {ticket.severity}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(ticket.status)} text-xs`}
                    >
                      {ticket.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <Link href="/dashboard/tickets">
                  <Button variant="ghost" size="sm" className="w-full">
                    View all tickets
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
