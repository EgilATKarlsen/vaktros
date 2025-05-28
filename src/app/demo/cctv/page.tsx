"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CctvDashboard from "@/components/demo/cctv-dashboard"
import LiveEventsTable from "@/components/demo/live-events-table"
import NaturalLanguageDetection from "@/components/demo/natural-language-detection"
import VideoSearch from "@/components/demo/video-search"
import PlaybackControls from "@/components/demo/playback-controls"
import AlertCustomization from "@/components/demo/alert-customization"
import TeamManagement from "@/components/demo/team-management"
import DemoLayout from "@/components/demo/demo-layout"
import { Camera, Activity, Brain, Search, Play, Settings, Users } from "lucide-react"

export default function CctvDemoPage() {
  const [activeTab, setActiveTab] = useState("monitoring")

  return (
    <DemoLayout
      title="Vaktros Security Platform"
      description="Complete AI-powered security monitoring and management system"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex w-full justify-between lg:grid lg:grid-cols-7 gap-1 bg-black/40 border border-white/10 p-1">
          <TabsTrigger 
            value="monitoring" 
            className="flex-shrink-0 w-10 h-10 lg:w-auto lg:h-auto flex items-center justify-center lg:justify-center gap-2 text-sm 
              data-[state=active]:bg-white/10 data-[state=active]:border-2 data-[state=active]:border-red-500/50
              data-[state=active]:shadow-[0_0_10px_rgba(239,68,68,0.1)] data-[state=active]:text-red-400 
              lg:data-[state=active]:bg-white lg:data-[state=active]:text-black lg:data-[state=active]:border-red-500/20 
              lg:data-[state=active]:shadow-[0_2px_10px_rgba(0,0,0,0.1)] lg:data-[state=active]:font-medium
              text-gray-200 rounded-md transition-all duration-200"
          >
            <Camera className="h-4 w-4 lg:mr-2 lg:data-[state=active]:text-red-500" />
            <span className="hidden lg:inline">Live Feeds</span>
          </TabsTrigger>
          <TabsTrigger 
            value="events" 
            className="flex-shrink-0 w-10 h-10 lg:w-auto lg:h-auto flex items-center justify-center lg:justify-center gap-2 text-sm 
              data-[state=active]:bg-white/10 data-[state=active]:border-2 data-[state=active]:border-red-500/50
              data-[state=active]:shadow-[0_0_10px_rgba(239,68,68,0.1)] data-[state=active]:text-red-400 
              lg:data-[state=active]:bg-white lg:data-[state=active]:text-black lg:data-[state=active]:border-red-500/20 
              lg:data-[state=active]:shadow-[0_2px_10px_rgba(0,0,0,0.1)] lg:data-[state=active]:font-medium
              text-gray-200 rounded-md transition-all duration-200"
          >
            <Activity className="h-4 w-4 lg:mr-2 lg:data-[state=active]:text-red-500" />
            <span className="hidden lg:inline">Events</span>
          </TabsTrigger>
          <TabsTrigger 
            value="detection" 
            className="flex-shrink-0 w-10 h-10 lg:w-auto lg:h-auto flex items-center justify-center lg:justify-center gap-2 text-sm 
              data-[state=active]:bg-white/10 data-[state=active]:border-2 data-[state=active]:border-red-500/50
              data-[state=active]:shadow-[0_0_10px_rgba(239,68,68,0.1)] data-[state=active]:text-red-400 
              lg:data-[state=active]:bg-white lg:data-[state=active]:text-black lg:data-[state=active]:border-red-500/20 
              lg:data-[state=active]:shadow-[0_2px_10px_rgba(0,0,0,0.1)] lg:data-[state=active]:font-medium
              text-gray-200 rounded-md transition-all duration-200"
          >
            <Brain className="h-4 w-4 lg:mr-2 lg:data-[state=active]:text-red-500" />
            <span className="hidden lg:inline">AI Rules</span>
          </TabsTrigger>
          <TabsTrigger 
            value="search" 
            className="flex-shrink-0 w-10 h-10 lg:w-auto lg:h-auto flex items-center justify-center lg:justify-center gap-2 text-sm 
              data-[state=active]:bg-white/10 data-[state=active]:border-2 data-[state=active]:border-red-500/50
              data-[state=active]:shadow-[0_0_10px_rgba(239,68,68,0.1)] data-[state=active]:text-red-400 
              lg:data-[state=active]:bg-white lg:data-[state=active]:text-black lg:data-[state=active]:border-red-500/20 
              lg:data-[state=active]:shadow-[0_2px_10px_rgba(0,0,0,0.1)] lg:data-[state=active]:font-medium
              text-gray-200 rounded-md transition-all duration-200"
          >
            <Search className="h-4 w-4 lg:mr-2 lg:data-[state=active]:text-red-500" />
            <span className="hidden lg:inline">Search</span>
          </TabsTrigger>
          <TabsTrigger 
            value="playback" 
            className="flex-shrink-0 w-10 h-10 lg:w-auto lg:h-auto flex items-center justify-center lg:justify-center gap-2 text-sm 
              data-[state=active]:bg-white/10 data-[state=active]:border-2 data-[state=active]:border-red-500/50
              data-[state=active]:shadow-[0_0_10px_rgba(239,68,68,0.1)] data-[state=active]:text-red-400 
              lg:data-[state=active]:bg-white lg:data-[state=active]:text-black lg:data-[state=active]:border-red-500/20 
              lg:data-[state=active]:shadow-[0_2px_10px_rgba(0,0,0,0.1)] lg:data-[state=active]:font-medium
              text-gray-200 rounded-md transition-all duration-200"
          >
            <Play className="h-4 w-4 lg:mr-2 lg:data-[state=active]:text-red-500" />
            <span className="hidden lg:inline">Playback</span>
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="flex-shrink-0 w-10 h-10 lg:w-auto lg:h-auto flex items-center justify-center lg:justify-center gap-2 text-sm 
              data-[state=active]:bg-white/10 data-[state=active]:border-2 data-[state=active]:border-red-500/50
              data-[state=active]:shadow-[0_0_10px_rgba(239,68,68,0.1)] data-[state=active]:text-red-400 
              lg:data-[state=active]:bg-white lg:data-[state=active]:text-black lg:data-[state=active]:border-red-500/20 
              lg:data-[state=active]:shadow-[0_2px_10px_rgba(0,0,0,0.1)] lg:data-[state=active]:font-medium
              text-gray-200 rounded-md transition-all duration-200"
          >
            <Settings className="h-4 w-4 lg:mr-2 lg:data-[state=active]:text-red-500" />
            <span className="hidden lg:inline">Settings</span>
          </TabsTrigger>
          <TabsTrigger 
            value="team" 
            className="flex-shrink-0 w-10 h-10 lg:w-auto lg:h-auto flex items-center justify-center lg:justify-center gap-2 text-sm 
              data-[state=active]:bg-white/10 data-[state=active]:border-2 data-[state=active]:border-red-500/50
              data-[state=active]:shadow-[0_0_10px_rgba(239,68,68,0.1)] data-[state=active]:text-red-400 
              lg:data-[state=active]:bg-white lg:data-[state=active]:text-black lg:data-[state=active]:border-red-500/20 
              lg:data-[state=active]:shadow-[0_2px_10px_rgba(0,0,0,0.1)] lg:data-[state=active]:font-medium
              text-gray-200 rounded-md transition-all duration-200"
          >
            <Users className="h-4 w-4 lg:mr-2 lg:data-[state=active]:text-red-500" />
            <span className="hidden lg:inline">Team</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Main CCTV Dashboard - takes up 3 columns */}
              <div className="xl:col-span-3">
                <CctvDashboard />
              </div>

              {/* Side panel with quick events - takes up 1 column */}
              <div className="space-y-4">
                <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-3">Recent Events</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {[
                      { time: "2 min ago", event: "Motion detected - Front Entrance", severity: "low" },
                      { time: "5 min ago", event: "Person entered - Back Window", severity: "high" },
                      { time: "8 min ago", event: "Vehicle parked - Parking Lot", severity: "medium" },
                      { time: "12 min ago", event: "Loitering detected - Front Entrance", severity: "medium" },
                    ].map((item, index) => (
                      <div key={index} className="p-2 bg-black/30 rounded border border-white/10 text-sm">
                        <div className="flex justify-between items-start">
                          <span className="text-gray-300">{item.event}</span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              item.severity === "high"
                                ? "bg-red-500/20 text-red-400"
                                : item.severity === "medium"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {item.severity}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-3">System Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cameras Online</span>
                      <span className="text-green-400 font-mono">4/4</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">AI Processing</span>
                      <span className="text-green-400 font-mono">Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Storage</span>
                      <span className="text-yellow-400 font-mono">78%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Network</span>
                      <span className="text-green-400 font-mono">Stable</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <LiveEventsTable />
          </TabsContent>

          <TabsContent value="detection">
            <NaturalLanguageDetection />
          </TabsContent>

          <TabsContent value="search">
            <VideoSearch />
          </TabsContent>

          <TabsContent value="playback">
            <PlaybackControls />
          </TabsContent>

          <TabsContent value="settings">
            <AlertCustomization />
          </TabsContent>

          <TabsContent value="team">
            <TeamManagement />
          </TabsContent>
        </div>
      </Tabs>
    </DemoLayout>
  )
}
