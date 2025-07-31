"use client";

import { useEffect, useState } from "react";
import { useUser } from "@stackframe/stack";
import { useDashboardHeader } from "@/components/dashboard-header-context";
import { UserProfileForm } from "@/components/user-profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Settings, History, CheckCircle, XCircle, Info, Loader2, AlertTriangle } from "lucide-react";

interface ConsentRecord {
  id: number;
  consentType: string;
  consentGiven: boolean;
  consentDate: string;
  consentMethod: string;
  legalBasis?: string;
  purpose?: string;
  withdrawalDate?: string;
  withdrawalMethod?: string;
  dataRetentionPeriod?: string;
}

export default function ProfilePage() {
  const user = useUser();
  const { setHeader } = useDashboardHeader();
  const [consentHistory, setConsentHistory] = useState<ConsentRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    setHeader('Profile Settings', 'Manage your account preferences and notification settings');
  }, [setHeader]);

  const fetchConsentHistory = async () => {
    setLoadingHistory(true);
    setHistoryError(null);

    try {
      const response = await fetch('/api/consent/history');
      const data = await response.json();

      if (data.success) {
        setConsentHistory(data.consentHistory);
      } else {
        throw new Error(data.error || 'Failed to fetch consent history');
      }
    } catch (err) {
      console.error('Error fetching consent history:', err);
      setHistoryError(err instanceof Error ? err.message : 'Failed to load consent history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleShowHistory = () => {
    if (!showHistory && consentHistory.length === 0) {
      fetchConsentHistory();
    }
    setShowHistory(!showHistory);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your basic account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-sm">{user.displayName || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-sm">{user.primaryEmail || 'Not set'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMS Notifications Settings */}
      <UserProfileForm />

      {/* Notification Preferences Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Types
          </CardTitle>
          <CardDescription>
            What notifications you&apos;ll receive when SMS is enabled
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Ticket Created</h4>
                <p className="text-sm text-muted-foreground">When new support tickets are submitted to your team</p>
              </div>
              <div className="text-sm text-green-600 font-medium">SMS Enabled</div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Your Ticket Updates</h4>
                <p className="text-sm text-muted-foreground">When your tickets are updated by team members</p>
              </div>
              <div className="text-sm text-green-600 font-medium">SMS Enabled</div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Status Changes</h4>
                <p className="text-sm text-muted-foreground">When ticket status changes (Open → In Progress → Resolved → Closed)</p>
              </div>
              <div className="text-sm text-green-600 font-medium">SMS Enabled</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GDPR Consent History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Consent History
          </CardTitle>
          <CardDescription>
            View your SMS consent history for transparency and compliance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This shows all consent-related activities for your account. This information is kept for legal compliance and transparency.
            </AlertDescription>
          </Alert>

          <Button
            variant="outline"
            onClick={handleShowHistory}
            disabled={loadingHistory}
            className="w-full"
          >
            {loadingHistory ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading History...
              </>
            ) : (
              <>
                <History className="mr-2 h-4 w-4" />
                {showHistory ? 'Hide' : 'View'} Consent History
              </>
            )}
          </Button>

          {historyError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{historyError}</AlertDescription>
            </Alert>
          )}

          {showHistory && (
            <div className="space-y-3">
              {consentHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No consent records found</p>
                  <p className="text-xs">Consent history will appear here when you interact with SMS settings</p>
                </div>
              ) : (
                consentHistory.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {record.consentGiven ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="font-medium">
                          {record.consentGiven ? 'Consent Given' : 'Consent Withdrawn'}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(record.consentDate)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><strong>Type:</strong> {record.consentType}</p>
                      <p><strong>Method:</strong> {record.consentMethod}</p>
                      {record.purpose && <p><strong>Purpose:</strong> {record.purpose}</p>}
                      {record.legalBasis && <p><strong>Legal Basis:</strong> {record.legalBasis}</p>}
                      {record.dataRetentionPeriod && <p><strong>Data Retention:</strong> {record.dataRetentionPeriod}</p>}
                      {record.withdrawalDate && (
                        <p><strong>Withdrawn:</strong> {formatDate(record.withdrawalDate)} via {record.withdrawalMethod}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 