"use client"

import { useState, useEffect } from "react"
import { Shield, X } from "lucide-react"

export default function PhoneNotification() {
  const [showNotification, setShowNotification] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowNotification(true)
      setNotificationCount((prev) => prev + 1)

      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowNotification(false)
      }, 5000)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Mobile Alerts</h3>

      <div className="relative">
        {/* Phone Frame */}
        <div className="w-64 h-96 mx-auto bg-gray-900 rounded-3xl p-2 border-2 border-gray-700">
          <div className="w-full h-full bg-black rounded-2xl relative overflow-hidden">
            {/* Phone Screen */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black">
              {/* Status Bar */}
              <div className="flex justify-between items-center p-4 text-white text-sm">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-2 border border-white rounded-sm">
                    <div className="w-3 h-1 bg-green-500 rounded-sm" />
                  </div>
                </div>
              </div>

              {/* Lock Screen */}
              <div className="flex flex-col items-center justify-center h-full text-white">
                <div className="text-6xl font-thin mb-2">9:41</div>
                <div className="text-lg text-gray-400 mb-8">Monday, December 18</div>

                {/* Notification */}
                <div
                  className={`transition-all duration-500 transform ${
                    showNotification ? "translate-y-0 opacity-100 scale-100" : "-translate-y-4 opacity-0 scale-95"
                  }`}
                >
                  {showNotification && (
                    <div className="bg-red-600/90 backdrop-blur-sm rounded-2xl p-4 mx-4 border border-red-500/50 animate-pulse">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-white">Vaktros Security</span>
                            <button
                              onClick={() => setShowNotification(false)}
                              className="text-white/70 hover:text-white"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-white/90 text-sm leading-tight">
                            🚨 CRITICAL ALERT: Unauthorized entry detected at Back Window camera. Person climbing
                            through rear window. Security team notified.
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-white/70 text-xs">now</span>
                            <div className="flex gap-2">
                              <button className="px-3 py-1 bg-white/20 rounded-lg text-xs text-white">View</button>
                              <button className="px-3 py-1 bg-white/20 rounded-lg text-xs text-white">Dismiss</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notification Badge */}
                {notificationCount > 0 && (
                  <div className="absolute top-20 right-8 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-bounce">
                    {notificationCount}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Vibration Effect */}
        {showNotification && (
          <div className="absolute inset-0 animate-pulse">
            <div className="w-64 h-96 mx-auto rounded-3xl border-2 border-red-500/50 animate-ping" />
          </div>
        )}
      </div>
    </div>
  )
}
