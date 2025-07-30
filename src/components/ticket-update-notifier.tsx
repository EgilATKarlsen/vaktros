"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Loader2, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle,
  Bell
} from "lucide-react";
import { Ticket } from "@/lib/db";

interface TicketUpdateNotifierProps {
  ticket: Ticket;
  onNotificationSent?: () => void;
}

export function TicketUpdateNotifier({ ticket, onNotificationSent }: TicketUpdateNotifierProps) {
  const [updateType, setUpdateType] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTypes = [
    { value: 'Comment Added', label: 'Comment Added' },
    { value: 'Investigation Started', label: 'Investigation Started' },
    { value: 'Solution Found', label: 'Solution Found' },
    { value: 'Requires Information', label: 'Requires Information' },
    { value: 'Escalated', label: 'Escalated' },
    { value: 'Assigned', label: 'Assigned' },
    { value: 'Other', label: 'Other' }
  ];

  const handleSendNotification = async () => {
    if (!updateType.trim()) {
      setError('Please select an update type');
      return;
    }

    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/tickets/${ticket.id}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updateType,
          updateDescription: updateDescription.trim(),
          notifyCreator: true
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setUpdateType('');
        setUpdateDescription('');
        onNotificationSent?.();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(data.error || 'Failed to send notification');
      }
    } catch (err) {
      console.error('Error sending update notification:', err);
      setError(err instanceof Error ? err.message : 'Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-500" />
          Notify Ticket Creator
        </CardTitle>
        <CardDescription>
          Send an SMS notification to {ticket.creator_name} about this ticket update
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {success && (
          <Alert className="border-green-500/20 bg-green-500/5">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700">
              Notification sent successfully to {ticket.creator_name}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="updateType">Update Type</Label>
          <Select value={updateType} onValueChange={setUpdateType}>
            <SelectTrigger>
              <SelectValue placeholder="Select update type" />
            </SelectTrigger>
            <SelectContent>
              {updateTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="updateDescription">Description (Optional)</Label>
          <Textarea
            id="updateDescription"
            placeholder="Add details about this update..."
            value={updateDescription}
            onChange={(e) => setUpdateDescription(e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            This will be included in the SMS notification to the ticket creator
          </p>
        </div>

        <Button
          onClick={handleSendNotification}
          disabled={sending || !updateType.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {sending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Notification...
            </>
          ) : (
            <>
              <MessageSquare className="mr-2 h-4 w-4" />
              Send SMS Notification
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <strong>Note:</strong> This will send an SMS to {ticket.creator_name} if they have:
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>A verified phone number</li>
            <li>SMS notifications enabled</li>
            <li>Valid consent for SMS notifications</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 