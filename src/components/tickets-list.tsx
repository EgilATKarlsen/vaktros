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
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search tickets by title, description, creator, or ID..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10 border-white/10 bg-background"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
            <SelectTrigger className="w-32 border-white/10">
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
            <SelectTrigger className="w-32 border-white/10">
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
            <SelectTrigger className="w-40 border-white/10">
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
            <Button variant="outline" size="sm" onClick={clearFilters} className="border-white/10">
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredTickets.length} of {tickets.length} tickets
        </span>
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span className="text-xs">Filters active:</span>
            {filters.status !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                Status: {filters.status}
              </Badge>
            )}
            {filters.severity !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                Severity: {filters.severity}
              </Badge>
            )}
            {filters.category !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                Category: {filters.category}
              </Badge>
            )}
            {filters.search && (
              <Badge variant="secondary" className="text-xs">
                Search: &ldquo;{filters.search}&rdquo;
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {hasActiveFilters 
                  ? "Try adjusting your search or filter criteria"
                  : "No tickets match your current filters"
                }
              </p>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
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
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 flex items-center gap-2">
                      <span className="text-blue-400">#{ticket.id}</span>
                      {ticket.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {ticket.creator_name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(ticket.created_at)}
                      </div>
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
                      className={`${getStatusColor(ticket.status)} text-xs flex items-center gap-1`}
                    >
                      {getStatusIcon(ticket.status)}
                      {ticket.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {ticket.category}
                    </Badge>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {ticket.description}
                    </p>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {ticket.updated_at !== ticket.created_at && (
                      <span>Updated {formatDate(ticket.updated_at)}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 