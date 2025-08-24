"use client"
import { useState } from "react"
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  MapPin,
  Download,
  Eye,
  BarChart3,
  Users,
  FileText,
  Search,
  LogOut,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

interface ViolationReport {
  id: string
  status: "pending" | "investigating" | "resolved" | "dismissed"
  priority: "high" | "medium" | "low"
  violationType: string[]
  location: string
  reportedBy: string
  reportedAt: string
  confidence: number
  imageUrl: string
  description?: string
  adminNotes?: string
}

const mockReports: ViolationReport[] = [
  {
    id: "RPT-001",
    status: "pending",
    priority: "high",
    violationType: ["Size Violation", "Permit Missing"],
    location: "Main St & 5th Ave, Downtown",
    reportedBy: "citizen@email.com",
    reportedAt: "2024-01-15T10:30:00Z",
    confidence: 87,
    imageUrl: "/placeholder.svg?key=91wj1",
    description: "Large billboard appears to exceed size limits and has no visible permit number",
  },
  {
    id: "RPT-002",
    status: "investigating",
    priority: "medium",
    violationType: ["Placement Violation"],
    location: "Highway 101, Mile Marker 45",
    reportedBy: "inspector@city.gov",
    reportedAt: "2024-01-14T14:20:00Z",
    confidence: 76,
    imageUrl: "/placeholder.svg?key=tpzd3",
    description: "Billboard too close to intersection",
  },
  {
    id: "RPT-003",
    status: "resolved",
    priority: "low",
    violationType: ["Structural Concern"],
    location: "Oak Street Plaza",
    reportedBy: "safety@contractor.com",
    reportedAt: "2024-01-13T09:15:00Z",
    confidence: 94,
    imageUrl: "/placeholder.svg?key=cpbbh",
    description: "Structural damage visible on support beams",
    adminNotes: "Contacted property owner. Repairs completed on 2024-01-16.",
  },
]

function AdminDashboardContent() {
  const { logout } = useAuth()
  const router = useRouter()

  const [reports, setReports] = useState<ViolationReport[]>(mockReports)
  const [selectedReport, setSelectedReport] = useState<ViolationReport | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredReports = reports.filter((report) => {
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    const matchesPriority = priorityFilter === "all" || report.priority === priorityFilter
    const matchesSearch =
      searchQuery === "" ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.violationType.some((type) => type.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesStatus && matchesPriority && matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "investigating":
        return <Eye className="h-4 w-4 text-blue-600" />
      case "dismissed":
        return <XCircle className="h-4 w-4 text-gray-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "investigating":
        return "bg-blue-100 text-blue-800"
      case "dismissed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const updateReportStatus = (reportId: string, newStatus: string, notes?: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? { ...report, status: newStatus as any, adminNotes: notes || report.adminNotes }
          : report,
      ),
    )
  }

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    investigating: reports.filter((r) => r.status === "investigating").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
    highPriority: reports.filter((r) => r.priority === "high").length,
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleGoHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-2">Billboard violation reports and compliance management</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleGoHome}>
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Reports
              </Button>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Generate Summary
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Investigating</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.investigating}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList>
            <TabsTrigger value="reports">Violation Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by location, ID, or violation type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="dismissed">Dismissed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Reports Table */}
            <Card>
              <CardHeader>
                <CardTitle>Violation Reports ({filteredReports.length})</CardTitle>
                <CardDescription>Manage and track billboard violation reports</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Violations</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Reported</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(report.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(report.status)}
                              {report.status}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(report.priority)}>{report.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {report.violationType.map((type, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {report.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{new Date(report.reportedAt).toLocaleDateString()}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{report.confidence}%</Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Report Details - {report.id}</DialogTitle>
                                <DialogDescription>Review and manage violation report</DialogDescription>
                              </DialogHeader>
                              {selectedReport && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Status</Label>
                                      <div className="mt-1">
                                        <Badge className={getStatusColor(selectedReport.status)}>
                                          {selectedReport.status}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Priority</Label>
                                      <div className="mt-1">
                                        <Badge className={getPriorityColor(selectedReport.priority)}>
                                          {selectedReport.priority}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium">Location</Label>
                                    <p className="mt-1 text-sm">{selectedReport.location}</p>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium">Violations Detected</Label>
                                    <div className="mt-1 space-y-1">
                                      {selectedReport.violationType.map((type, index) => (
                                        <Badge key={index} variant="outline">
                                          {type}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium">Description</Label>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                      {selectedReport.description || "No description provided"}
                                    </p>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium">Admin Notes</Label>
                                    <Textarea
                                      placeholder="Add investigation notes..."
                                      defaultValue={selectedReport.adminNotes}
                                      className="mt-1"
                                    />
                                  </div>

                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => updateReportStatus(selectedReport.id, "investigating")}
                                      variant="outline"
                                    >
                                      Mark as Investigating
                                    </Button>
                                    <Button
                                      onClick={() => updateReportStatus(selectedReport.id, "resolved")}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Mark as Resolved
                                    </Button>
                                    <Button
                                      onClick={() => updateReportStatus(selectedReport.id, "dismissed")}
                                      variant="destructive"
                                    >
                                      Dismiss Report
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Violation Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Size Violations</span>
                      <Badge variant="destructive">45%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Permit Issues</span>
                      <Badge variant="destructive">32%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Placement Violations</span>
                      <Badge className="bg-yellow-100 text-yellow-800">18%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Structural Concerns</span>
                      <Badge variant="secondary">5%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Reporting Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Citizens</span>
                      <Badge className="bg-blue-100 text-blue-800">67%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">City Inspectors</span>
                      <Badge className="bg-green-100 text-green-800">28%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Contractors</span>
                      <Badge variant="secondary">5%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Overview</CardTitle>
                <CardDescription>Track overall billboard compliance across the city</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">87%</div>
                    <p className="text-sm text-muted-foreground">Overall Compliance Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">156</div>
                    <p className="text-sm text-muted-foreground">Active Billboards</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">23</div>
                    <p className="text-sm text-muted-foreground">Pending Violations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}
