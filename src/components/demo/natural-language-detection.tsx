"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Brain, Camera, Square, Trash2, Eye, EyeOff } from "lucide-react"

interface DetectionRule {
  id: string
  query: string
  cameras: string[]
  boundingBoxes: { [cameraId: string]: BoundingBox[] }
  createdAt: Date
  status: "active" | "inactive"
}

interface BoundingBox {
  id: string
  points: { x: number; y: number }[]
  label: string
  color: string
}

interface Point {
  x: number
  y: number
}

const availableCameras = [
  { id: "cam-001", name: "Front Entrance", location: "Main Building" },
  { id: "cam-002", name: "Back Window", location: "Rear Access" },
  { id: "cam-003", name: "Parking Lot", location: "West Side" },
  { id: "cam-004", name: "Storage Room", location: "Basement" },
]

const boxColors = [
  "#ef4444", // red
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // yellow
  "#8b5cf6", // purple
  "#f97316", // orange
]

export default function NaturalLanguageDetection() {
  const [query, setQuery] = useState("")
  const [selectedCameras, setSelectedCameras] = useState<string[]>(["cam-001"])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPoints, setCurrentPoints] = useState<Point[]>([])
  const [boundingBoxes, setBoundingBoxes] = useState<{ [cameraId: string]: BoundingBox[] }>({})
  const [selectedCamera, setSelectedCamera] = useState("cam-001")
  const [boxLabel, setBoxLabel] = useState("")
  const [showBoxes, setShowBoxes] = useState(true)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [results, setResults] = useState<DetectionRule[]>([
    {
      id: "rule-1",
      query: "Alert me when someone enters through a window",
      cameras: ["cam-002"],
      boundingBoxes: {
        "cam-002": [
          {
            id: "box-1",
            points: [
              { x: 30, y: 40 },
              { x: 70, y: 40 },
              { x: 70, y: 80 },
              { x: 30, y: 80 },
            ],
            label: "Window Area",
            color: "#ef4444",
          },
        ],
      },
      createdAt: new Date(Date.now() - 3600000),
      status: "active",
    },
    {
      id: "rule-2",
      query: "Detect people loitering near the entrance for more than 5 minutes",
      cameras: ["cam-001"],
      boundingBoxes: {
        "cam-001": [
          {
            id: "box-2",
            points: [
              { x: 20, y: 60 },
              { x: 80, y: 60 },
              { x: 80, y: 90 },
              { x: 20, y: 90 },
            ],
            label: "Entrance Zone",
            color: "#3b82f6",
          },
        ],
      },
      createdAt: new Date(Date.now() - 7200000),
      status: "active",
    },
  ])

  const exampleQueries = [
    "Alert me when someone enters through a window",
    "Detect people loitering near the entrance for more than 5 minutes",
    "Notify if someone is carrying a weapon",
    "Flag any vehicles in restricted parking areas",
    "Alert when packages are left unattended for over 10 minutes",
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!showBoxes) return

    // Draw existing bounding boxes for selected camera
    const boxes = boundingBoxes[selectedCamera] || []
    boxes.forEach((box) => {
      drawBoundingBox(ctx, box)
    })

    // Draw current drawing points
    if (currentPoints.length > 0) {
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])

      ctx.beginPath()
      ctx.moveTo(currentPoints[0].x, currentPoints[0].y)

      for (let i = 1; i < currentPoints.length; i++) {
        ctx.lineTo(currentPoints[i].x, currentPoints[i].y)
      }

      // Close the shape if we have more than 2 points
      if (currentPoints.length > 2) {
        ctx.lineTo(currentPoints[0].x, currentPoints[0].y)
      }

      ctx.stroke()
      ctx.setLineDash([])

      // Draw points
      currentPoints.forEach((point, index) => {
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2)
        ctx.fill()

        // Draw point number
        ctx.fillStyle = "#000000"
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.fillText((index + 1).toString(), point.x, point.y + 4)
      })
    }
  }, [boundingBoxes, selectedCamera, currentPoints, showBoxes])

  const drawBoundingBox = (ctx: CanvasRenderingContext2D, box: BoundingBox) => {
    if (box.points.length < 3) return

    ctx.strokeStyle = box.color
    ctx.fillStyle = box.color + "20" // Add transparency
    ctx.lineWidth = 2

    // Draw filled polygon
    ctx.beginPath()
    ctx.moveTo(box.points[0].x, box.points[0].y)
    for (let i = 1; i < box.points.length; i++) {
      ctx.lineTo(box.points[i].x, box.points[i].y)
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Draw label
    if (box.label) {
      const centerX = box.points.reduce((sum, p) => sum + p.x, 0) / box.points.length
      const centerY = box.points.reduce((sum, p) => sum + p.y, 0) / box.points.length

      ctx.fillStyle = box.color
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText(box.label, centerX, centerY)
    }

    // Draw corner points
    box.points.forEach((point) => {
      ctx.fillStyle = box.color
      ctx.beginPath()
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height

    setCurrentPoints([...currentPoints, { x, y }])
  }

  const handleCanvasDoubleClick = () => {
    if (!isDrawing || currentPoints.length < 3) return

    finishDrawing()
  }

  const finishDrawing = () => {
    if (currentPoints.length < 3) return

    const newBox: BoundingBox = {
      id: `box-${Date.now()}`,
      points: [...currentPoints],
      label: boxLabel || `Zone ${(boundingBoxes[selectedCamera]?.length || 0) + 1}`,
      color: boxColors[(boundingBoxes[selectedCamera]?.length || 0) % boxColors.length],
    }

    setBoundingBoxes((prev) => ({
      ...prev,
      [selectedCamera]: [...(prev[selectedCamera] || []), newBox],
    }))

    setCurrentPoints([])
    setIsDrawing(false)
    setBoxLabel("")
  }

  const cancelDrawing = () => {
    setCurrentPoints([])
    setIsDrawing(false)
    setBoxLabel("")
  }

  const deleteBoundingBox = (cameraId: string, boxId: string) => {
    setBoundingBoxes((prev) => ({
      ...prev,
      [cameraId]: (prev[cameraId] || []).filter((box) => box.id !== boxId),
    }))
  }

  const handleCameraSelection = (cameraId: string) => {
    if (selectedCameras.includes(cameraId)) {
      const newSelection = selectedCameras.filter((id) => id !== cameraId)
      setSelectedCameras(newSelection.length === 0 ? ["cam-001"] : newSelection)
    } else {
      setSelectedCameras([...selectedCameras, cameraId])
    }
  }

  const handleSubmit = async () => {
    if (!query.trim()) return

    setIsProcessing(true)

    setTimeout(() => {
      const newRule: DetectionRule = {
        id: `rule-${Date.now()}`,
        query,
        cameras: selectedCameras,
        boundingBoxes: Object.fromEntries(selectedCameras.map((cameraId) => [cameraId, boundingBoxes[cameraId] || []])),
        createdAt: new Date(),
        status: "active",
      }

      setResults((prev) => [newRule, ...prev])
      setQuery("")
      setIsProcessing(false)
    }, 2000)
  }

  const toggleRuleStatus = (ruleId: string) => {
    setResults((prev) =>
      prev.map((rule) =>
        rule.id === ruleId ? { ...rule, status: rule.status === "active" ? "inactive" : "active" } : rule,
      ),
    )
  }

  const getCameraNames = (cameraIds: string[]) => {
    return cameraIds
      .map((id) => availableCameras.find((cam) => cam.id === id)?.name)
      .filter(Boolean)
      .join(", ")
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="h-6 w-6 text-blue-400" />
        <h3 className="text-xl font-bold">Natural Language Detection with Zone Definition</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Camera Feed and Zone Drawing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">Define Detection Zones</h4>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowBoxes(!showBoxes)}
                className={showBoxes ? "text-blue-400 border-blue-400" : ""}
              >
                {showBoxes ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Camera Selection for Drawing */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Camera to Configure:</label>
            <div className="grid grid-cols-2 gap-2">
              {availableCameras.map((camera) => (
                <button
                  key={camera.id}
                  onClick={() => setSelectedCamera(camera.id)}
                  className={`flex items-center gap-2 p-2 rounded border text-sm transition-colors ${
                    selectedCamera === camera.id
                      ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                      : "bg-black/30 border-white/10 text-gray-400 hover:border-white/20"
                  }`}
                >
                  <Camera className="h-3 w-3" />
                  <div className="text-left">
                    <div className="font-medium">{camera.name}</div>
                    <div className="text-xs opacity-70">{camera.location}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Camera Feed with Drawing Canvas */}
          <div className="relative" ref={containerRef}>
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
              {/* Simulated camera feed */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📹</div>
                  <div className="text-lg font-bold">
                    {availableCameras.find((cam) => cam.id === selectedCamera)?.name}
                  </div>
                  <div className="text-sm text-gray-400">
                    {availableCameras.find((cam) => cam.id === selectedCamera)?.location}
                  </div>
                </div>
              </div>

              {/* Drawing Canvas */}
              <canvas
                ref={canvasRef}
                width={640}
                height={360}
                className="absolute inset-0 w-full h-full cursor-crosshair"
                onClick={handleCanvasClick}
                onDoubleClick={handleCanvasDoubleClick}
                style={{ cursor: isDrawing ? "crosshair" : "default" }}
              />
            </div>
          </div>

          {/* Drawing Controls */}
          <div className="space-y-3">
            {!isDrawing ? (
              <div className="flex gap-2">
                <Button onClick={() => setIsDrawing(true)} className="bg-green-600 hover:bg-green-700">
                  <Square className="h-4 w-4 mr-2" />
                  Draw Detection Zone
                </Button>
                {(boundingBoxes[selectedCamera]?.length || 0) > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setBoundingBoxes((prev) => ({ ...prev, [selectedCamera]: [] }))}
                    className="text-red-400 border-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Zones
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Zone Label (optional):</label>
                  <input
                    type="text"
                    value={boxLabel}
                    onChange={(e) => setBoxLabel(e.target.value)}
                    placeholder="e.g., Entrance Area, Window Zone"
                    className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={finishDrawing}
                    disabled={currentPoints.length < 3}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Finish Zone ({currentPoints.length} points)
                  </Button>
                  <Button variant="outline" onClick={cancelDrawing}>
                    Cancel
                  </Button>
                </div>
                <p className="text-xs text-gray-400">
                  Click to add points, double-click or use &quot;Finish Zone&quot; to complete. Minimum 3 points required.
                </p>
              </div>
            )}

            {/* Existing Zones List */}
            {(boundingBoxes[selectedCamera]?.length || 0) > 0 && (
              <div>
                <h5 className="text-sm font-medium mb-2">Detection Zones:</h5>
                <div className="space-y-1">
                  {boundingBoxes[selectedCamera]?.map((box) => (
                    <div
                      key={box.id}
                      className="flex items-center justify-between p-2 bg-black/30 rounded border border-white/10"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: box.color }} />
                        <span className="text-sm">{box.label}</span>
                        <span className="text-xs text-gray-400">({box.points.length} points)</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteBoundingBox(selectedCamera, box.id)}
                        className="text-red-400 hover:bg-red-400/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rule Creation and Management */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Apply Rule to Cameras:</label>
            <div className="grid grid-cols-1 gap-2">
              {availableCameras.map((camera) => (
                <button
                  key={camera.id}
                  onClick={() => handleCameraSelection(camera.id)}
                  className={`flex items-center gap-2 p-2 rounded border text-sm transition-colors ${
                    selectedCameras.includes(camera.id)
                      ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                      : "bg-black/30 border-white/10 text-gray-400 hover:border-white/20"
                  }`}
                >
                  <Camera className="h-3 w-3" />
                  <div className="text-left flex-1">
                    <div className="font-medium">{camera.name}</div>
                    <div className="text-xs opacity-70">
                      {camera.location} • {boundingBoxes[camera.id]?.length || 0} zones
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Describe what you want to detect:</label>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Alert me when someone climbs through a window..."
              className="bg-black/50 border-white/20 min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!query.trim() || isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Create Detection Rule
              </>
            )}
          </Button>

          <div>
            <h4 className="text-sm font-medium mb-2 text-gray-400">Example queries:</h4>
            <div className="space-y-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="block w-full text-left p-2 text-sm bg-black/30 hover:bg-black/50 rounded border border-white/10 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Active Rules */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-300">Active Detection Rules</h4>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {results.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    rule.status === "active"
                      ? "bg-green-500/10 border-green-500/20"
                      : "bg-gray-500/10 border-gray-500/20"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white mb-1">{rule.query}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <Camera className="h-3 w-3" />
                        <span>{getCameraNames(rule.cameras)}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Zones: {Object.values(rule.boundingBoxes).flat().length} defined across {rule.cameras.length}{" "}
                        camera(s)
                      </div>
                    </div>
                    <button
                      onClick={() => toggleRuleStatus(rule.id)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        rule.status === "active"
                          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
                      }`}
                    >
                      {rule.status === "active" ? "Active" : "Inactive"}
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">Created: {rule.createdAt.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
