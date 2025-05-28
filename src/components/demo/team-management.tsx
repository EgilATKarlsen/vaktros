"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Users,
  UserPlus,
  Shield,
  Eye,
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Edit,
  Trash2,
  Crown,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "owner" | "admin" | "supervisor" | "guard" | "viewer"
  status: "active" | "inactive" | "pending"
  lastActive: Date
  permissions: {
    viewLiveFeeds: boolean
    manageAlerts: boolean
    accessPlayback: boolean
    manageUsers: boolean
    systemSettings: boolean
    exportData: boolean
  }
  notifications: {
    push: boolean
    email: boolean
    sms: boolean
    call: boolean
  }
  assignedCameras: string[]
  joinedAt: Date
}

const roleDefinitions = {
  owner: {
    name: "Owner",
    description: "Full system access and billing management",
    icon: Crown,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/50",
  },
  admin: {
    name: "Administrator",
    description: "Full operational access, can manage users",
    icon: Shield,
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/50",
  },
  supervisor: {
    name: "Supervisor",
    description: "Monitor all cameras, manage alerts and settings",
    icon: Eye,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/50",
  },
  guard: {
    name: "Security Guard",
    description: "Monitor assigned cameras, respond to alerts",
    icon: Shield,
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/50",
  },
  viewer: {
    name: "Viewer",
    description: "View-only access to assigned cameras",
    icon: Eye,
    color: "text-gray-400",
    bgColor: "bg-gray-500/20",
    borderColor: "border-gray-500/50",
  },
}

const availableCameras = [
  { id: "cam-001", name: "Front Entrance" },
  { id: "cam-002", name: "Back Window" },
  { id: "cam-003", name: "Parking Lot" },
  { id: "cam-004", name: "Storage Room" },
]

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "user-1",
      name: "Mike Rodriguez",
      email: "mike@company.com",
      role: "admin",
      status: "active",
      lastActive: new Date(Date.now() - 300000), // 5 minutes ago
      permissions: {
        viewLiveFeeds: true,
        manageAlerts: true,
        accessPlayback: true,
        manageUsers: true,
        systemSettings: true,
        exportData: true,
      },
      notifications: {
        push: true,
        email: true,
        sms: true,
        call: true,
      },
      assignedCameras: ["cam-001", "cam-002", "cam-003", "cam-004"],
      joinedAt: new Date(Date.now() - 86400000 * 30), // 30 days ago
    },
    {
      id: "user-2",
      name: "Sarah Chen",
      email: "sarah@company.com",
      role: "supervisor",
      status: "active",
      lastActive: new Date(Date.now() - 600000), // 10 minutes ago
      permissions: {
        viewLiveFeeds: true,
        manageAlerts: true,
        accessPlayback: true,
        manageUsers: false,
        systemSettings: false,
        exportData: true,
      },
      notifications: {
        push: true,
        email: true,
        sms: false,
        call: false,
      },
      assignedCameras: ["cam-001", "cam-003"],
      joinedAt: new Date(Date.now() - 86400000 * 15), // 15 days ago
    },
    {
      id: "user-3",
      name: "David Park",
      email: "david@company.com",
      role: "guard",
      status: "active",
      lastActive: new Date(Date.now() - 1800000), // 30 minutes ago
      permissions: {
        viewLiveFeeds: true,
        manageAlerts: false,
        accessPlayback: true,
        manageUsers: false,
        systemSettings: false,
        exportData: false,
      },
      notifications: {
        push: true,
        email: false,
        sms: true,
        call: false,
      },
      assignedCameras: ["cam-002", "cam-004"],
      joinedAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
    },
    {
      id: "user-4",
      name: "Emma Thompson",
      email: "emma@company.com",
      role: "viewer",
      status: "inactive",
      lastActive: new Date(Date.now() - 86400000 * 2), // 2 days ago
      permissions: {
        viewLiveFeeds: true,
        manageAlerts: false,
        accessPlayback: false,
        manageUsers: false,
        systemSettings: false,
        exportData: false,
      },
      notifications: {
        push: false,
        email: true,
        sms: false,
        call: false,
      },
      assignedCameras: ["cam-001"],
      joinedAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
    },
  ])

  const [showAddMember, setShowAddMember] = useState(false)
  const [showRoleDefinitions, setShowRoleDefinitions] = useState(false)
  const [expandedMembers, setExpandedMembers] = useState<Record<string, boolean>>({})
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "guard" as TeamMember["role"],
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-500/20"
      case "inactive":
        return "text-gray-400 bg-gray-500/20"
      case "pending":
        return "text-yellow-400 bg-yellow-500/20"
      default:
        return "text-gray-400 bg-gray-500/20"
    }
  }

  const formatLastActive = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const addMember = () => {
    if (!newMember.name || !newMember.email) return

    const member: TeamMember = {
      id: `user-${Date.now()}`,
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      status: "pending",
      lastActive: new Date(),
      permissions: getDefaultPermissions(newMember.role),
      notifications: {
        push: true,
        email: true,
        sms: false,
        call: false,
      },
      assignedCameras: [],
      joinedAt: new Date(),
    }

    setTeamMembers([...teamMembers, member])
    setNewMember({ name: "", email: "", role: "guard" })
    setShowAddMember(false)
  }

  const getDefaultPermissions = (role: TeamMember["role"]) => {
    switch (role) {
      case "owner":
      case "admin":
        return {
          viewLiveFeeds: true,
          manageAlerts: true,
          accessPlayback: true,
          manageUsers: true,
          systemSettings: true,
          exportData: true,
        }
      case "supervisor":
        return {
          viewLiveFeeds: true,
          manageAlerts: true,
          accessPlayback: true,
          manageUsers: false,
          systemSettings: false,
          exportData: true,
        }
      case "guard":
        return {
          viewLiveFeeds: true,
          manageAlerts: false,
          accessPlayback: true,
          manageUsers: false,
          systemSettings: false,
          exportData: false,
        }
      case "viewer":
        return {
          viewLiveFeeds: true,
          manageAlerts: false,
          accessPlayback: false,
          manageUsers: false,
          systemSettings: false,
          exportData: false,
        }
    }
  }

  const updateMemberStatus = (memberId: string, status: TeamMember["status"]) => {
    setTeamMembers((members) => members.map((member) => (member.id === memberId ? { ...member, status } : member)))
  }

  const removeMember = (memberId: string) => {
    setTeamMembers((members) => members.filter((member) => member.id !== memberId))
  }

  const toggleMemberDetails = (memberId: string) => {
    setExpandedMembers(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-400" />
            <h3 className="text-xl font-bold">Team Management</h3>
          </div>
          <Button onClick={() => setShowAddMember(true)} className="bg-blue-600 hover:bg-blue-700 text-white border-0">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/30 rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold text-green-400">
              {teamMembers.filter((m) => m.status === "active").length}
            </div>
            <div className="text-sm text-gray-400">Active Members</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold text-yellow-400">
              {teamMembers.filter((m) => m.status === "pending").length}
            </div>
            <div className="text-sm text-gray-400">Pending Invites</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold text-blue-400">
              {teamMembers.filter((m) => m.role === "admin" || m.role === "owner").length}
            </div>
            <div className="text-sm text-gray-400">Administrators</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold text-purple-400">{teamMembers.length}</div>
            <div className="text-sm text-gray-400">Total Members</div>
          </div>
        </div>
      </div>

      {/* Add Member Form */}
      {showAddMember && (
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h4 className="text-lg font-bold mb-4">Add New Team Member</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                placeholder="Full name"
                className="bg-black/50 border-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                placeholder="email@company.com"
                className="bg-black/50 border-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value as TeamMember["role"] })}
                className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-sm"
              >
                <option value="guard">Security Guard</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin">Administrator</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={addMember} className="bg-green-600 hover:bg-green-700 text-white border-0">
              Send Invitation
            </Button>
            <Button variant="outline" onClick={() => setShowAddMember(false)} className="border-white/20 text-white bg-black/30">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Team Members List */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h4 className="text-lg font-bold mb-4">Team Members</h4>
        <div className="space-y-4">
          {teamMembers.map((member) => {
            const roleInfo = roleDefinitions[member.role]
            const RoleIcon = roleInfo.icon
            const showDetails = expandedMembers[member.id] || false

            return (
              <div
                key={member.id}
                className="bg-black/30 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors"
              >
                {/* Mobile View (Compact) */}
                <div className="md:hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-md font-bold">{member.name.charAt(0)}</span>
                      </div>
                      
                      {/* Basic Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-semibold">{member.name}</h5>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(member.status)}`}>
                            {member.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{member.email}</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleMemberDetails(member.id)}
                      className="p-1 text-gray-400 hover:text-white hover:bg-black/50"
                    >
                      {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {/* Mobile Expanded Details */}
                  {showDetails && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                      {/* Role & Activity */}
                      <div className="space-y-1">
                        <h6 className="text-xs font-medium text-gray-400">Role & Activity</h6>
                        <div className="flex items-center gap-2">
                          <RoleIcon className={`h-3 w-3 ${roleInfo.color}`} />
                          <span className="text-sm">{roleInfo.name}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p>Joined {member.joinedAt.toLocaleDateString()}</p>
                          <p>Last active {formatLastActive(member.lastActive)}</p>
                        </div>
                      </div>
                      
                      {/* Assigned Cameras */}
                      <div className="space-y-1">
                        <h6 className="text-xs font-medium text-gray-400">Assigned Cameras</h6>
                        {member.assignedCameras.length === 0 ? (
                          <p className="text-xs text-gray-500">None assigned</p>
                        ) : member.assignedCameras.length === availableCameras.length ? (
                          <p className="text-xs text-blue-400">All cameras</p>
                        ) : (
                          <p className="text-xs text-blue-400">
                            {member.assignedCameras
                              .map((id) => availableCameras.find((cam) => cam.id === id)?.name)
                              .join(", ")}
                          </p>
                        )}
                      </div>
                      
                      {/* Notification Preferences */}
                      <div className="space-y-1">
                        <h6 className="text-xs font-medium text-gray-400">Notifications</h6>
                        <div className="flex items-center gap-3">
                          {member.notifications.push && (
                            <div className="flex items-center gap-1">
                              <Bell className="h-3 w-3 text-blue-400" />
                              <span className="text-xs">Push</span>
                            </div>
                          )}
                          {member.notifications.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-green-400" />
                              <span className="text-xs">Email</span>
                            </div>
                          )}
                          {member.notifications.sms && (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3 text-yellow-400" />
                              <span className="text-xs">SMS</span>
                            </div>
                          )}
                          {member.notifications.call && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-red-400" />
                              <span className="text-xs">Call</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="pt-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {member.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateMemberStatus(member.id, "active")}
                                className="text-green-400 border-green-400/30 hover:bg-green-400/20 bg-black/30"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeMember(member.id)}
                                className="text-red-400 border-red-400/30 hover:bg-red-400/20 bg-black/30"
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}

                          {member.status === "active" && member.role !== "owner" && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setShowAddMember(true)}
                                className="border-white/20 hover:bg-black/50 text-white bg-black/30"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateMemberStatus(member.id, "inactive")}
                                className="text-yellow-400 border-yellow-400/30 hover:bg-yellow-400/20 bg-black/30"
                              >
                                Deactivate
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeMember(member.id)}
                                className="text-red-400 border-red-400/30 hover:bg-red-400/20 bg-black/30"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}

                          {member.status === "inactive" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateMemberStatus(member.id, "active")}
                              className="text-green-400 border-green-400/30 hover:bg-green-400/20 bg-black/30"
                            >
                              Reactivate
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop View (Full) */}
                <div className="hidden md:block">
                  <div className="flex flex-row items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold">{member.name.charAt(0)}</span>
                      </div>

                      {/* Member Info */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h5 className="font-semibold">{member.name}</h5>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(member.status)}`}>
                            {member.status}
                          </span>
                          {member.role === "owner" && <Crown className="h-4 w-4 text-purple-400" />}
                        </div>

                        <p className="text-sm text-gray-400 mb-2">{member.email}</p>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2">
                          <div className="flex items-center gap-1">
                            <RoleIcon className={`h-3 w-3 ${roleInfo.color}`} />
                            <span>{roleInfo.name}</span>
                          </div>
                          <span>Joined {member.joinedAt.toLocaleDateString()}</span>
                          <span>Last active {formatLastActive(member.lastActive)}</span>
                        </div>

                        {/* Assigned Cameras */}
                        <div className="mt-2">
                          <span className="text-xs text-gray-400">Cameras: </span>
                          {member.assignedCameras.length === 0 ? (
                            <span className="text-xs text-gray-500">None assigned</span>
                          ) : member.assignedCameras.length === availableCameras.length ? (
                            <span className="text-xs text-blue-400">All cameras</span>
                          ) : (
                            <span className="text-xs text-blue-400">
                              {member.assignedCameras
                                .map((id) => availableCameras.find((cam) => cam.id === id)?.name)
                                .join(", ")}
                            </span>
                          )}
                        </div>

                        {/* Notification Preferences */}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-400">Notifications:</span>
                          {member.notifications.push && <Bell className="h-3 w-3 text-blue-400" />}
                          {member.notifications.email && <Mail className="h-3 w-3 text-green-400" />}
                          {member.notifications.sms && <MessageSquare className="h-3 w-3 text-yellow-400" />}
                          {member.notifications.call && <Phone className="h-3 w-3 text-red-400" />}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      {member.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateMemberStatus(member.id, "active")}
                            className="text-green-400 border-green-400/30 hover:bg-green-400/20 bg-black/30"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeMember(member.id)}
                            className="text-red-400 border-red-400/30 hover:bg-red-400/20 bg-black/30"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}

                      {member.status === "active" && member.role !== "owner" && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setShowAddMember(true)}
                            className="border-white/20 hover:bg-black/50 text-white bg-black/30"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateMemberStatus(member.id, "inactive")}
                            className="text-yellow-400 border-yellow-400/30 hover:bg-yellow-400/20 bg-black/30"
                          >
                            Deactivate
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeMember(member.id)}
                            className="text-red-400 border-red-400/30 hover:bg-red-400/20 bg-black/30"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}

                      {member.status === "inactive" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateMemberStatus(member.id, "active")}
                          className="text-green-400 border-green-400/30 hover:bg-green-400/20 bg-black/30"
                        >
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Role Definitions - Collapsible */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={() => setShowRoleDefinitions(!showRoleDefinitions)}
        >
          <h4 className="text-lg font-bold">Role Permissions</h4>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-black/50"
          >
            {showRoleDefinitions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        {showRoleDefinitions && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {Object.entries(roleDefinitions).map(([roleKey, role]) => {
              const RoleIcon = role.icon
              const permissions = getDefaultPermissions(roleKey as TeamMember["role"])

              return (
                <div key={roleKey} className={`p-4 rounded-lg border ${role.bgColor} ${role.borderColor}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <RoleIcon className={`h-5 w-5 ${role.color}`} />
                    <h5 className="font-semibold">{role.name}</h5>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{role.description}</p>
                  <div className="space-y-1 text-xs">
                    {Object.entries(permissions).map(([perm, enabled]) => (
                      <div key={perm} className="flex items-center gap-2">
                        {enabled ? (
                          <CheckCircle className="h-3 w-3 text-green-400" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-400" />
                        )}
                        <span className={enabled ? "text-gray-300" : "text-gray-500"}>
                          {perm.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
