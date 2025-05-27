"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, FileText, Video, ImageIcon, Calendar, Clock, Filter } from "lucide-react"

interface ExportItem {
  id: string
  type: "video" | "report" | "image"
  title: string
  timestamp: Date
  duration?: string
  size: string
  camera: string
  status: "ready" | "processing" | "failed"
}

export default function ExportReports() {
  const [exportItems] = useState<ExportItem[]>([
    {
      id: "exp-001",
      type: "video",
      title: "Unauthorized Entry Incident",
      timestamp: new Date(Date.now() - 3600000),
      duration: "00:02:45",
      size: "45.2 MB",
      camera: "Back Window",
      status: "ready",
    },
    {
      id: "exp-002",
      type: "report",
      title: "Daily Security Summary",
      timestamp: new Date(Date.now() - 86400000),
      size: "2.1 MB",
      camera: "All Cameras",
      status: "ready",
    },
    {
      id: "exp-003",
      type: "video",
      title: "Loitering Detection",
      timestamp: new Date(Date.now() - 7200000),
      duration: "00:05:12",
      size: "78.9 MB",
      camera: "Front Entrance",
      status: "processing",
    },
    {
      id: "exp-004",
      type: "image",
      title: "Suspicious Activity Screenshot",
      timestamp: new Date(Date.now() - 1800000),
      size: "1.8 MB",
      camera: "Parking Lot",
      status: "ready",
    },
  ])

  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video
      case "report":
        return FileText
      case "image":
        return ImageIcon
      default:
        return FileText
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "text-green-400 bg-green-500/20"
      case "processing":
        return "text-yellow-400 bg-yellow-500/20"
      case "failed":
        return "text-red-400 bg-red-500/20"
      default:
        return "text-gray-400 bg-gray-500/20"
    }
  }

  return (
    <div className="space-y-8">
      {/* Export Controls */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-6">Create New Export</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Date Range</h4>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-400">Start Date</label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                  className="bg-black/50 border-white/20"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">End Date</label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                  className="bg-black/50 border-white/20"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Export Type</h4>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Video className="h-4 w-4 mr-2" />
                Video Clips
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Incident Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ImageIcon className="h-4 w-4 mr-2" />
                Screenshots
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Filters</h4>
            <div className="space-y-2">
              <select className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-sm">
                <option>All Cameras</option>
                <option>Front Entrance</option>
                <option>Back Window</option>
                <option>Parking Lot</option>
                <option>Storage Room</option>
              </select>
              <select className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-sm">
                <option>All Event Types</option>
                <option>Intrusion</option>
                <option>Theft</option>
                <option>Loitering</option>
                <option>Suspicious Behavior</option>
              </select>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Create Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Export History */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Export History</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {exportItems.map((item) => {
            const TypeIcon = getTypeIcon(item.type)
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-black/50 rounded-lg">
                    <TypeIcon className="h-5 w-5 text-gray-400" />
                  </div>

                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.timestamp.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.timestamp.toLocaleTimeString()}
                      </div>
                      <span>{item.camera}</span>
                      {item.duration && <span>{item.duration}</span>}
                      <span>{item.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>

                  {item.status === "ready" && (
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}

                  {item.status === "processing" && (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400" />
                      <span className="text-sm text-yellow-400">Processing...</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-6">Report Templates</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: "Daily Summary",
              description: "Overview of all security events for the day",
              icon: FileText,
            },
            {
              name: "Incident Report",
              description: "Detailed analysis of specific security incidents",
              icon: FileText,
            },
            {
              name: "Weekly Analytics",
              description: "Comprehensive weekly security analytics and trends",
              icon: FileText,
            },
            {
              name: "Compliance Report",
              description: "Security compliance and audit documentation",
              icon: FileText,
            },
            {
              name: "Performance Metrics",
              description: "System performance and detection accuracy metrics",
              icon: FileText,
            },
            {
              name: "Custom Report",
              description: "Create a custom report with specific parameters",
              icon: FileText,
            },
          ].map((template, index) => {
            const Icon = template.icon
            return (
              <div
                key={index}
                className="p-4 bg-black/30 rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-black/50 rounded-lg">
                    <Icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{template.name}</h4>
                    <p className="text-sm text-gray-400">{template.description}</p>
                    <Button size="sm" variant="ghost" className="mt-2 p-0 h-auto text-blue-400">
                      Generate →
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
