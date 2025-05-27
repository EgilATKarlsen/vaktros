"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Eye, Shield, Clock, ChevronDown, ChevronRight, User, Check, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SecurityEvent {
  id: string
  timestamp: Date
  type: "intrusion" | "theft" | "loitering" | "unauthorized_access" | "suspicious_behavior"
  camera: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  status: "active" | "investigating" | "resolved"
  notifiedUsers: NotifiedUser[]
  assignedTo?: string
  closedBy?: string
  closedAt?: Date
  resolutionNotes?: string
}

interface NotifiedUser {
  id: string
  name: string
  role: string
  notifiedAt: Date
  acknowledged: boolean
  acknowledgedAt?: Date
}

const eventTypes = {
  intrusion: { icon: AlertTriangle, color: "text-red-500" },
  theft: { icon: Shield, color: "text-orange-500" },
  loitering: { icon: Clock, color: "text-yellow-500" },
  unauthorized_access: { icon: Eye, color: "text-red-600" },
  suspicious_behavior: { icon: AlertTriangle, color: "text-amber-500" },
}

export default function LiveEventsTable() {
  const [timeFilter, setTimeFilter] = useState<"live" | "1h" | "24h" | "7d" | "30d" | "custom">("live")
  const [customDateRange, setCustomDateRange] = useState({
    start: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  })
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "investigating" | "resolved">("all")
  const [severityFilter, setSeverityFilter] = useState<"all" | "critical" | "high" | "medium" | "low">("all")

  const [events, setEvents] = useState<SecurityEvent[]>([
    {
      id: "evt-001",
      timestamp: new Date(Date.now() - 30000),
      type: "unauthorized_access",
      camera: "Back Window",
      description: "Person detected entering through rear window",
      severity: "critical",
      status: "investigating",
      assignedTo: "Mike Rodriguez",
      notifiedUsers: [
        {
          id: "user-1",
          name: "Mike Rodriguez",
          role: "Security Supervisor",
          notifiedAt: new Date(Date.now() - 25000),
          acknowledged: true,
          acknowledgedAt: new Date(Date.now() - 20000),
        },
        {
          id: "user-2",
          name: "Sarah Chen",
          role: "Security Guard",
          notifiedAt: new Date(Date.now() - 25000),
          acknowledged: true,
          acknowledgedAt: new Date(Date.now() - 18000),
        },
        {
          id: "user-3",
          name: "David Park",
          role: "Facility Manager",
          notifiedAt: new Date(Date.now() - 25000),
          acknowledged: false,
        },
      ],
    },
    {
      id: "evt-002",
      timestamp: new Date(Date.now() - 120000),
      type: "suspicious_behavior",
      camera: "Front Entrance",
      description: "Individual loitering near entrance for 5+ minutes",
      severity: "medium",
      status: "resolved",
      assignedTo: "Sarah Chen",
      closedBy: "Sarah Chen",
      closedAt: new Date(Date.now() - 60000),
      resolutionNotes: "Person was waiting for ride pickup. No threat identified.",
      notifiedUsers: [
        {
          id: "user-2",
          name: "Sarah Chen",
          role: "Security Guard",
          notifiedAt: new Date(Date.now() - 115000),
          acknowledged: true,
          acknowledgedAt: new Date(Date.now() - 110000),
        },
        {
          id: "user-4",
          name: "Emma Thompson",
          role: "Security Guard",
          notifiedAt: new Date(Date.now() - 115000),
          acknowledged: true,
          acknowledgedAt: new Date(Date.now() - 105000),
        },
      ],
    },
    {
      id: "evt-003",
      timestamp: new Date(Date.now() - 300000),
      type: "theft",
      camera: "Storage Room",
      description: "Unauthorized removal of equipment detected",
      severity: "high",
      status: "resolved",
      assignedTo: "Mike Rodriguez",
      closedBy: "Mike Rodriguez",
      closedAt: new Date(Date.now() - 240000),
      resolutionNotes: "Equipment was being moved by authorized maintenance staff. Updated access logs.",
      notifiedUsers: [
        {
          id: "user-1",
          name: "Mike Rodriguez",
          role: "Security Supervisor",
          notifiedAt: new Date(Date.now() - 295000),
          acknowledged: true,
          acknowledgedAt: new Date(Date.now() - 290000),
        },
        {
          id: "user-3",
          name: "David Park",
          role: "Facility Manager",
          notifiedAt: new Date(Date.now() - 295000),
          acknowledged: true,
          acknowledgedAt: new Date(Date.now() - 285000),
        },
        {
          id: "user-5",
          name: "Lisa Martinez",
          role: "Operations Manager",
          notifiedAt: new Date(Date.now() - 295000),
          acknowledged: true,
          acknowledgedAt: new Date(Date.now() - 280000),
        },
      ],
    },
  ])

  // Add historical events for demonstration
  const [historicalEvents] = useState<SecurityEvent[]>([
    // Yesterday's events
    {
      id: "evt-hist-001",
      timestamp: new Date(Date.now() - 86400000 - 3600000), // 25 hours ago
      type: "theft",
      camera: "Storage Room",
      description: "Unauthorized equipment removal detected",
      severity: "high",
      status: "resolved",
      assignedTo: "Mike Rodriguez",
      closedBy: "Mike Rodriguez",
      closedAt: new Date(Date.now() - 86400000 - 1800000),
      resolutionNotes: "False alarm - authorized maintenance activity",
      notifiedUsers: [
        {
          id: "user-1",
          name: "Mike Rodriguez",
          role: "Security Supervisor",
          notifiedAt: new Date(Date.now() - 86400000 - 3500000),
          acknowledged: true,
          acknowledgedAt: new Date(Date.now() - 86400000 - 3400000),
        },
      ],
    },
    // Last week's events
    {
      id: "evt-hist-002",
      timestamp: new Date(Date.now() - 7 * 86400000), // 7 days ago
      type: "intrusion",
      camera: "Back Window",
      description: "Person detected entering through rear window",
      severity: "critical",
      status: "resolved",
      assignedTo: "Sarah Chen",
      closedBy: "Sarah Chen",
      closedAt: new Date(Date.now() - 7 * 86400000 + 1800000),
      resolutionNotes: "Security breach confirmed. Police notified and suspect apprehended.",
      notifiedUsers: [
        {
          id: "user-2",
          name: "Sarah Chen",
          role: "Security Guard",
          notifiedAt: new Date(Date.now() - 7 * 86400000 - 300000),
          acknowledged: true,
          acknowledgedAt: new Date(Date.now() - 7 * 86400000 - 240000),
        },
      ],
    },
  ])

  // Filter events based on selected filters
  const getFilteredEvents = () => {
    let eventsToShow = [...events]

    // Add historical events based on time filter
    if (timeFilter !== "live") {
      const now = Date.now()
      let cutoffTime = now

      switch (timeFilter) {
        case "1h":
          cutoffTime = now - 60 * 60 * 1000
          break
        case "24h":
          cutoffTime = now - 24 * 60 * 60 * 1000
          break
        case "7d":
          cutoffTime = now - 7 * 24 * 60 * 60 * 1000
          break
        case "30d":
          cutoffTime = now - 30 * 24 * 60 * 60 * 1000
          break
        case "custom":
          const startTime = new Date(customDateRange.start).getTime()
          const endTime = new Date(customDateRange.end).getTime() + 24 * 60 * 60 * 1000 // End of day
          eventsToShow = [...events, ...historicalEvents].filter(
            (event) => event.timestamp.getTime() >= startTime && event.timestamp.getTime() <= endTime,
          )
          break
      }

      if (timeFilter !== "custom") {
        eventsToShow = [...events, ...historicalEvents].filter((event) => event.timestamp.getTime() >= cutoffTime)
      }
    }

    // Apply status filter
    if (statusFilter !== "all") {
      eventsToShow = eventsToShow.filter((event) => event.status === statusFilter)
    }

    // Apply severity filter
    if (severityFilter !== "all") {
      eventsToShow = eventsToShow.filter((event) => event.severity === severityFilter)
    }

    // Sort by timestamp (newest first)
    return eventsToShow.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  const filteredEvents = getFilteredEvents()

  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set())

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new events
      if (Math.random() > 0.8) {
        const newEvent: SecurityEvent = {
          id: `evt-${Date.now()}`,
          timestamp: new Date(),
          type: ["intrusion", "theft", "loitering", "suspicious_behavior"][Math.floor(Math.random() * 4)] as SecurityEvent["type"],
          camera: ["Front Entrance", "Back Window", "Parking Lot", "Storage Room"][Math.floor(Math.random() * 4)],
          description: "New security event detected",
          severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as SecurityEvent["severity"],
          status: "active",
          notifiedUsers: [
            {
              id: "user-1",
              name: "Mike Rodriguez",
              role: "Security Supervisor",
              notifiedAt: new Date(),
              acknowledged: false,
            },
            {
              id: "user-2",
              name: "Sarah Chen",
              role: "Security Guard",
              notifiedAt: new Date(),
              acknowledged: false,
            },
          ],
        }

        setEvents((prev) => [newEvent, ...prev.slice(0, 9)])
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvents((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(eventId)) {
        newSet.delete(eventId)
      } else {
        newSet.add(eventId)
      }
      return newSet
    })
  }

  const assignEvent = (eventId: string, userId: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              status: "investigating" as const,
              assignedTo: event.notifiedUsers.find((u) => u.id === userId)?.name,
            }
          : event,
      ),
    )
  }

  const closeEvent = (eventId: string, notes: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              status: "resolved" as const,
              closedBy: event.assignedTo || "System",
              closedAt: new Date(),
              resolutionNotes: notes,
            }
          : event,
      ),
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-100/10"
      case "high":
        return "text-red-500 bg-red-100/10"
      case "medium":
        return "text-yellow-500 bg-yellow-100/10"
      case "low":
        return "text-green-500 bg-green-100/10"
      default:
        return "text-gray-500 bg-gray-100/10"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-red-400 bg-red-500/20"
      case "investigating":
        return "text-yellow-400 bg-yellow-500/20"
      case "resolved":
        return "text-green-400 bg-green-500/20"
      default:
        return "text-gray-400 bg-gray-500/20"
    }
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold">Security Events</h3>
          {timeFilter === "live" && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-400">Live</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Filter */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as "live" | "1h" | "24h" | "7d" | "30d" | "custom")}
            className="bg-black/50 border border-white/20 rounded px-3 py-2 text-sm"
          >
            <option value="live">Live Events</option>
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "investigating" | "resolved")}
            className="bg-black/50 border border-white/20 rounded px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as "all" | "critical" | "high" | "medium" | "low")}
            className="bg-black/50 border border-white/20 rounded px-3 py-2 text-sm"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Custom Date Range */}
      {timeFilter === "custom" && (
        <div className="mb-4 p-4 bg-black/30 rounded-lg border border-white/10">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Start Date</label>
              <input
                type="date"
                value={customDateRange.start}
                onChange={(e) => setCustomDateRange((prev) => ({ ...prev, start: e.target.value }))}
                className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">End Date</label>
              <input
                type="date"
                value={customDateRange.end}
                onChange={(e) => setCustomDateRange((prev) => ({ ...prev, end: e.target.value }))}
                className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Event Count */}
      <div className="mb-4 text-sm text-gray-400">
        Showing {filteredEvents.length} events
        {timeFilter !== "live" && timeFilter !== "custom" && ` from ${timeFilter}`}
        {timeFilter === "custom" && ` from ${customDateRange.start} to ${customDateRange.end}`}
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {filteredEvents.map((event) => {
          const EventIcon = eventTypes[event.type].icon
          const isExpanded = expandedEvents.has(event.id)

          return (
            <div
              key={event.id}
              className="bg-black/30 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
            >
              {/* Main Event Row */}
              <div className="flex items-start gap-3 p-3">
                <div className={`p-2 rounded-lg bg-black/50 ${eventTypes[event.type].color}`}>
                  <EventIcon className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{event.camera}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(event.severity)}`}>
                        {event.severity.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-2">{event.description}</p>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{event.timestamp.toLocaleTimeString()}</span>
                    <div className="flex items-center gap-2">
                      {event.assignedTo && (
                        <span className="text-blue-400">
                          <User className="h-3 w-3 inline mr-1" />
                          {event.assignedTo}
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleEventExpansion(event.id)}
                        className="h-6 px-2 text-xs"
                      >
                        {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-white/10 p-4 space-y-4">
                  {/* Notification Details */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-gray-300">Notifications Sent</h4>
                    <div className="space-y-2">
                      {event.notifiedUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-2 bg-black/30 rounded border border-white/10"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-2 h-2 rounded-full ${user.acknowledged ? "bg-green-500" : "bg-yellow-500"}`}
                            />
                            <div>
                              <span className="text-sm font-medium">{user.name}</span>
                              <span className="text-xs text-gray-400 ml-2">({user.role})</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            {user.acknowledged ? (
                              <>
                                <Check className="h-3 w-3 text-green-500" />
                                <span>Ack: {user.acknowledgedAt?.toLocaleTimeString()}</span>
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 text-yellow-500" />
                                <span>Pending</span>
                              </>
                            )}
                            {event.status === "active" && !event.assignedTo && user.acknowledged && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs"
                                onClick={() => assignEvent(event.id, user.id)}
                              >
                                Take Task
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resolution Details */}
                  {event.status === "resolved" && event.closedBy && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-gray-300">Resolution</h4>
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium text-green-400">Resolved by {event.closedBy}</span>
                          <span className="text-xs text-gray-400">at {event.closedAt?.toLocaleTimeString()}</span>
                        </div>
                        {event.resolutionNotes && <p className="text-sm text-gray-300">{event.resolutionNotes}</p>}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {event.status === "investigating" && event.assignedTo && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => closeEvent(event.id, "Issue resolved successfully")}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Mark Resolved
                      </Button>
                      <Button size="sm" variant="outline">
                        Add Notes
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
