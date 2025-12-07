"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Upload,
  Camera,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MapPin,
  FileText,
  LogOut,
  User,
  Shield,
  Home,
  Send,
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { Textarea } from "../../components/ui/textarea"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { useAuth } from "../../components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"
import MLAnalyzer from "../../components/MLAnalyzer"
import dynamic from "next/dynamic"
import DashboardCharts from "../../components/DashboardCharts"
import { LocationAutocomplete } from "../../components/LocationAutocomplete"
import { MobileNav } from "@/components/MobileNav"

// Dynamically import the map component to avoid SSR issues with Leaflet
const DashboardMap = dynamic(() => import("../../components/DashboardMap"), {
  ssr: false,
  loading: () => (
    <Card className="h-[400px] flex items-center justify-center col-span-1 lg:col-span-2">
      <p className="text-muted-foreground">Loading Map...</p>
    </Card>
  ),
})

interface AnalysisResult {
  id: string
  status: "compliant" | "violation" | "warning"
  confidence: number
  violations: string[]
  location?: string
  timestamp: string
  imageUrl: string
  description?: string
  complianceScore?: number
  totalFines?: number
  riskLevel?: "low" | "medium" | "high" | "critical"
  // ML Specifics
  width?: number
  height?: number
  aspectRatio?: number
}

export default function BillboardDetectionApp() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [location, setLocation] = useState("")
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [description, setDescription] = useState("")
  const [billboards, setBillboards] = useState<any[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Fetch billboards on mount
  useEffect(() => {
    const fetchBillboards = async () => {
      try {
        const res = await fetch('/api/billboards')
        const data = await res.json()
        if (data.success) {
          setBillboards(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch billboards:", error)
      }
    }
    fetchBillboards()
  }, [])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    setSelectedFile(file)
    setAnalysisResult(null)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    // Do NOT auto-start analysis. Wait for location.
    setIsAnalyzing(false)
  }

  const startAnalysis = () => {
    if (!location.trim()) {
      alert("Please enter a location before starting analysis.")
      return
    }
    setIsAnalyzing(true)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleMLComplete = async (mlData: any) => {
    setIsAnalyzing(false)

    // Map ML result to App AnalysisResult
    const result: AnalysisResult = {
      id: `ML-${Date.now()}`,
      status: mlData.compliant ? "compliant" : "violation",
      confidence: 90, // We can calculate this from detection scores if we want
      violations: mlData.compliant ? [] : [mlData.details],
      location: location || "Unknown Location",
      timestamp: new Date().toISOString(),
      imageUrl: previewUrl!,
      description: description,
      complianceScore: mlData.compliant ? 100 : 40,
      totalFines: mlData.compliant ? 0 : 500,
      riskLevel: mlData.compliant ? "low" : "medium",
      width: mlData.width,
      height: mlData.height,
      aspectRatio: mlData.aspectRatio
    }

    setAnalysisResult(result)

    // Auto-save removed as per user request
    // await saveToBackend(result)
  }

  const saveToBackend = async (result: AnalysisResult) => {
    if (!user || !selectedFile) return

    try {
      const formData = new FormData()
      formData.append("image", selectedFile)
      formData.append("name", selectedFile.name)
      formData.append("location", location) // Ensure location is sent
      if (locationCoords) {
        formData.append("lat", locationCoords.lat.toString())
        formData.append("lng", locationCoords.lng.toString())
      }
      if (description) formData.append("description", description)

      // Pass the analysis data as JSON string
      formData.append("analysisData", JSON.stringify({
        width: result.width,
        height: result.height,
        aspectRatio: result.aspectRatio,
        compliant: result.status === 'compliant',
        details: result.violations.join(', ')
      }));

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to save report")

      const data = await response.json()

      // Refresh billboards list
      const res = await fetch('/api/billboards')
      const newData = await res.json()
      if (newData.success) {
        setBillboards(newData.data)
      }

      toast({
        title: "Report Saved",
        description: "Analysis result saved. You earned 10 points!",
        variant: "default",
      })

    } catch (error) {
      console.error("Error saving report:", error)
      toast({
        title: "Save Failed",
        description: "Failed to save report to database.",
        variant: "destructive",
      })
    }
  }

  // Manual submit handler
  const submitViolationReport = async () => {
    if (!analysisResult) return
    await saveToBackend(analysisResult)
  }

  const generateReport = () => {
    if (!analysisResult) return

    const reportData = {
      id: analysisResult.id,
      title: "Billboard Compliance Analysis Report",
      timestamp: new Date(analysisResult.timestamp).toLocaleString(),
      location: analysisResult.location || "Unknown Location",
      status: analysisResult.status,
      complianceScore: analysisResult.complianceScore,
      confidence: analysisResult.confidence,
      violations: analysisResult.violations,
      riskLevel: analysisResult.riskLevel,
      totalFines: analysisResult.totalFines,
      description: analysisResult.description,
      reportedBy: user?.email || "Anonymous",
      dimensions: `${analysisResult.width?.toFixed(0)}x${analysisResult.height?.toFixed(0)} px (Approx Ratio: ${analysisResult.aspectRatio?.toFixed(2)})`
    }

    const reportText = `
BILLBOARD COMPLIANCE ANALYSIS REPORT
=====================================

Report ID: ${reportData.id}
Generated: ${reportData.timestamp}
Location: ${reportData.location}
Reported By: ${reportData.reportedBy}

ANALYSIS SUMMARY
================
Status: ${reportData.status.toUpperCase()}
Compliance Score: ${reportData.complianceScore}%
Confidence Level: ${reportData.confidence}%
Risk Level: ${reportData.riskLevel?.toUpperCase() || "N/A"}
Dimensions: ${reportData.dimensions}

${reportData.violations.length > 0
        ? `
VIOLATIONS DETECTED
==================
${reportData.violations.map((violation, index) => `${index + 1}. ${violation}`).join("\n")}

${reportData.totalFines ? `Total Potential Fines: $${reportData.totalFines.toLocaleString()}` : ""}
`
        : "No violations detected. Billboard appears to be compliant."
      }

${reportData.description
        ? `
ADDITIONAL NOTES
===============
${reportData.description}
`
        : ""
      }

DISCLAIMER
==========
This report is generated by an AI-powered analysis system (YOLO + Depth Estimation) and should be reviewed by qualified personnel.
    `.trim()

    const blob = new Blob([reportText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `billboard-report-${reportData.id}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    alert("Report generated and downloaded successfully!")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "violation":
        return <XCircle className="h-5 w-5 text-destructive" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800"
      case "violation":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskLevelColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const [isLocating, setIsLocating] = useState(false)

  const handleCameraCapture = async () => {
    // Helper to open camera (using the dedicated camera input)
    const openCamera = () => {
      if (cameraInputRef.current) {
        cameraInputRef.current.click()
      }
    }

    // Check for Secure Context (HTTPS)
    if (typeof window !== 'undefined' && window.isSecureContext === false) {
      console.warn("Location access requires a secure connection (HTTPS). Skipping location request.")
      openCamera()
      return
    }

    // 1. Trigger Location Request
    setIsLocating(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Success: Open camera immediately to minimize delay (avoid popup blockers)
          openCamera()

          const { latitude, longitude } = position.coords
          setLocationCoords({ lat: latitude, lng: longitude })

          // Reverse Geocode
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            )
            const data = await response.json()
            if (data.display_name) {
              setLocation(data.display_name)
            }
          } catch (error) {
            console.error("Reverse geocoding failed:", error)
            // Fallback: use coordinates as string if address fails
            setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
          } finally {
            setIsLocating(false)
          }
        },
        (error) => {
          console.error("Geolocation error:", error.message, error.code)
          let errorMessage = "Could not get location."
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access was denied. Please enable location permissions in your browser settings to use this feature."
              break
            case error.TIMEOUT:
              errorMessage = "Location request timed out. Please try again."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable."
              break
            default:
              errorMessage = `Location error: ${error.message}`
          }
          // Only alert if it's NOT a secure context issue (which we already handled)
          // or if we want to be explicit.
          alert(errorMessage)
          setIsLocating(false)

          // Still allow taking photo even if location fails
          openCamera()
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    } else {
      alert("Geolocation is not supported by this browser.")
      setIsLocating(false)
      openCamera()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {/* Minimalist Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">BillboardGuard</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                  <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                  <Link href="/compliance" className="hover:text-primary transition-colors">Rules</Link>
                  <Link href="/public-dashboard" className="hover:text-primary transition-colors">Public Data</Link>
                  <Link href="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link>
                  <Link href="/profile" className="hover:text-primary transition-colors">Profile</Link>
                  {(user.role === "admin" || user.role === "inspector") && (
                    <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
                  )}
                </nav>
                <div className="h-6 w-px bg-border hidden md:block" />
                <div className="flex items-center gap-3">
                  <Link href="/profile" className="flex flex-col items-end hidden sm:flex hover:opacity-80 transition-opacity">
                    <span className="text-sm font-medium leading-none">{user.name || user.email}</span>
                    <span className="text-xs text-muted-foreground">{user.role}</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive hidden md:flex">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
                <MobileNav
                  items={[
                    { title: "Home", href: "/" },
                    { title: "Rules", href: "/compliance" },
                    { title: "Public Data", href: "/public-dashboard" },
                    { title: "Leaderboard", href: "/leaderboard" },
                    { title: "Profile", href: "/profile" },
                    ...((user.role === "admin" || user.role === "inspector") ? [{ title: "Admin", href: "/admin" }] : [])
                  ]}
                  isLoggedIn={true}
                  onLogout={handleLogout}
                />
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>


      <main className="container mx-auto px-4 py-8 space-y-8">
        {!user && (
          <Card className="mb-8 border-primary/20 bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <AlertTriangle className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold text-card-foreground">Sign in to submit reports</h3>
                  <p className="text-sm text-muted-foreground">
                    You can analyze images without an account, but you'll need to sign in to submit violation reports to
                    authorities.
                  </p>
                </div>
                <Link href="/login">
                  <Button>Sign In</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analytics Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Analytics Overview</h2>
          <DashboardCharts billboards={billboards} />
        </section>

        {/* Map Section */}
        <section>
          <DashboardMap billboards={billboards} focusedLocation={locationCoords} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Upload Billboard Image
                </CardTitle>
                <CardDescription>Upload an image of a billboard for AI-powered compliance analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload Area */}
                {!previewUrl ? (
                  <div className="space-y-4">
                    <div
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-medium mb-2">Drop your image here or click to browse</p>
                      <p className="text-sm text-muted-foreground">Supports JPG, PNG, WebP up to 10MB</p>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or on Mobile</span>
                      </div>
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCameraCapture();
                      }}
                      className="w-full py-6 text-lg"
                      variant="outline"
                    >
                      <Camera className="mr-2 h-6 w-6" />
                      {isLocating ? "Getting Location..." : "Take Photo & Get Location"}
                    </Button>

                    {/* Standard File Input (Gallery/File Picker) */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {/* Camera-Specific Input (Forces Camera on Mobile) */}
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Analysis Preview</h4>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setPreviewUrl(null);
                        setSelectedFile(null);
                        setAnalysisResult(null);
                        setIsAnalyzing(false);
                      }}>
                        Change Image
                      </Button>
                    </div>

                    {/* Location Input - Required BEFORE Analysis */}
                    <div className="space-y-2 p-4 bg-muted/50 rounded-lg border border-primary/20">
                      <Label htmlFor="location" className="flex items-center gap-2 font-semibold text-primary">
                        <MapPin className="h-4 w-4" />
                        Location (Required for Analysis)
                      </Label>
                      <div className="relative">
                        <LocationAutocomplete
                          value={location}
                          onChange={(val, coords) => {
                            setLocation(val)
                            if (coords) setLocationCoords(coords)
                          }}
                          onSelect={(coords) => setLocationCoords(coords)}
                          className={!location ? "border-red-300 focus-visible:ring-red-300" : ""}
                        />
                      </div>
                      {!location && (
                        <p className="text-xs text-red-500">
                          * Please provide the location to start the analysis.
                        </p>
                      )}
                    </div>

                    {/* Description Input */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Additional Notes (Optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe any specific concerns or observations..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                      />
                    </div>

                    {/* Start Analysis Button */}
                    {!isAnalyzing && !analysisResult && (
                      <Button
                        onClick={startAnalysis}
                        className="w-full"
                        disabled={!location.trim()}
                        variant={!location.trim() ? "secondary" : "default"}
                      >
                        {location.trim() ? "Start AI Analysis" : "Enter Location to Start"}
                      </Button>
                    )}

                    {/* ML Analyzer Component - Only shown when analyzing */}
                    {isAnalyzing && (
                      <MLAnalyzer imageUrl={previewUrl} onAnalysisComplete={handleMLComplete} />
                    )}
                  </div>
                )}

                {selectedFile && !previewUrl && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">{selectedFile.name}</span>
                    <Badge variant="secondary">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {isAnalyzing && !analysisResult && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Compliance Analysis in Progress</CardTitle>
                  <CardDescription>Checking against all compliance regulations...</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Initializing Neural Networks...</span>
                      <span>Loading...</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    • Loading YOLOv8 Object Detection Model...
                    <br />• Loading Depth Anything Model...
                    <br />• This runs entirely in your browser!
                  </div>
                </CardContent>
              </Card>
            )}

            {analysisResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(analysisResult.status)}
                    Compliance Analysis Results
                  </CardTitle>
                  <CardDescription>
                    Compliance Score: {analysisResult.complianceScore}% •{" "}
                    {new Date(analysisResult.timestamp).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getStatusColor(analysisResult.status)}>
                      {analysisResult.status.toUpperCase()}
                    </Badge>
                    {analysisResult.riskLevel && (
                      <Badge className={getRiskLevelColor(analysisResult.riskLevel)}>
                        {analysisResult.riskLevel.toUpperCase()} RISK
                      </Badge>
                    )}
                    {analysisResult.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {analysisResult.location}
                      </div>
                    )}
                  </div>

                  {/* Compliance Score */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Compliance Score</span>
                      <span className="font-medium">{analysisResult.complianceScore}%</span>
                    </div>
                    <Progress value={analysisResult.complianceScore} className="h-3" />
                  </div>

                  {/* Dimensions */}
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <span className="font-semibold">Detected Dimensions:</span> {analysisResult.width?.toFixed(0)} x {analysisResult.height?.toFixed(0)} px
                    <br />
                    <span className="font-semibold">Aspect Ratio:</span> {analysisResult.aspectRatio?.toFixed(2)}
                  </div>

                  {analysisResult.violations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-destructive">Detected Violations:</h4>
                      <ul className="space-y-1">
                        {analysisResult.violations.map((violation, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                            {violation}
                          </li>
                        ))}
                      </ul>
                      {analysisResult.totalFines && analysisResult.totalFines > 0 && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="font-medium text-red-800">
                              Potential Fines: ${analysisResult.totalFines.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {analysisResult.status === "compliant" && (
                    <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Billboard appears to be fully compliant with all regulations</span>
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={generateReport}>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                    <Link href="/compliance">
                      <Button variant="outline" size="sm">
                        <Shield className="h-4 w-4 mr-2" />
                        View Rules
                      </Button>
                    </Link>

                    {/* Manual Save Button for all results */}
                    <Button variant="default" size="sm" onClick={() => saveToBackend(analysisResult)}>
                      <Send className="h-4 w-4 mr-2" />
                      Save Result
                    </Button>

                    {/* Submit Complaint Button (also saves) */}
                    {analysisResult.status === "violation" && (
                      <Button variant="destructive" size="sm" onClick={submitViolationReport}>
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Submit Official Complaint
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {!isAnalyzing && !analysisResult && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No Analysis Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a billboard image and enter location to start the AI-powered compliance analysis
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div >
  )
}
