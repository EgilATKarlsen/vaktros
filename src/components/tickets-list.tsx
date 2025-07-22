"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Clock, 
  User, 
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  X
} from "lucide-react";
import { Ticket } from "@/lib/db";

interface TicketsListProps {
  tickets: Ticket[];
  selectedTicketId?: number | null;
  onTicketSelect?: (ticket: Ticket) => void;
}

interface FilterState {
  status: string;
  severity: string;
  category: string;
  search: string;
}

export function TicketsList({ tickets, selectedTicketId, onTicketSelect }: TicketsListProps) {
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    severity: 'all',
    category: 'all',
    search: ''
  });

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      // Status filter
      if (filters.status !== 'all' && ticket.status !== filters.status) {
        return false;
      }

      // Severity filter
      if (filters.severity !== 'all' && ticket.severity !== filters.severity) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && ticket.category !== filters.category) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          ticket.title.toLowerCase().includes(searchLower) ||
          ticket.description.toLowerCase().includes(searchLower) ||
          ticket.creator_name.toLowerCase().includes(searchLower) ||
          ticket.id.toString().includes(searchLower)
        );
      }

      return true;
    });
  }, [tickets, filters]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <AlertCircle className="w-4 h-4" />;
      case 'In Progress':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'Resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'Closed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      severity: 'all',
      category: 'all',
      search: ''
    });
  };

  const hasActiveFilters = filters.status !== 'all' || filters.severity !== 'all' || 
                          filters.category !== 'all' || filters.search !== '';

  const handleTicketClick = (ticket: Ticket) => {
    if (onTicketSelect) {
      onTicketSelect(ticket);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Search Bar - Full width on mobile */}
        <div className="w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search tickets..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10 border-white/10 bg-background text-sm"
            />
          </div>
        </div>

        {/* Filter Controls - Stack on mobile */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 sm:items-center">
          {/* Status Filter */}
          <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
            <SelectTrigger className="w-full sm:w-32 border-white/10 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          {/* Severity Filter */}
          <Select value={filters.severity} onValueChange={(value) => setFilters(prev => ({ ...prev, severity: value }))}>
            <SelectTrigger className="w-full sm:w-32 border-white/10 text-sm">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
            <SelectTrigger className="w-full sm:w-40 border-white/10 text-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Technical">Technical</SelectItem>
              <SelectItem value="Billing">Billing</SelectItem>
              <SelectItem value="Feature Request">Feature Request</SelectItem>
              <SelectItem value="Bug Report">Bug Report</SelectItem>
              <SelectItem value="General Support">General Support</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="border-white/10 w-full sm:w-auto text-sm">
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-muted-foreground gap-2">
        <span>
          Showing {filteredTickets.length} of {tickets.length} tickets
        </span>
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <span className="text-xs">Filters:</span>
            {filters.status !== 'all' && (
              <Badge variant="secondary" className="text-xs px-2 py-0">
                {filters.status}
              </Badge>
            )}
            {filters.severity !== 'all' && (
              <Badge variant="secondary" className="text-xs px-2 py-0">
                {filters.severity}
              </Badge>
            )}
            {filters.category !== 'all' && (
              <Badge variant="secondary" className="text-xs px-2 py-0">
                {filters.category.replace(' ', '')}
              </Badge>
            )}
            {filters.search && (
              <Badge variant="secondary" className="text-xs px-2 py-0 max-w-20 truncate">
                &ldquo;{filters.search}&rdquo;
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Tickets List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredTickets.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
              <Search className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">No tickets found</h3>
              <p className="text-muted-foreground text-center mb-4 text-sm px-4">
                {hasActiveFilters 
                  ? "Try adjusting your search or filter criteria"
                  : "No tickets match your current filters"
                }
              </p>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters} className="text-sm">
                  Clear filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card 
              key={ticket.id} 
              className={`transition-colors cursor-pointer ${
                selectedTicketId === ticket.id 
                  ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/15' 
                  : 'hover:bg-accent/5 border-white/10'
              }`}
              onClick={() => handleTicketClick(ticket)}
            >
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-0">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg mb-1 sm:mb-2 flex items-center gap-2">
                      <span className="text-blue-400 text-sm sm:text-base">#{ticket.id}</span>
                      <span className="truncate">{ticket.title}</span>
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{ticket.creator_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="text-xs">{formatDate(ticket.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge 
                      variant="outline" 
                      className={`${getSeverityColor(ticket.severity)} text-xs px-2 py-0`}
                    >
                      {ticket.severity}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(ticket.status)} text-xs flex items-center gap-1 px-2 py-0`}
                    >
                      {getStatusIcon(ticket.status)}
                      <span className="hidden sm:inline">{ticket.status}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <Badge variant="secondary" className="mb-2 text-xs px-2 py-0">
                      {ticket.category}
                    </Badge>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      {ticket.description}
                    </p>
                  </div>
                  
                  {ticket.updated_at !== ticket.created_at && (
                    <div className="text-xs text-muted-foreground">
                      <span>Updated {formatDate(ticket.updated_at)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 