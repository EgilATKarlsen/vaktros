"use client"

import { useState, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

const availableCameras = [
  { id: "cam-001", name: "Front Entrance", location: "Main Building", status: "online" },
  { id: "cam-002", name: "Back Window", location: "Rear Access", status: "online" },
  { id: "cam-003", name: "Parking Lot", location: "West Side", status: "online" },
  { id: "cam-004", name: "Storage Room", location: "Basement", status: "offline" },
]

export default function PlaybackControls() {
  const [selectedCamera, setSelectedCamera] = useState("cam-001")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(3600) // 1 hour in seconds
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [volume, setVolume] = useState(50)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  const currentCamera = availableCameras.find((cam) => cam.id === selectedCamera)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false)
            return duration
          }
          return prev + playbackSpeed
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed, duration])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleTimelineChange = (value: number[]) => {
    setCurrentTime(value[0])
  }

  const handleCameraChange = (cameraId: string) => {
    setSelectedCamera(cameraId)
    setCurrentTime(0) // Reset playback when switching cameras
    setIsPlaying(false)
  }

  const speedOptions = [0.25, 0.5, 1, 1.5, 2, 4, 8]

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Camera Selection Panel */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">Select Camera:</label>
            <div className="space-y-2">
              {availableCameras.map((camera) => (
                <button
                  key={camera.id}
                  onClick={() => handleCameraChange(camera.id)}
                  disabled={camera.status === "offline"}
                  className={`w-full flex items-center gap-3 p-3 rounded border text-sm transition-colors ${
                    selectedCamera === camera.id
                      ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                      : camera.status === "offline"
                        ? "bg-gray-500/10 border-gray-500/20 text-gray-500 cursor-not-allowed"
                        : "bg-black/30 border-white/10 text-gray-400 hover:border-white/20"
                  }`}
                >
                  <Camera className="h-4 w-4" />
                  <div className="text-left flex-1">
                    <div className="font-medium">{camera.name}</div>
                    <div className="text-xs opacity-70">{camera.location}</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${camera.status === "online" ? "bg-green-500" : "bg-red-500"}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Playback Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-sm"
            />
          </div>

          {/* Recording Info */}
          <div className="p-3 bg-black/30 rounded border border-white/10">
            <h4 className="text-sm font-medium mb-2">Recording Info</h4>
            <div className="space-y-1 text-xs text-gray-400">
              <div>Camera: {currentCamera?.name}</div>
              <div>Date: {selectedDate}</div>
              <div>Duration: {formatTime(duration)}</div>
              <div>Quality: 1080p</div>
              <div>Storage: Local + Cloud</div>
            </div>
          </div>
        </div>

        {/* Video Player and Controls */}
        <div className="lg:col-span-3">
          <div className="flex flex-col h-full">
            {/* Video Player with embedded Timeline */}
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
              {/* Video Content - reduced height */}
              <div className="aspect-[16/8] bg-gray-900 relative">
                {/* Camera unavailable state */}
                {currentCamera?.status === "offline" ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2 text-red-500">📹</div>
                      <div className="text-xl font-bold mb-1 text-red-400">Camera Offline</div>
                      <div className="text-gray-400">{currentCamera.name} - No Recording Available</div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Simulated video content */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-5xl mb-2">📹</div>
                        <div className="text-xl font-bold mb-1">Playback: {currentCamera?.name}</div>
                        <div className="text-sm text-gray-400">{selectedDate}</div>
                      </div>
                    </div>

                    {/* Playback overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          size="lg"
                          variant="ghost"
                          className="bg-black/50 hover:bg-black/70"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                        </Button>
                      </div>
                    </div>

                    {/* Camera info overlay */}
                    <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>{currentCamera?.name}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">{selectedDate}</span>
                      </div>
                    </div>

                    {/* Playback indicator */}
                    {isPlaying && (
                      <div className="absolute top-2 right-2 flex items-center gap-2 bg-black/70 px-2 py-1 rounded">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-xs text-blue-400">PLAYING {playbackSpeed}x</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Compact Controls */}
              <div className="py-2 px-3 bg-black/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setCurrentTime(Math.max(0, currentTime - 30))}
                      disabled={currentCamera?.status === "offline"}
                      className="bg-black/50 border-white/20 text-gray-200 hover:text-white hover:bg-black/70 h-8 w-8 p-0"
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsPlaying(!isPlaying)}
                      disabled={currentCamera?.status === "offline"}
                      className="bg-black/50 border-white/20 text-gray-200 hover:text-white hover:bg-black/70 h-8 w-8 p-0"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setCurrentTime(Math.min(duration, currentTime + 30))}
                      disabled={currentCamera?.status === "offline"}
                      className="bg-black/50 border-white/20 text-gray-200 hover:text-white hover:bg-black/70 h-8 w-8 p-0"
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    <span className="text-xs font-mono ml-2">{formatTime(currentTime)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Speed Control */}
                    <div className="flex items-center gap-1">
                      <span className="text-xs">Speed:</span>
                      <select
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                        disabled={currentCamera?.status === "offline"}
                        className="bg-black/50 border border-white/20 rounded px-1 py-0.5 text-xs disabled:opacity-50 h-6"
                      >
                        {speedOptions.map((speed) => (
                          <option key={speed} value={speed}>
                            {speed}x
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center gap-1">
                      <Volume2 className="h-3 w-3" />
                      <div className="w-16">
                        <Slider
                          value={[volume]}
                          max={100}
                          step={1}
                          onValueChange={(value) => setVolume(value[0])}
                          disabled={currentCamera?.status === "offline"}
                        />
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      variant="ghost" 
                      disabled={currentCamera?.status === "offline"}
                      className="bg-black/50 border-white/20 text-gray-200 hover:text-white hover:bg-black/70 h-8 w-8 p-0"
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Timeline slider directly under video */}
              <div className="px-3 py-2 bg-black/40">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Slider
                      value={[currentTime]}
                      max={duration}
                      step={1}
                      onValueChange={handleTimelineChange}
                      className="w-full"
                    />
                  </div>
                  <span className="text-xs font-mono text-gray-400">{formatTime(duration)}</span>
                </div>
              </div>
            </div>

            {/* Timeline with Events - Now closer to video */}
            <div className="mt-3 bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-3">
              <h3 className="text-sm font-bold mb-2">Event Timeline - {currentCamera?.name}</h3>
              <div className="relative">
                <div className="h-16 bg-black/30 rounded-lg relative overflow-hidden">
                  {/* Timeline markers */}
                  {Array.from({ length: 13 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 w-px bg-white/20"
                      style={{ left: `${(i / 12) * 100}%` }}
                    >
                      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                        {i * 5}m
                      </div>
                    </div>
                  ))}

                  {/* Event markers - different events per camera */}
                  {selectedCamera === "cam-001" && (
                    <>
                      <div className="absolute top-2 w-3 h-3 bg-yellow-500 rounded-full" style={{ left: "25%" }}>
                        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-xs text-yellow-400 whitespace-nowrap">
                          Person Entered
                        </div>
                      </div>
                      <div className="absolute top-2 w-3 h-3 bg-green-500 rounded-full" style={{ left: "60%" }}>
                        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-xs text-green-400 whitespace-nowrap">
                          Normal Activity
                        </div>
                      </div>
                    </>
                  )}

                  {selectedCamera === "cam-002" && (
                    <>
                      <div className="absolute top-2 w-3 h-3 bg-red-500 rounded-full" style={{ left: "15%" }}>
                        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-xs text-red-400 whitespace-nowrap">
                          Intrusion Alert
                        </div>
                      </div>
                      <div className="absolute top-2 w-3 h-3 bg-orange-500 rounded-full" style={{ left: "45%" }}>
                        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-xs text-orange-400 whitespace-nowrap">
                          Motion Detected
                        </div>
                      </div>
                    </>
                  )}

                  {selectedCamera === "cam-003" && (
                    <>
                      <div className="absolute top-2 w-3 h-3 bg-blue-500 rounded-full" style={{ left: "30%" }}>
                        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-xs text-blue-400 whitespace-nowrap">
                          Vehicle Parked
                        </div>
                      </div>
                      <div className="absolute top-2 w-3 h-3 bg-purple-500 rounded-full" style={{ left: "70%" }}>
                        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-xs text-purple-400 whitespace-nowrap">
                          Vehicle Left
                        </div>
                      </div>
                    </>
                  )}

                  {/* Current time indicator */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-blue-500"
                    style={{ left: `${(currentTime / duration) * 100}%` }}
                  >
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
