"use client";

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Router, 
  Signal, 
  Users, 
  Gauge, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Activity
} from "lucide-react";
import { useDashboardHeader } from "@/components/dashboard-header-context";

// Sample data
const sampleData = {
  ispHealth: {
    status: "excellent",
    latency: 12,
    packetLoss: 0.1,
    jitter: 2.3,
    uptime: 99.8
  },
  accessPoints: [
    { name: "AP-Main-Floor", status: "online", clients: 24, signalStrength: -42, uptime: 99.9 },
    { name: "AP-Second-Floor", status: "online", clients: 18, signalStrength: -38, uptime: 99.7 },
    { name: "AP-Basement", status: "warning", clients: 8, signalStrength: -55, uptime: 97.2 },
    { name: "AP-Outdoor", status: "online", clients: 12, signalStrength: -45, uptime: 99.5 }
  ],
  totalClients: 62,
  speedTest: {
    download: 950.2,
    upload: 45.8,
    lastTest: "2024-01-15T10:30:00Z"
  },
  traffic: {
    dailyDownload: 2.4, // GB
    dailyUpload: 0.8, // GB
    hourlyData: [
      { hour: "00:00", download: 0.1, upload: 0.05 },
      { hour: "06:00", download: 0.3, upload: 0.1 },
      { hour: "09:00", download: 0.8, upload: 0.2 },
      { hour: "12:00", download: 0.6, upload: 0.15 },
      { hour: "15:00", download: 0.4, upload: 0.12 },
      { hour: "18:00", download: 0.9, upload: 0.25 },
      { hour: "21:00", download: 0.7, upload: 0.18 }
    ]
  },
  uptime: {
    overall: 99.2,
    last24h: 100,
    last7days: 99.8,
    last30days: 99.2
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "online": return "bg-green-500";
    case "warning": return "bg-yellow-500";
    case "offline": return "bg-red-500";
    default: return "bg-gray-500";
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "online": return <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/20">Online</Badge>;
    case "warning": return <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20">Warning</Badge>;
    case "offline": return <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/20">Offline</Badge>;
    default: return <Badge>Unknown</Badge>;
  }
};

const getSignalStrengthColor = (strength: number) => {
  if (strength >= -40) return "text-green-400";
  if (strength >= -50) return "text-yellow-400";
  return "text-red-400";
};

export default function NetworkDashboardPage() {
  const { setHeader } = useDashboardHeader();

  useEffect(() => {
    setHeader('Network Dashboard', 'Monitor your UniFi network infrastructure and performance metrics');
  }, [setHeader]);

  return (
    <div className="space-y-6">
      {/* ISP Health Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ISP Status</p>
                <p className="text-lg font-bold text-green-400">Excellent</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Latency</p>
                <p className="text-lg font-bold text-blue-400">{sampleData.ispHealth.latency}ms</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Packet Loss</p>
                <p className="text-lg font-bold text-green-400">{sampleData.ispHealth.packetLoss}%</p>
              </div>
              <Signal className="h-8 w-8 text-green-500/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                <p className="text-lg font-bold text-purple-400">{sampleData.ispHealth.uptime}%</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Access Points Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Router className="h-5 w-5" />
              Access Points
            </CardTitle>
            <CardDescription>
              Status and performance of wireless access points
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleData.accessPoints.map((ap, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(ap.status)}`}></div>
                    <div>
                      <p className="font-medium">{ap.name}</p>
                      <p className="text-sm text-muted-foreground">{ap.clients} clients connected</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(ap.status)}
                    </div>
                    <p className={`text-sm font-medium ${getSignalStrengthColor(ap.signalStrength)}`}>
                      {ap.signalStrength} dBm
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Speed Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Speed Test Results
            </CardTitle>
            <CardDescription>
              Latest internet speed measurements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Download Speed</span>
                  <span className="text-lg font-bold text-green-400">{sampleData.speedTest.download} Mbps</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Upload Speed</span>
                  <span className="text-lg font-bold text-blue-400">{sampleData.speedTest.upload} Mbps</span>
                </div>
                <Progress value={76} className="h-2" />
              </div>

              <div className="pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  Last test: {new Date(sampleData.speedTest.lastTest).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connected Clients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Connected Clients
            </CardTitle>
            <CardDescription>
              Total devices connected to the network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">{sampleData.totalClients}</div>
              <p className="text-muted-foreground">Active connections</p>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-green-400">48</div>
                  <p className="text-sm text-muted-foreground">Wireless</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-purple-400">14</div>
                  <p className="text-sm text-muted-foreground">Wired</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Traffic Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Daily Traffic
            </CardTitle>
            <CardDescription>
              Network throughput over the past 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Download Today</span>
                <span className="text-lg font-bold text-green-400">{sampleData.traffic.dailyDownload} GB</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Upload Today</span>
                <span className="text-lg font-bold text-blue-400">{sampleData.traffic.dailyUpload} GB</span>
              </div>

              <div className="pt-4 border-t border-border/50">
                <h4 className="text-sm font-medium mb-3">Hourly Traffic Pattern</h4>
                <div className="space-y-2">
                  {sampleData.traffic.hourlyData.map((data, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground w-12">{data.hour}</span>
                      <div className="flex-1 flex gap-1">
                        <div className="flex-1">
                          <Progress value={(data.download / 1) * 100} className="h-1" />
                        </div>
                        <div className="flex-1">
                          <Progress value={(data.upload / 0.3) * 100} className="h-1" />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground w-16">
                        ↓{data.download}G ↑{data.upload}G
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Uptime Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Network Uptime
          </CardTitle>
          <CardDescription>
            Historical uptime statistics for your network infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">{sampleData.uptime.last24h}%</div>
              <p className="text-sm text-muted-foreground">Last 24 Hours</p>
              <Progress value={sampleData.uptime.last24h} className="mt-2 h-2" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">{sampleData.uptime.last7days}%</div>
              <p className="text-sm text-muted-foreground">Last 7 Days</p>
              <Progress value={sampleData.uptime.last7days} className="mt-2 h-2" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">{sampleData.uptime.last30days}%</div>
              <p className="text-sm text-muted-foreground">Last 30 Days</p>
              <Progress value={sampleData.uptime.last30days} className="mt-2 h-2" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">{sampleData.uptime.overall}%</div>
              <p className="text-sm text-muted-foreground">Overall</p>
              <Progress value={sampleData.uptime.overall} className="mt-2 h-2" />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last outage:</span>
              <span>3 days ago (2 minutes)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 