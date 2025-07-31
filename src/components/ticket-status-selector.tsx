"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Clock, 
  XCircle 
} from "lucide-react";
import { Ticket } from "@/lib/db";

interface TicketStatusSelectorProps {
  ticket: Ticket;
  onStatusUpdate?: (updatedTicket: Ticket) => void;
}

const STATUS_OPTIONS = [
  { value: 'Open', label: 'Open', color: 'bg-blue-500/20 text-blue-400 border-blue-500/20' },
  { value: 'In Progress', label: 'In Progress', color: 'bg-orange-500/20 text-orange-400 border-orange-500/20' },
  { value: 'Resolved', label: 'Resolved', color: 'bg-green-500/20 text-green-400 border-green-500/20' },
  { value: 'Closed', label: 'Closed', color: 'bg-gray-500/20 text-gray-400 border-gray-500/20' },
];

export function TicketStatusSelector({ ticket, onStatusUpdate }: TicketStatusSelectorProps) {
  const [selectedStatus, setSelectedStatus] = useState(ticket.status);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const currentStatusOption = STATUS_OPTIONS.find(option => option.value === ticket.status);

  const handleStatusUpdate = async () => {
    if (selectedStatus === ticket.status) {
      return; // No change
    }

    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/tickets/${ticket.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Status updated to ${selectedStatus}. SMS notifications sent to team members.`);
        if (onStatusUpdate) {
          onStatusUpdate(data.ticket);
        }
      } else {
        throw new Error(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating ticket status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update status');
      setSelectedStatus(ticket.status); // Reset to current status
    } finally {
      setUpdating(false);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Current Status</label>
          <Badge 
            variant="outline" 
            className={currentStatusOption?.color}
          >
            {getStatusIcon(ticket.status)}
            <span className="ml-2">{ticket.status}</span>
          </Badge>
        </div>

        <div className="space-y-1 flex-1">
          <label className="text-sm font-medium">Update Status</label>
          <div className="flex gap-2">
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as Ticket['status'])}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(option.value)}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              onClick={handleStatusUpdate}
              disabled={updating || selectedStatus === ticket.status}
              size="sm"
            >
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </div>
  );
} 