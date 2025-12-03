"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { MapPin } from "lucide-react"

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
}

export default function DashboardMap({ billboards, focusedLocation }: DashboardMapProps) {
  const [isMounted, setIsMounted] = useState(false)

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
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Geographic Insights
        </CardTitle>
        <CardDescription>
          Visualize violation hotspots and compliance status across the city.
        </CardDescription>
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

            {billboards.map((billboard) => {
              // Simple random offset for demo purposes if we don't have real coords yet
              // In a real app, we'd geocode the address string to lat/lng
              // For now, let's just show them if we can (or skip if no lat/lng)
              // Since we only have 'location' string, we can't plot them accurately without geocoding.
              // For this MVP, we will simulate positions around NYC for demo if string is present.
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
            })}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}

