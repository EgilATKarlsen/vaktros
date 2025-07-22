"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Ticket as TicketIcon, 
  Plus,
  X
} from "lucide-react";
import { Ticket } from "@/lib/db";
import { TicketsList } from "@/components/tickets-list";
import { TicketDetailPanel } from "@/components/ticket-detail-panel";
import { useDashboardHeader } from "@/components/dashboard-header-context";
import Link from "next/link";
import { useUser } from "@stackframe/stack";

interface Team {
  id: string;
  displayName: string;
}

interface TicketsResponse {
  tickets: Ticket[];
  team: Team;
}

export default function TicketsPage() {
  const user = useUser();
  const { setHeader } = useDashboardHeader();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
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

        const data: TicketsResponse = await response.json();
        setTickets(data.tickets);
        setCurrentTeam(data.team);

        // Set the header title and subheading
        setHeader('Support Tickets', `Manage and track all support requests for ${data.team.displayName}`);

      } catch (error) {
        console.error('Error loading tickets:', error);
        setError('Failed to load tickets. Please try again.');
        setHeader('Support Tickets', 'Error loading tickets');
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
          <p className="text-muted-foreground">Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <TicketIcon className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-red-400">Error Loading Tickets</h3>
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

  // Calculate ticket statistics
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length,
  };

  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseDetail = () => {
    setSelectedTicket(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-blue-500/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-400">{stats.total}</p>
              </div>
              <TicketIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Open</p>
                <p className="text-lg sm:text-2xl font-bold text-orange-400">{stats.open}</p>
              </div>
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-orange-500"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-400">{stats.inProgress}</p>
              </div>
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-yellow-500"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-lg sm:text-2xl font-bold text-green-400">{stats.resolved}</p>
              </div>
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-500"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Detail Panel - Full Screen Overlay */}
      {selectedTicket && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white dark:bg-gray-900">
          <div className="h-full flex flex-col">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCloseDetail}
                  className="border-white/10 hover:bg-white/5"
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <TicketIcon className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 font-mono text-sm">#{selectedTicket.id}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Ticket Details
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-auto bg-white dark:bg-gray-900">
              <TicketDetailPanel 
                ticket={selectedTicket} 
                onClose={handleCloseDetail}
                isMobile={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Desktop Split Layout */}
      <div className={`grid gap-4 sm:gap-6 ${selectedTicket ? 'hidden lg:grid lg:grid-cols-3' : 'grid-cols-1'} transition-all duration-300`}>
        {/* Ticket Detail Panel - Left 1/3 - Desktop Only */}
        {selectedTicket && (
          <div className="lg:col-span-1">
            <Card className="h-[calc(100vh-300px)] border-blue-500/20">
              <TicketDetailPanel 
                ticket={selectedTicket} 
                onClose={handleCloseDetail}
              />
            </Card>
          </div>
        )}

        {/* All Tickets - Right 2/3 or Full Width */}
        <div className={selectedTicket ? "lg:col-span-2" : "lg:col-span-1"}>
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-2">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <TicketIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    All Tickets
                    {selectedTicket && (
                      <span className="text-xs sm:text-sm font-normal text-muted-foreground ml-2 hidden sm:inline">
                        (Click a ticket to view details)
                      </span>
                    )}
                  </CardTitle>
                </div>
                <Link href="/dashboard/tickets/create">
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="sm:inline">Create Ticket</span>
                  </Button>
                </Link>
              </div>
              <CardDescription className="text-xs sm:text-sm">
                Complete list of support tickets for your team with search and filtering
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              {tickets.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <TicketIcon className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2">No Support Tickets</h3>
                  <p className="text-muted-foreground mb-4 text-sm sm:text-base px-4">
                    Your team hasn&apos;t submitted any support tickets yet.
                  </p>
                  <Link href="/dashboard/tickets/create">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Ticket
                    </Button>
                  </Link>
                </div>
              ) : (
                <TicketsList 
                  tickets={tickets} 
                  selectedTicketId={selectedTicket?.id}
                  onTicketSelect={handleTicketSelect}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 