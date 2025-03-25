"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2 } from "lucide-react"

// Sample issue data
const issueMarkers = [
  { id: 1, lat: 40.7128, lng: -74.006, type: "pothole", status: "reported" },
  { id: 2, lat: 40.7148, lng: -74.008, type: "streetlight", status: "in_progress" },
  { id: 3, lat: 40.7118, lng: -74.003, type: "graffiti", status: "completed" },
  { id: 4, lat: 40.7138, lng: -74.005, type: "trash", status: "reported" },
]

export function MapPreview() {
  const [expanded, setExpanded] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null)

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

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold">Neighborhood Map</h3>
        <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
          {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>
      <div className={`relative ${expanded ? "h-[500px]" : "h-[300px]"} overflow-hidden border-t`}>
        {/* Map simulation - in a real app, this would be an actual map */}
        <div className="absolute inset-0 bg-slate-100">
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">Interactive Map View</div>

          {/* Issue markers */}
          {issueMarkers.map((marker) => (
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
                  <Button size="sm" variant="link" className="text-xs p-0 h-auto mt-1">
                    View Details
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap justify-between items-center p-3 sm:p-4 border-t">
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm mb-2 sm:mb-0">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span className="text-xs">Reported</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs">In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Completed</span>
          </div>
        </div>
        <Button size="sm" variant="outline" className="text-xs">
          Toggle Layers
        </Button>
      </div>
    </div>
  )
}

