"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Building, CreditCard, MapPin, Briefcase, AlertTriangle } from "lucide-react";
import { TeamSettingsForm } from "@/components/team-settings-form";
import { useDashboardHeader } from "@/components/dashboard-header-context";
import { useUser } from "@stackframe/stack";

interface Team {
  id: string;
  displayName: string;
  clientMetadata?: Record<string, unknown>;
}

interface LocationMetadata {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
}

interface TeamMetadata {
  subscription?: string;
  billingPeriodEnd?: string;
  location?: LocationMetadata;
  industry?: string;
}

export default function SettingsPage() {
  const user = useUser();
  const { setHeader } = useDashboardHeader();
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!user) {
        redirect("/dashboard/teams");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const userTeams = await user.listTeams();
        const team = userTeams?.[0] || null;

        if (!team) {
          redirect("/dashboard/teams");
          return;
        }

        // Check if user has admin permissions
        let adminStatus = false;
        try {
          const permissions = await user.listPermissions(team);
          adminStatus = permissions.some(permission => permission.id === 'team_admin');
        } catch (error) {
          console.warn("Error checking user permissions:", error);
        }

        if (!adminStatus) {
          redirect("/dashboard/teams");
          return;
        }

        setCurrentTeam(team);
        setIsAdmin(adminStatus);
        setHeader('Team Settings', `Manage settings and configuration for ${team.displayName}`);

      } catch (error) {
        console.error('Error loading settings data:', error);
        setError('Failed to load settings data. Please try again.');
        setHeader('Team Settings', 'Error loading settings');
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
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-red-400">Error Loading Settings</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentTeam || !isAdmin) {
    return null;
  }

  // Get current team metadata
  const teamMetadata = (currentTeam.clientMetadata || {}) as TeamMetadata;
  const location = teamMetadata.location || {};
  
  const organizationData = {
    subscription: teamMetadata.subscription || 'Trial',
    billingPeriodEnd: teamMetadata.billingPeriodEnd || '',
    location: {
      street: location.street || '',
      city: location.city || '',
      state: location.state || '',
      country: location.country || '',
      zip: location.zip || '',
    },
    industry: teamMetadata.industry || 'Tech',
  };

  return (
    <div className="space-y-6">
      {/* Team Information Overview */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-500" />
            {currentTeam.displayName}
          </CardTitle>
          <CardDescription>
            Organization overview and current subscription status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Subscription:</span>
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  organizationData.subscription === 'Trial' 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : 'bg-green-500/20 text-green-400'
                }`}
              >
                {organizationData.subscription}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Industry:</span>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs">
                {organizationData.industry}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Location:</span>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 text-xs">
                {organizationData.location.city || organizationData.location.country || 'Not set'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Organization Settings
          </CardTitle>
          <CardDescription>
            Update your organization information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TeamSettingsForm 
            teamId={currentTeam.id}
            initialData={organizationData}
          />
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="h-5 w-5" />
            Important Security Notice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Admin Access Required:</strong> Only team administrators can modify these settings.
            </p>
            <p>
              <strong className="text-foreground">Data Protection:</strong> All organization data is encrypted and stored securely.
            </p>
            <p>
              <strong className="text-foreground">Audit Trail:</strong> All changes to team settings are logged for security purposes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 