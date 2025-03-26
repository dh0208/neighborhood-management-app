"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Maximize2, Layers } from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { MapLayer } from "@/lib/types"

// Sample issue data
const issueMarkers = [
  { id: 1, lat: 40.7128, lng: -74.006, type: "pothole", status: "reported" },
  { id: 2, lat: 40.7148, lng: -74.008, type: "streetlight", status: "in_progress" },
  { id: 3, lat: 40.7118, lng: -74.003, type: "graffiti", status: "completed" },
  { id: 4, lat: 40.7138, lng: -74.005, type: "trash", status: "reported" },
]

export function MapPreview() {
  const [fullscreen, setFullscreen] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  const [mapLayers, setMapLayers] = useState<MapLayer[]>([
    { id: "reported", name: "Reported Issues", enabled: true, color: "bg-red-500" },
    { id: "in_progress", name: "In Progress Issues", enabled: true, color: "bg-yellow-500" },
    { id: "completed", name: "Completed Issues", enabled: true, color: "bg-green-500" },
    { id: "municipal", name: "Municipal Buildings", enabled: false, color: "bg-blue-500" },
    { id: "parks", name: "Parks & Recreation", enabled: false, color: "bg-green-700" },
  ])

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && mapRef.current) {
      mapRef.current.requestFullscreen().catch((err) => {
        toast.error("Error attempting to enable fullscreen mode", {
          description: err.message,
        })
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const getMarkerColor = (status: string) => {
    switch (status) {
      case "reported":
        return "bg-red-500"
      case "in_progress":
        return "bg-yellow-500"
      case "completed":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "reported":
        return "Reported"
      case "in_progress":
        return "In Progress"
      case "completed":
        return "Completed"
      default:
        return "Unknown"
    }
  }

  const toggleLayer = useCallback(
    (layerId: string) => {
      setMapLayers((prevLayers) =>
        prevLayers.map((layer) => (layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer)),
      )

      // Show toast for layer toggle
      const layer = mapLayers.find((l) => l.id === layerId)
      if (layer) {
        toast(`${layer.name} ${!layer.enabled ? "Enabled" : "Disabled"}`, {
          description: `${!layer.enabled ? "Showing" : "Hiding"} ${layer.name.toLowerCase()} on the map.`,
        })
      }
    },
    [mapLayers],
  )

  const handleViewDetails = (id: number) => {
    toast("Issue Details", {
      description: "Opening issue details view.",
    })
    // In a real app, this would navigate to the issue details page
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold">Neighborhood Map</h3>
        <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={mapRef}
        className={`relative h-[300px] ${fullscreen ? "fixed inset-0 z-50 h-screen w-screen" : ""} overflow-hidden border-t`}
      >
        {/* Map simulation - in a real app, this would be an actual map */}
        <div className="absolute inset-0 bg-slate-100">
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">Interactive Map View</div>

          {/* Issue markers */}
          {issueMarkers.map((marker) => {
            const layerEnabled = mapLayers.find((l) => l.id === marker.status)?.enabled ?? true
            if (!layerEnabled) return null

            return (
              <div
                key={marker.id}
                className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                  selectedIssue === marker.id ? "z-10 scale-125" : "z-0"
                }`}
                style={{
                  left: `${50 + (marker.lng + 74.006) * 1000}%`,
                  top: `${50 + (marker.lat - 40.7128) * 1000}%`,
                }}
                onClick={() => setSelectedIssue(marker.id === selectedIssue ? null : marker.id)}
              >
                <div className={`h-4 w-4 rounded-full ${getMarkerColor(marker.status)} ring-2 ring-white`}></div>

                {selectedIssue === marker.id && (
                  <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white rounded-md shadow-lg p-2 min-w-[150px] z-20">
                    <div className="text-sm font-medium">
                      {marker.type.charAt(0).toUpperCase() + marker.type.slice(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Status: {getStatusText(marker.status)}</div>
                    <Button
                      size="sm"
                      variant="link"
                      className="text-xs p-0 h-auto mt-1"
                      onClick={() => handleViewDetails(marker.id)}
                    >
                      View Details
                    </Button>
                  </div>
                )}
              </div>
            )
          })}

          {fullscreen && (
            <Button className="absolute top-4 right-4 z-50" onClick={() => document.exitFullscreen()}>
              Exit Fullscreen
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap justify-between items-center p-3 sm:p-4 border-t">
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm mb-2 sm:mb-0">
          {mapLayers.slice(0, 3).map(
            (layer) =>
              layer.enabled && (
                <div key={layer.id} className="flex items-center gap-1.5">
                  <div className={`h-3 w-3 rounded-full ${layer.color}`}></div>
                  <span className="text-xs">{layer.name.replace(" Issues", "")}</span>
                </div>
              ),
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" className="text-xs gap-1">
              <Layers className="h-3 w-3 sm:h-4 sm:w-4" />
              Toggle Layers
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Map Layers</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mapLayers.map((layer) => (
              <DropdownMenuCheckboxItem
                key={layer.id}
                checked={layer.enabled}
                onCheckedChange={() => toggleLayer(layer.id)}
              >
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${layer.color}`}></div>
                  <span>{layer.name}</span>
                </div>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

