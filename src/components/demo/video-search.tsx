"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Clock, Camera, Filter } from "lucide-react"

interface SearchResult {
  id: string
  timestamp: Date
  camera: string
  description: string
  thumbnail: string
  confidence: number
}

const availableCameras = [
  { id: "cam-001", name: "Front Entrance", location: "Main Building" },
  { id: "cam-002", name: "Back Window", location: "Rear Access" },
  { id: "cam-003", name: "Parking Lot", location: "West Side" },
  { id: "cam-004", name: "Storage Room", location: "Basement" },
]

export default function VideoSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCameras, setSelectedCameras] = useState<string[]>(["all"])
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Yesterday
    end: new Date().toISOString().split("T")[0], // Today
  })
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])

  const handleCameraSelection = (cameraId: string) => {
    if (cameraId === "all") {
      setSelectedCameras(["all"])
    } else {
      setSelectedCameras((prev) => {
        const filtered = prev.filter((id) => id !== "all")
        if (filtered.includes(cameraId)) {
          const newSelection = filtered.filter((id) => id !== cameraId)
          return newSelection.length === 0 ? ["all"] : newSelection
        } else {
          return [...filtered, cameraId]
        }
      })
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Simulate search
    setTimeout(() => {
      const searchCameras = selectedCameras.includes("all")
        ? availableCameras
        : availableCameras.filter((cam) => selectedCameras.includes(cam.id))

      const mockResults: SearchResult[] = searchCameras
        .flatMap((camera, index) => [
          {
            id: `result-${camera.id}-1`,
            timestamp: new Date(Date.now() - (index + 1) * 3600000),
            camera: camera.name,
            description: `${searchQuery} detected`,
            thumbnail: "/placeholder.svg?height=80&width=120",
            confidence: 0.94 - index * 0.05,
          },
          {
            id: `result-${camera.id}-2`,
            timestamp: new Date(Date.now() - (index + 2) * 7200000),
            camera: camera.name,
            description: `Suspicious ${searchQuery} behavior`,
            thumbnail: "/placeholder.svg?height=80&width=120",
            confidence: 0.87 - index * 0.03,
          },
        ])
        .slice(0, 6) // Limit to 6 results

      setResults(mockResults)
      setIsSearching(false)
    }, 1500)
  }

  const getCameraNames = () => {
    if (selectedCameras.includes("all")) return "All Cameras"
    return selectedCameras
      .map((id) => availableCameras.find((cam) => cam.id === id)?.name)
      .filter(Boolean)
      .join(", ")
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Search className="h-6 w-6 text-green-400" />
        <h3 className="text-xl font-bold">Video Data Search</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for events, objects, or behaviors..."
              className="bg-black/50 border-white/20"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex gap-2 text-xs">
            <span className="text-gray-400">Quick searches:</span>
            {["person", "vehicle", "package", "weapon"].map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-2 py-1 bg-black/30 hover:bg-black/50 rounded border border-white/10"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Start Date</label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                className="bg-black/50 border-white/20 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">End Date</label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                className="bg-black/50 border-white/20 text-sm"
              />
            </div>
          </div>

          {/* Search Results */}
          {results.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-400">
                  Search Results ({results.length}) - {getCameraNames()}
                </h4>
                <Button variant="outline" size="sm">
                  <Filter className="h-3 w-3 mr-1" />
                  Filter
                </Button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="flex gap-3 p-3 bg-black/30 rounded-lg border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                  >
                    <div className="w-20 h-12 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={result.thumbnail || "/placeholder.svg"}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Camera className="h-3 w-3 text-gray-400" />
                        <span className="text-sm font-medium">{result.camera}</span>
                        <span className="text-xs text-green-400">{Math.round(result.confidence * 100)}% match</span>
                      </div>

                      <p className="text-sm text-gray-300 mb-1">{result.description}</p>

                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {result.timestamp.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {result.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Camera Selection Panel */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">Search Cameras:</label>
            <div className="space-y-2">
              <button
                onClick={() => handleCameraSelection("all")}
                className={`w-full flex items-center gap-2 p-3 rounded border text-sm transition-colors ${
                  selectedCameras.includes("all")
                    ? "bg-green-500/20 border-green-500/50 text-green-400"
                    : "bg-black/30 border-white/10 text-gray-400 hover:border-white/20"
                }`}
              >
                <Camera className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">All Cameras</div>
                  <div className="text-xs opacity-70">Search across all feeds</div>
                </div>
              </button>
              {availableCameras.map((camera) => (
                <button
                  key={camera.id}
                  onClick={() => handleCameraSelection(camera.id)}
                  className={`w-full flex items-center gap-2 p-3 rounded border text-sm transition-colors ${
                    selectedCameras.includes(camera.id)
                      ? "bg-green-500/20 border-green-500/50 text-green-400"
                      : "bg-black/30 border-white/10 text-gray-400 hover:border-white/20"
                  }`}
                >
                  <Camera className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">{camera.name}</div>
                    <div className="text-xs opacity-70">{camera.location}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Search Summary */}
          <div className="p-3 bg-black/30 rounded border border-white/10">
            <h4 className="text-sm font-medium mb-2">Search Parameters</h4>
            <div className="space-y-1 text-xs text-gray-400">
              <div>Cameras: {getCameraNames()}</div>
              <div>
                Date Range: {dateRange.start} to {dateRange.end}
              </div>
              {searchQuery && <div>Query: &quot;{searchQuery}&quot;</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
