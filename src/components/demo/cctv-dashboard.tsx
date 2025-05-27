"use client"

import { useState, useEffect } from "react"
import { Play, Pause, Settings, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BoundingBox {
  id: string
  x: number
  y: number
  width: number
  height: number
  label: string
  confidence: number
  color: string
}

interface Camera {
  id: string
  name: string
  location: string
  status: "online" | "offline"
  boundingBoxes: BoundingBox[]
  hasAlert?: boolean
}

export default function CctvDashboard() {
  const [cameras] = useState<Camera[]>([
    {
      id: "cam-001",
      name: "Front Entrance",
      location: "Main Building",
      status: "online",
      boundingBoxes: [
        {
          id: "person-1",
          x: 45,
          y: 30,
          width: 15,
          height: 25,
          label: "Person",
          confidence: 0.94,
          color: "#10b981",
        },
      ],
      hasAlert: false,
    },
    {
      id: "cam-002",
      name: "Back Window",
      location: "Rear Access",
      status: "online",
      boundingBoxes: [
        {
          id: "intruder-1",
          x: 65,
          y: 40,
          width: 20,
          height: 30,
          label: "Unauthorized Entry",
          confidence: 0.89,
          color: "#ef4444",
        },
      ],
      hasAlert: true,
    },
    {
      id: "cam-003",
      name: "Parking Lot",
      location: "West Side",
      status: "online",
      boundingBoxes: [
        {
          id: "vehicle-1",
          x: 25,
          y: 50,
          width: 30,
          height: 20,
          label: "Vehicle",
          confidence: 0.97,
          color: "#3b82f6",
        },
      ],
      hasAlert: false,
    },
    {
      id: "cam-004",
      name: "Storage Room",
      location: "Basement",
      status: "online",
      boundingBoxes: [],
      hasAlert: false,
    },
  ])

  const [isPlaying, setIsPlaying] = useState(true)

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Live CCTV Monitoring</h2>
        <div className="flex items-center gap-4">
          <Button size="icon" variant="outline" className="bg-black/50 border-white/20 text-gray-200 hover:text-white hover:bg-black/70" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button size="icon" variant="outline" className="bg-black/50 border-white/20 text-gray-200 hover:text-white hover:bg-black/70">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {cameras.map((camera) => (
          <CameraFeed key={camera.id} camera={camera} isPlaying={isPlaying} />
        ))}
      </div>
    </div>
  )
}

function CameraFeed({ camera, isPlaying }: { camera: Camera; isPlaying: boolean }) {
  const [currentBoxes, setCurrentBoxes] = useState(camera.boundingBoxes)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      // Simulate moving bounding boxes
      setCurrentBoxes((boxes) =>
        boxes.map((box) => ({
          ...box,
          x: Math.max(5, Math.min(85, box.x + (Math.random() - 0.5) * 2)),
          y: Math.max(5, Math.min(75, box.y + (Math.random() - 0.5) * 2)),
        })),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div
      className={`relative bg-gray-900 rounded-lg overflow-hidden aspect-video ${
        camera.hasAlert ? "ring-2 ring-red-500 ring-opacity-50" : ""
      }`}
    >
      {/* Camera Feed Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
        {/* Simulated video noise */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Alert indicator */}
      {camera.hasAlert && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          ALERT
        </div>
      )}

      {/* Camera Info */}
      <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${camera.status === "online" ? "bg-green-500" : "bg-red-500"}`} />
          <span>{camera.name}</span>
        </div>
      </div>

      {/* Timestamp */}
      <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-gray-300">
        {new Date().toLocaleTimeString()}
      </div>

      {/* Bounding Boxes */}
      {currentBoxes.map((box) => (
        <div
          key={box.id}
          className="absolute border-2 transition-all duration-1000"
          style={{
            left: `${box.x}%`,
            top: `${box.y}%`,
            width: `${box.width}%`,
            height: `${box.height}%`,
            borderColor: box.color,
            boxShadow: `0 0 10px ${box.color}50`,
          }}
        >
          <div
            className="absolute -top-6 left-0 px-2 py-1 rounded text-xs font-medium text-white"
            style={{ backgroundColor: box.color }}
          >
            {box.label} ({Math.round(box.confidence * 100)}%)
          </div>
        </div>
      ))}

      {/* Recording Indicator */}
      {isPlaying && (
        <div className="absolute bottom-2 left-2 flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs text-red-400">REC</span>
        </div>
      )}
    </div>
  )
}
