"use client"
import { useState, useEffect, useMemo } from "react"
import {
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Users,
  Calendar,
  Info,
  Phone,
  Mail,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface ComplianceData {
  district: string
  totalBillboards: number
  compliantBillboards: number
  violationReports: number
  complianceRate: number
}

interface ViolationTrend {
  month: string
  violations: number
  resolved: number
}

export default function PublicDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all")
  const [billboards, setBillboards] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
      } finally {
        setIsLoading(false)
      }
    }
    fetchBillboards()
  }, [])

  // Calculate stats from real data
  const totalStats = {
    totalBillboards: billboards.length,
    compliantBillboards: billboards.filter(b => b.analysis.compliant).length,
    violationReports: billboards.filter(b => !b.analysis.compliant).length,
  }

  const overallComplianceRate = totalStats.totalBillboards > 0
    ? Math.round((totalStats.compliantBillboards / totalStats.totalBillboards) * 100)
    : 100

  // Aggregate data by district (simulated from location string for now)
  const districtData = useMemo(() => {
    const districts: Record<string, any> = {}

    billboards.forEach(b => {
      // Simple heuristic: extract city or area from location string
      // e.g. "Main St, Downtown" -> "Downtown"
      // If no comma, use "General"
      const location = b.location || "Unknown Location"
      const parts = location.split(',')
      const districtName = parts.length > 1 ? parts[parts.length - 2].trim() : "General Area"

      if (!districts[districtName]) {
        districts[districtName] = {
          district: districtName,
          totalBillboards: 0,
          compliantBillboards: 0,
          violationReports: 0
        }
      }

      districts[districtName].totalBillboards++
      if (b.analysis.compliant) {
        districts[districtName].compliantBillboards++
      } else {
        districts[districtName].violationReports++
      }
    })

    return Object.values(districts).map((d: any) => ({
      ...d,
      complianceRate: Math.round((d.compliantBillboards / d.totalBillboards) * 100)
    }))
  }, [billboards])

  // Aggregate trends by month
  const trendData = useMemo(() => {
    const months: Record<string, { violations: number, resolved: number }> = {}

    billboards.forEach(b => {
      const date = new Date(b.createdAt)
      const month = date.toLocaleString('default', { month: 'short' })

      if (!months[month]) {
        months[month] = { violations: 0, resolved: 0 }
      }

      if (!b.analysis.compliant) {
        months[month].violations++
        // Simulate resolution for demo (randomly resolved)
        if (Math.random() > 0.5) months[month].resolved++
      }
    })

    return Object.entries(months).map(([month, data]) => ({
      month,
      violations: data.violations,
      resolved: data.resolved
    })).reverse()
  }, [billboards])

  // Get recent activity (last 5 items)
  const recentActivity = useMemo(() => {
    return [...billboards]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(b => ({
        id: b._id,
        type: b.analysis.compliant ? 'compliant' : 'violation',
        location: b.location || "Unknown Location",
        timestamp: b.createdAt,
        message: b.analysis.compliant
          ? `Compliance verified at ${b.location || "Unknown Location"}`
          : `Violation detected at ${b.location || "Unknown Location"}`
      }))
  }, [billboards])

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + " years ago"
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + " months ago"
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + " days ago"
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + " hours ago"
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + " minutes ago"
    return Math.floor(seconds) + " seconds ago"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">City Billboard Compliance Dashboard</h1>
              <p className="text-muted-foreground mt-2">Public transparency portal for billboard regulations and compliance</p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard">
                <Button variant="outline">Back to Analysis Dashboard</Button>
              </Link>
              {user ? (
                <Button variant="outline" onClick={() => {
                  logout()
                  router.push("/login")
                }}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="districts">By District</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="regulations">Regulations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compliance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Compliance Overview
                  </CardTitle>
                  <CardDescription>Current billboard compliance status across the city</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Compliant Billboards</span>
                      <span>
                        {totalStats.compliantBillboards} of {totalStats.totalBillboards}
                      </span>
                    </div>
                    <Progress value={overallComplianceRate} className="h-3" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{totalStats.compliantBillboards}</div>
                      <p className="text-sm text-muted-foreground">Compliant</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {totalStats.totalBillboards - totalStats.compliantBillboards}
                      </div>
                      <p className="text-sm text-muted-foreground">Non-Compliant</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest compliance updates and resolved violations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-4">
                      {recentActivity.length > 0 ? (
                        recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3">
                            {activity.type === 'compliant' ? (
                              <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-600 mt-1" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.message}</p>
                              <p className="text-xs text-muted-foreground">{getTimeAgo(activity.timestamp)}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No recent activity found.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* How to Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  How to Report Billboard Violations
                </CardTitle>
                <CardDescription>Help us maintain billboard compliance in your community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <h3 className="font-medium">Take a Photo</h3>
                    <p className="text-sm text-muted-foreground">
                      Capture a clear image of the billboard showing the violation
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <h3 className="font-medium">Upload & Describe</h3>
                    <p className="text-sm text-muted-foreground">Upload the image and provide location details</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <h3 className="font-medium">AI Analysis</h3>
                    <p className="text-sm text-muted-foreground">Our system analyzes the image and flags violations</p>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <Link href="/">
                    <Button size="lg">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Report a Violation Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="districts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance by District</CardTitle>
                <CardDescription>Billboard compliance rates across different city districts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {districtData.map((district: any) => (
                    <div key={district.district} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{district.district}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{district.totalBillboards} total</Badge>
                          <Badge
                            className={
                              district.complianceRate >= 90
                                ? "bg-green-100 text-green-800"
                                : district.complianceRate >= 80
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {district.complianceRate}% compliant
                          </Badge>
                        </div>
                      </div>
                      <Progress value={district.complianceRate} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{district.compliantBillboards} compliant</span>
                        <span>{district.violationReports} active reports</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Violation Trends
                  </CardTitle>
                  <CardDescription>Monthly violation reports and resolution rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trendData.map((trend) => (
                      <div key={trend.month} className="flex items-center justify-between">
                        <span className="font-medium">{trend.month}</span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm">{trend.violations} reported</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm">{trend.resolved} resolved</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Common Violations</CardTitle>
                  <CardDescription>Most frequently reported violation types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Size violations</span>
                      <div className="flex items-center gap-2">
                        <Progress value={45} className="w-20 h-2" />
                        <span className="text-sm font-medium">45%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Missing permits</span>
                      <div className="flex items-center gap-2">
                        <Progress value={32} className="w-20 h-2" />
                        <span className="text-sm font-medium">32%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Placement issues</span>
                      <div className="flex items-center gap-2">
                        <Progress value={18} className="w-20 h-2" />
                        <span className="text-sm font-medium">18%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Structural concerns</span>
                      <div className="flex items-center gap-2">
                        <Progress value={5} className="w-20 h-2" />
                        <span className="text-sm font-medium">5%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="regulations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billboard Regulations</CardTitle>
                  <CardDescription>Key regulations that billboards must comply with</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                      <div>
                        <p className="font-medium text-sm">Size Limits</p>
                        <p className="text-xs text-muted-foreground">Maximum 120 square feet for standard billboards</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                      <div>
                        <p className="font-medium text-sm">Placement Requirements</p>
                        <p className="text-xs text-muted-foreground">Minimum 300 feet from intersections and schools</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                      <div>
                        <p className="font-medium text-sm">Permit Display</p>
                        <p className="text-xs text-muted-foreground">Valid permit number must be clearly visible</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                      <div>
                        <p className="font-medium text-sm">Structural Safety</p>
                        <p className="text-xs text-muted-foreground">Annual safety inspections required</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Get in touch with the billboard compliance office</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium text-sm">Phone</p>
                        <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium text-sm">Email</p>
                        <p className="text-sm text-muted-foreground">billboard.compliance@city.gov</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-primary mt-1" />
                      <div>
                        <p className="font-medium text-sm">Office</p>
                        <p className="text-sm text-muted-foreground">
                          City Hall, Room 205
                          <br />
                          123 Main Street
                          <br />
                          Anytown, ST 12345
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground">Office Hours: Monday - Friday, 8:00 AM - 5:00 PM</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs >
      </main >
    </div >
  )
}
