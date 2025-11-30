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
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { Textarea } from "../../components/ui/textarea"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { useAuth } from "../../components/auth-provider"
import Link from "next/link"
import { useRouter } from "next/navigation"
import MLAnalyzer from "../../components/MLAnalyzer"
import dynamic from "next/dynamic"
import DashboardCharts from "../../components/DashboardCharts"

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
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    // Auto-start analysis via MLAnalyzer component
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

    // Optional: Save to backend immediately or wait for user to "Submit"
    // For now, we just show the result.
  }

  const submitViolationReport = async () => {
    if (!analysisResult || !user || !selectedFile) return

    try {
      // We can now send the data to the backend to save it
      const formData = new FormData()
      formData.append("image", selectedFile)
      formData.append("name", selectedFile.name)
      if (location) formData.append("location", location)
      if (description) formData.append("description", description)

      // Pass the analysis data as JSON string
      formData.append("analysisData", JSON.stringify({
        width: analysisResult.width,
        height: analysisResult.height,
        aspectRatio: analysisResult.aspectRatio,
        compliant: analysisResult.status === 'compliant',
        details: analysisResult.violations.join(', ')
      }));

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to save report")

      const data = await response.json()

      // Local storage fallback for demo
      const report = {
        ...analysisResult,
        id: data.data?._id || analysisResult.id,
        reportedBy: user.email,
      }

      const existingReports = JSON.parse(localStorage.getItem("violationReports") || "[]")
      const updatedReports = [report, ...existingReports]
      localStorage.setItem("violationReports", JSON.stringify(updatedReports))

      alert("Violation report submitted successfully! Authorities will review your report.")

      // Reset
      setSelectedFile(null)
      setPreviewUrl(null)
      setAnalysisResult(null)
      setLocation("")
      setDescription("")
      if (fileInputRef.current) fileInputRef.current.value = ""

    } catch (error) {
      console.error("Error submitting report:", error)
      alert("Failed to submit report. Please try again.")
    }
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Billboard Detection & Reporting System</h1>
              <p className="text-muted-foreground mt-2">AI-powered compliance monitoring and violation detection</p>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm">
                      {user.name || user.email}
                    </span>
                    <Badge variant="outline">{user.role}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/compliance">
                      <Button variant="outline" size="sm">
                        <Shield className="h-4 w-4 mr-2" />
                        Compliance Rules
                      </Button>
                    </Link>
                    <Link href="/public-dashboard">
                      <Button variant="outline" size="sm">
                        Public Dashboard
                      </Button>
                    </Link>
                    {(user.role === "admin" || user.role === "inspector") && (
                      <Link href="/admin">
                        <Button variant="outline" size="sm">
                          Admin Portal
                        </Button>
                      </Link>
                    )}
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/compliance">
                    <Button variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      Compliance Rules
                    </Button>
                  </Link>
                  <Link href="/public-dashboard">
                    <Button variant="outline">Public Dashboard</Button>
                  </Link>
                  <Link href="/login">
                    <Button>Sign In</Button>
                  </Link>
                </div>
              )}
            </div>
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
          <DashboardCharts />
        </section>

        {/* Map Section */}
        <section>
          <DashboardMap />
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
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">Drop your image here or click to browse</p>
                    <p className="text-sm text-muted-foreground">Supports JPG, PNG, WebP up to 10MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
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
                      }}>
                        Change Image
                      </Button>
                    </div>
                    {/* ML Analyzer Component */}
                    <MLAnalyzer imageUrl={previewUrl} onAnalysisComplete={handleMLComplete} />
                  </div>
                )}

                {selectedFile && !previewUrl && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">{selectedFile.name}</span>
                    <Badge variant="secondary">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</Badge>
                  </div>
                )}

                {/* Location Input */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location (Optional)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="Enter billboard location or address"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
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
                    {user && (
                      <Button
                        size="sm"
                        className={analysisResult.status === 'compliant' ? "bg-primary" : "bg-destructive hover:bg-destructive/90"}
                        onClick={submitViolationReport}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        {analysisResult.status === 'compliant' ? "Save Report" : "Submit Violation Report"}
                      </Button>
                    )}
                    {!user && (
                      <Link href="/login">
                        <Button size="sm" className="bg-destructive hover:bg-destructive/90">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Sign In to Report
                        </Button>
                      </Link>
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
                    Upload a billboard image to start the AI-powered compliance analysis
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
