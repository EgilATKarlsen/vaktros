"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Bell, Mail, MessageSquare, Phone } from "lucide-react"

interface AlertRule {
  id: string
  name: string
  enabled: boolean
  threshold: number
  channels: string[]
  description: string
}

export default function AlertCustomization() {
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: "intrusion",
      name: "Unauthorized Entry",
      enabled: true,
      threshold: 85,
      channels: ["push", "email"],
      description: "Detect when someone enters through windows or restricted areas",
    },
    {
      id: "loitering",
      name: "Loitering Detection",
      enabled: true,
      threshold: 70,
      channels: ["push"],
      description: "Alert when people remain in an area for extended periods",
    },
    {
      id: "theft",
      name: "Theft Prevention",
      enabled: true,
      threshold: 90,
      channels: ["push", "email", "sms"],
      description: "Detect unauthorized removal of items or suspicious behavior",
    },
    {
      id: "violence",
      name: "Violence Detection",
      enabled: false,
      threshold: 95,
      channels: ["push", "email", "sms", "call"],
      description: "Identify aggressive behavior or physical altercations",
    },
  ])

  const [globalSettings, setGlobalSettings] = useState({
    quietHours: false,
    quietStart: "22:00",
    quietEnd: "06:00",
    maxAlertsPerHour: 10,
    escalationDelay: 5,
  })

  const notificationChannels = [
    { id: "push", name: "Push Notification", icon: Bell },
    { id: "email", name: "Email", icon: Mail },
    { id: "sms", name: "SMS", icon: MessageSquare },
    { id: "call", name: "Phone Call", icon: Phone },
  ]

  const updateAlertRule = (id: string, updates: Partial<AlertRule>) => {
    setAlertRules((rules) => rules.map((rule) => (rule.id === id ? { ...rule, ...updates } : rule)))
  }

  const toggleChannel = (ruleId: string, channelId: string) => {
    const rule = alertRules.find((r) => r.id === ruleId)
    if (!rule) return

    const channels = rule.channels.includes(channelId)
      ? rule.channels.filter((c) => c !== channelId)
      : [...rule.channels, channelId]

    updateAlertRule(ruleId, { channels })
  }

  return (
    <div className="space-y-8">
      {/* Global Settings */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-6">Global Alert Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Quiet Hours</label>
                <p className="text-xs text-gray-400">Reduce non-critical alerts during specified hours</p>
              </div>
              <Switch
                checked={globalSettings.quietHours}
                onCheckedChange={(checked) => setGlobalSettings((prev) => ({ ...prev, quietHours: checked }))}
              />
            </div>

            {globalSettings.quietHours && (
              <div className="grid grid-cols-2 gap-4 ml-4">
                <div>
                  <label className="text-xs text-gray-400">Start Time</label>
                  <input
                    type="time"
                    value={globalSettings.quietStart}
                    onChange={(e) => setGlobalSettings((prev) => ({ ...prev, quietStart: e.target.value }))}
                    className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">End Time</label>
                  <input
                    type="time"
                    value={globalSettings.quietEnd}
                    onChange={(e) => setGlobalSettings((prev) => ({ ...prev, quietEnd: e.target.value }))}
                    className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Max Alerts Per Hour</label>
              <p className="text-xs text-gray-400 mb-2">Prevent alert flooding</p>
              <div className="flex items-center gap-4">
                <Slider
                  value={[globalSettings.maxAlertsPerHour]}
                  max={50}
                  min={1}
                  step={1}
                  onValueChange={(value) => setGlobalSettings((prev) => ({ ...prev, maxAlertsPerHour: value[0] }))}
                  className="flex-1"
                />
                <span className="text-sm font-mono w-8">{globalSettings.maxAlertsPerHour}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Escalation Delay (minutes)</label>
              <p className="text-xs text-gray-400 mb-2">Time before escalating unacknowledged alerts</p>
              <div className="flex items-center gap-4">
                <Slider
                  value={[globalSettings.escalationDelay]}
                  max={30}
                  min={1}
                  step={1}
                  onValueChange={(value) => setGlobalSettings((prev) => ({ ...prev, escalationDelay: value[0] }))}
                  className="flex-1"
                />
                <span className="text-sm font-mono w-8">{globalSettings.escalationDelay}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Rules */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-6">Detection Rules</h3>

        <div className="space-y-6">
          {alertRules.map((rule) => (
            <div key={rule.id} className="bg-black/30 rounded-lg p-4 border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold">{rule.name}</h4>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={(checked) => updateAlertRule(rule.id, { enabled: checked })}
                    />
                  </div>
                  <p className="text-sm text-gray-400">{rule.description}</p>
                </div>
              </div>

              {rule.enabled && (
                <div className="space-y-4">
                  {/* Confidence Threshold */}
                  <div>
                    <label className="text-sm font-medium">Confidence Threshold</label>
                    <p className="text-xs text-gray-400 mb-2">Minimum confidence level to trigger alert</p>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[rule.threshold]}
                        max={100}
                        min={50}
                        step={5}
                        onValueChange={(value) => updateAlertRule(rule.id, { threshold: value[0] })}
                        className="flex-1"
                      />
                      <span className="text-sm font-mono w-12">{rule.threshold}%</span>
                    </div>
                  </div>

                  {/* Notification Channels */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Notification Channels</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {notificationChannels.map((channel) => {
                        const Icon = channel.icon
                        const isSelected = rule.channels.includes(channel.id)
                        return (
                          <button
                            key={channel.id}
                            onClick={() => toggleChannel(rule.id, channel.id)}
                            className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                              isSelected
                                ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                                : "bg-black/30 border-white/10 text-gray-400 hover:border-white/20"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="text-sm">{channel.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-4">
          <Button className="bg-green-600 hover:bg-green-700">Save Configuration</Button>
          <Button variant="outline">Test Alerts</Button>
        </div>
      </div>
    </div>
  )
}
