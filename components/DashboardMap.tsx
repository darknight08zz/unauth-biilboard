"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { MapPin } from "lucide-react"
import MarkerClusterGroup from "react-leaflet-cluster"
import "leaflet.heat"
import { Button } from "./ui/button"
import { Layers, Grid, Activity, ThumbsUp, ThumbsDown, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Fix for default marker icons in Leaflet with Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png"
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png"
const shadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png"

const customIcon = new L.Icon({
  iconUrl: iconUrl,
  iconRetinaUrl: iconRetinaUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface DashboardMapProps {
  billboards: any[]
  focusedLocation?: { lat: number; lng: number } | null
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    if (center && !isNaN(center[0]) && !isNaN(center[1])) {
      map.flyTo(center, 13, {
        duration: 1.5
      })
    }
  }, [center, map])

  return null
  return null
}

function HeatmapLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap()

  useEffect(() => {
    if (!points.length) return

    // @ts-ignore - leaflet.heat extends L but types aren't always available
    const heat = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
    }).addTo(map)

    return () => {
      map.removeLayer(heat)
    }
  }, [map, points])

  return null
}

export default function DashboardMap({ billboards, focusedLocation }: DashboardMapProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [viewMode, setViewMode] = useState<"markers" | "clusters" | "heatmap">("clusters")
  const { toast } = useToast()

  const handleFeedback = async (billboardId: string, isCorrect: boolean) => {
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billboardId, isCorrect }),
      })

      if (res.ok) {
        toast({
          title: "Feedback Received",
          description: "Thank you for helping improve our AI model!",
        })
      }
    } catch (error) {
      console.error("Feedback error:", error)
    }
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">Loading Map...</p>
      </Card>
    )
  }

  // Fallback center if no data
  const defaultCenter: [number, number] = [40.7128, -74.0060]
  const center: [number, number] = focusedLocation
    ? [focusedLocation.lat, focusedLocation.lng]
    : defaultCenter

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Geographic Insights
            </CardTitle>
            <CardDescription>
              Visualize violation hotspots and compliance status across the city.
            </CardDescription>
          </div>
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            <Button
              variant={viewMode === "markers" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("markers")}
              title="Standard Markers"
            >
              <MapPin className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "clusters" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("clusters")}
              title="Clustered View"
            >
              <Layers className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "heatmap" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("heatmap")}
              title="Heatmap Density"
            >
              <Activity className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px] w-full relative z-0">
          <MapContainer
            center={center}
            zoom={10}
            style={{ height: "100%", width: "100%", borderRadius: "0 0 0.5rem 0.5rem" }}
          >
            <MapUpdater center={center} />
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            />

            {/* Focused Location Marker */}
            {focusedLocation && (
              <Marker position={[focusedLocation.lat, focusedLocation.lng]} icon={customIcon}>
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-sm">Selected Location</h3>
                  </div>
                </Popup>
              </Marker>
            )}

            {viewMode === "heatmap" && (
              <HeatmapLayer
                points={billboards
                  .map((b) => {
                    const lat = b.coordinates?.lat || (40.7128 + (Math.random() - 0.5) * 0.1)
                    const lng = b.coordinates?.lng || (-74.0060 + (Math.random() - 0.5) * 0.1)
                    // Intensity: 1.0 for violation, 0.3 for compliant
                    const intensity = b.analysis.compliant ? 0.3 : 1.0
                    return [lat, lng, intensity] as [number, number, number]
                  })}
              />
            )}

            {viewMode !== "heatmap" && (
              viewMode === "clusters" ? (
                <MarkerClusterGroup chunkedLoading>
                  {billboards.map((billboard) => {
                    // Use real coordinates if available, otherwise fallback to random offset around NYC (or 0,0)
                    let lat = billboard.coordinates?.lat;
                    let lng = billboard.coordinates?.lng;

                    if (!lat || !lng) {
                      // Fallback for old data without coords
                      lat = 40.7128 + (Math.random() - 0.5) * 0.1;
                      lng = -74.0060 + (Math.random() - 0.5) * 0.1;
                    }

                    return (
                      <Marker key={billboard._id} position={[lat, lng]} icon={customIcon}>
                        <Popup>
                          <div className="p-2 min-w-[150px]">
                            <h3 className="font-bold text-sm mb-1">{billboard.location}</h3>
                            <div className="flex items-center justify-between mt-2">
                              <Badge
                                variant={billboard.analysis.compliant ? "default" : "destructive"}
                                className={
                                  billboard.analysis.compliant
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-red-500 hover:bg-red-600"
                                }
                              >
                                {billboard.analysis.compliant ? "COMPLIANT" : "VIOLATION"}
                              </Badge>
                            </div>
                            {!billboard.analysis.compliant && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Issue: {billboard.analysis.details || "Unknown Violation"}
                              </p>
                            )}
                            <div className="flex gap-2 mt-3 pt-2 border-t">
                              <p className="text-[10px] text-muted-foreground w-full text-center mb-1">Is this correct?</p>
                            </div>
                            <div className="flex justify-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleFeedback(billboard._id, true)}
                                title="Correct Analysis"
                              >
                                <ThumbsUp className="h-3 w-3 text-green-600" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleFeedback(billboard._id, false)}
                                title="Incorrect Analysis"
                              >
                                <ThumbsDown className="h-3 w-3 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    )
                  })}
                </MarkerClusterGroup>
              ) : (
                billboards.map((billboard) => {
                  // Use real coordinates if available, otherwise fallback to random offset around NYC (or 0,0)
                  let lat = billboard.coordinates?.lat;
                  let lng = billboard.coordinates?.lng;

                  if (!lat || !lng) {
                    // Fallback for old data without coords
                    lat = 40.7128 + (Math.random() - 0.5) * 0.1;
                    lng = -74.0060 + (Math.random() - 0.5) * 0.1;
                  }

                  return (
                    <Marker key={billboard._id} position={[lat, lng]} icon={customIcon}>
                      <Popup>
                        <div className="p-2 min-w-[150px]">
                          <h3 className="font-bold text-sm mb-1">{billboard.location}</h3>
                          <div className="flex items-center justify-between mt-2">
                            <Badge
                              variant={billboard.analysis.compliant ? "default" : "destructive"}
                              className={
                                billboard.analysis.compliant
                                  ? "bg-green-500 hover:bg-green-600"
                                  : "bg-red-500 hover:bg-red-600"
                              }
                            >
                              {billboard.analysis.compliant ? "COMPLIANT" : "VIOLATION"}
                            </Badge>
                          </div>
                          {!billboard.analysis.compliant && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Issue: {billboard.analysis.details || "Unknown Violation"}
                            </p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  )
                })
              )
            )}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}

