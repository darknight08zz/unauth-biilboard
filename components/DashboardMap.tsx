"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
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

// Mock data for the map
const locations = [
  { id: 1, lat: 40.7128, lng: -74.006, status: "violation", address: "123 Broadway, NY", type: "Zoning" },
  { id: 2, lat: 40.7282, lng: -73.9942, status: "compliant", address: "456 Lafayette St, NY", type: "N/A" },
  { id: 3, lat: 40.7589, lng: -73.9851, status: "violation", address: "789 7th Ave, NY", type: "Content" },
  { id: 4, lat: 40.7484, lng: -73.9857, status: "compliant", address: "350 5th Ave, NY", type: "N/A" },
  { id: 5, lat: 40.7829, lng: -73.9654, status: "warning", address: "Central Park West, NY", type: "Maintenance" },
]

export default function DashboardMap() {
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
            center={[40.75, -73.98]}
            zoom={13}
            style={{ height: "100%", width: "100%", borderRadius: "0 0 0.5rem 0.5rem" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((loc) => (
              <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={customIcon}>
                <Popup>
                  <div className="p-2 min-w-[150px]">
                    <h3 className="font-bold text-sm mb-1">{loc.address}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <Badge
                        variant={loc.status === "compliant" ? "default" : "destructive"}
                        className={
                          loc.status === "compliant"
                            ? "bg-green-500 hover:bg-green-600"
                            : loc.status === "warning"
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-red-500 hover:bg-red-600"
                        }
                      >
                        {loc.status.toUpperCase()}
                      </Badge>
                    </div>
                    {loc.status !== "compliant" && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Issue: {loc.type}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}
