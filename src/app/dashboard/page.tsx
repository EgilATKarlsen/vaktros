import { stackServerApp } from "@/stack";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Shield, 
  AlertTriangle, 
  Activity,
  Users,
  BarChart3,
  Building
} from "lucide-react";

export default async function DashboardPage() {
  const user = await stackServerApp.getUser({ or: "redirect" });

  // Get user's teams - use the correct API to get only teams the user belongs to
  const userTeams = await user.listTeams();
  const currentTeam = userTeams?.[0] || null;

  // Mock data - in a real app, this would come from your API
  const stats = {
    activeCameras: 24,
    threatsDetected: 3,
    alertsToday: 12,
    systemUptime: "99.9%",
    connectedUsers: 8,
    dataProcessed: "2.4TB"
  };

  const recentAlerts = [
    {
      id: 1,
      type: "threat",
      message: "Unauthorized access detected at Gate B",
      time: "2 minutes ago",
      severity: "high"
    },
    {
      id: 2,
      type: "motion",
      message: "Motion detected in restricted area",
      time: "15 minutes ago",
      severity: "medium"
    },
    {
      id: 3,
      type: "system",
      message: "Camera 12 connection restored",
      time: "1 hour ago",
      severity: "low"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section with Team Info */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {user.displayName || "Agent"}
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your surveillance network today.
          </p>
        </div>
        
        {currentTeam && (
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-red-500" />
            <div className="text-right">
              <p className="text-sm font-medium">{currentTeam.displayName}</p>
              <p className="text-xs text-muted-foreground">
                Team network
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Team Status Card (if user has a team) */}
      {currentTeam && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-500" />
              Team: {currentTeam.displayName}
            </CardTitle>
            <CardDescription>
              Organization surveillance network status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium">Team Status</p>
                  <p className="text-lg font-bold">Active</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Your Access</p>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                    Member
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Team surveillance network active
                </p>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  Connected
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-red-500/20 hover:border-red-500/40 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Cameras</CardTitle>
              <Camera className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCameras}</div>
            <p className="text-xs text-muted-foreground">
              {currentTeam ? "Team network" : "All systems"} operational
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 hover:border-red-500/40 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Threats Detected</CardTitle>
              <Shield className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.threatsDetected}</div>
            <p className="text-xs text-muted-foreground">
              +2 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 hover:border-red-500/40 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Alerts Today</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.alertsToday}</div>
            <p className="text-xs text-muted-foreground">
              3 high priority
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 hover:border-red-500/40 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
              <Activity className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.systemUptime}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 hover:border-red-500/40 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Connected Users</CardTitle>
              <Users className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.connectedUsers}</div>
            <p className="text-xs text-muted-foreground">
              Currently online
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 hover:border-red-500/40 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Data Processed</CardTitle>
              <BarChart3 className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dataProcessed}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card className="border-red-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Recent Alerts
            {currentTeam && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 ml-2">
                {currentTeam.displayName}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Latest security notifications from your surveillance network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.severity === 'high' ? 'bg-red-500' :
                    alert.severity === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
                <Badge 
                  variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
                  className={
                    alert.severity === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    'bg-green-500/20 text-green-400 border-green-500/30'
                  }
                >
                  {alert.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
