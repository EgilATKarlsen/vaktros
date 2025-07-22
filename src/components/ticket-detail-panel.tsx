"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  User, 
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  Hash,
  Tag,
  FileText,
  X
} from "lucide-react";
import { Ticket } from "@/lib/db";

interface TicketDetailPanelProps {
  ticket: Ticket;
  onClose: () => void;
  isMobile?: boolean;
}

export function TicketDetailPanel({ ticket, onClose, isMobile = false }: TicketDetailPanelProps) {
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

  const formatLongDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header - Hidden on mobile since we have a dedicated mobile header */}
      {!isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-mono text-sm">#{ticket.id}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Content */}
      <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-3' : 'p-4'} space-y-4 sm:space-y-6`}>
        {/* Title and Status */}
        <div>
          <h3 className={`font-semibold mb-3 leading-tight ${isMobile ? 'text-base' : 'text-lg'}`}>{ticket.title}</h3>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge 
              variant="outline" 
              className={`${getStatusColor(ticket.status)} flex items-center gap-1 text-xs`}
            >
              {getStatusIcon(ticket.status)}
              {ticket.status}
            </Badge>
            <Badge 
              variant="outline" 
              className={`${getSeverityColor(ticket.severity)} text-xs`}
            >
              {ticket.severity}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {ticket.category}
            </Badge>
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Description</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <p className={`text-muted-foreground whitespace-pre-wrap ${isMobile ? 'text-sm' : 'text-sm'}`}>
              {ticket.description}
            </p>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Ticket Details */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm font-medium">Ticket Details</h4>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Created by</p>
                <p className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'} truncate`}>{ticket.creator_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'} truncate`}>{ticket.creator_email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Created</p>
                <p className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{formatLongDate(ticket.created_at)}</p>
              </div>
            </div>

            {ticket.updated_at !== ticket.created_at && (
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Last updated</p>
                  <p className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{formatLongDate(ticket.updated_at)}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Priority</p>
                <Badge 
                  variant="outline" 
                  className={`${getSeverityColor(ticket.severity)} text-xs`}
                >
                  {ticket.severity}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Actions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Actions</h4>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size={isMobile ? "default" : "sm"} 
              className="w-full justify-start border-white/10 h-11 sm:h-10"
            >
              <Mail className="w-4 h-4 mr-2" />
              Reply to Ticket
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}