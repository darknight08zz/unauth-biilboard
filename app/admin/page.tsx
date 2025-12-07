"use client"
import { useState, useEffect } from "react"
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
  User,
  Trash2,
  FileDown,
  Shield,
} from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MobileNav } from "@/components/MobileNav"

interface ViolationReport {
  id: string
  status: "pending" | "investigating" | "resolved" | "dismissed"
  priority: "high" | "medium" | "low"
  violationType: string[]
  location: string
  reportedBy: string
  createdAt: string
  analysis: {
    compliant: boolean
    details: string
    width?: number
    height?: number
    aspectRatio?: number
  }
  reportedAt: string
  confidence: number
  imageUrl: string
  description?: string
  adminNotes?: string
}

function AdminDashboardContent() {
  const { logout } = useAuth()
  const router = useRouter()

  const [reports, setReports] = useState<ViolationReport[]>([])
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReport, setSelectedReport] = useState<ViolationReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  const fetchReports = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/billboards')
      const data = await res.json()

      if (data.success) {
        const mappedReports: ViolationReport[] = data.data.map((b: any) => ({
          id: b._id,
          status: b.analysis.compliant ? "resolved" : "pending",
          priority: !b.analysis.compliant ? "high" : "low",
          violationType: b.analysis.details ? [b.analysis.details.split(' ')[0]] : ["Unknown"],
          location: b.location || "Unknown Location",
          reportedBy: "System",
          reportedAt: b.createdAt,
          confidence: 95,
          imageUrl: b.imageUrl,
          description: b.analysis.details || "No description provided",
          adminNotes: ""
        }))
        setReports(mappedReports)
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const exportToPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text("Billboard Violation Report", 14, 22)

    doc.setFontSize(11)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

    const tableData = reports.map((report) => [
      new Date(report.createdAt).toLocaleDateString(),
      report.location,
      report.analysis.compliant ? "Compliant" : "Violation",
      report.status,
      report.analysis.details || "N/A",
    ])

    autoTable(doc, {
      head: [["Date", "Location", "Result", "Status", "Details"]],
      body: tableData,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 163, 74] }, // Green header
    })

    doc.save("billboard-report.pdf")
  }

  const filteredReports = reports.filter((report) => {
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    const matchesPriority = priorityFilter === "all" || report.priority === priorityFilter
    const matchesSearch =
      searchQuery === "" ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.violationType || []).some((type) => type.toLowerCase().includes(searchQuery.toLowerCase()))

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
    const updatedReports = reports.map((report) =>
      report.id === reportId ? { ...report, status: newStatus as any, adminNotes: notes || report.adminNotes } : report,
    )
    setReports(updatedReports)
  }

  const deleteReport = async (reportId: string) => {
    try {
      const res = await fetch(`/api/billboards/${reportId}`, {
        method: "DELETE",
      })
      const data = await res.json()

      if (data.success) {
        setReports(reports.filter((r) => r.id !== reportId))
      }
    } catch (error) {
      console.error("Failed to delete report:", error)
    }
  }

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    investigating: reports.filter((r) => r.status === "investigating").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
    highPriority: reports.filter((r) => r.priority === "high").length,
  }

  const exportReports = () => {
    const csvHeaders = [
      "Report ID",
      "Status",
      "Priority",
      "Violation Types",
      "Location",
      "Reported By",
      "Reported At",
      "Confidence",
      "Description",
      "Admin Notes",
    ]

    const csvData = filteredReports.map((report) => [
      report.id,
      report.status,
      report.priority,
      (report.violationType || []).join("; "),
      report.location,
      report.reportedBy,
      new Date(report.reportedAt).toLocaleDateString(),
      `${report.confidence}%`,
      report.description || "",
      report.adminNotes || "",
    ])

    const csvContent = [csvHeaders.join(","), ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(","))].join(
      "\n",
    )

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `billboard-reports-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generateSummary = () => {
    const summaryData = {
      reportDate: new Date().toLocaleDateString(),
      totalReports: stats.total,
      pendingReports: stats.pending,
      investigatingReports: stats.investigating,
      resolvedReports: stats.resolved,
      highPriorityReports: stats.highPriority,
      violationBreakdown: {
        sizeViolations: reports.filter((r) => (r.violationType || []).some((v) => v.includes("Size"))).length,
        permitIssues: reports.filter((r) => (r.violationType || []).some((v) => v.includes("Permit"))).length,
        placementViolations: reports.filter((r) => (r.violationType || []).some((v) => v.includes("Placement"))).length,
        structuralConcerns: reports.filter((r) => (r.violationType || []).some((v) => v.includes("Structural"))).length,
      },
      complianceRate: Math.round(((stats.total - stats.pending) / stats.total) * 100),
      averageConfidence: Math.round(reports.reduce((sum, r) => sum + r.confidence, 0) / reports.length),
    }

    const summaryText = `
BILLBOARD VIOLATION SUMMARY REPORT
Generated: ${summaryData.reportDate}

OVERVIEW
========
Total Reports: ${summaryData.totalReports}
Pending: ${summaryData.pendingReports}
Under Investigation: ${summaryData.investigatingReports}
Resolved: ${summaryData.resolvedReports}
High Priority: ${summaryData.highPriorityReports}

VIOLATION BREAKDOWN
==================
Size Violations: ${summaryData.violationBreakdown.sizeViolations}
Permit Issues: ${summaryData.violationBreakdown.permitIssues}
Placement Violations: ${summaryData.violationBreakdown.placementViolations}
Structural Concerns: ${summaryData.violationBreakdown.structuralConcerns}

PERFORMANCE METRICS
==================
Compliance Rate: ${summaryData.complianceRate}%
Average AI Confidence: ${summaryData.averageConfidence}%

RECOMMENDATIONS
==============
${summaryData.pendingReports > 5 ? "• High number of pending reports - consider increasing inspection resources" : "• Pending reports are within manageable range"}
${summaryData.highPriorityReports > 3 ? "• Multiple high-priority violations require immediate attention" : "• High-priority violations are under control"}
${summaryData.complianceRate < 80 ? "• Compliance rate below target - increase enforcement efforts" : "• Compliance rate meets city standards"}
    `.trim()

    const blob = new Blob([summaryText], { type: "text/plain;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `billboard-summary-${new Date().toISOString().split("T")[0]}.txt`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Admin Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analysis
                </Button>
              </Link>
              <div className="h-6 w-px bg-border mx-2 hidden md:block" />
              <Button variant="outline" size="sm" onClick={fetchReports} title="Refresh Data">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={exportReports} title="Export CSV">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={exportToPDF} title="Export PDF">
                <FileDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={generateSummary} title="Generate Summary">
                <FileText className="h-4 w-4" />
              </Button>
              <div className="h-6 w-px bg-border mx-2 hidden md:block" />
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
            <MobileNav
              items={[
                { title: "Home", href: "/" },
                { title: "Dashboard", href: "/dashboard" },
                { title: "Profile", href: "/profile" },
                { title: "Public Data", href: "/public-dashboard" },
              ]}
              isLoggedIn={true}
              onLogout={handleLogout}
            />
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
                            {(report.violationType || []).map((type, index) => (
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
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" className="ml-2">
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the violation report
                                    and remove the data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteReport(report.id)} className="bg-red-600 hover:bg-red-700">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
                                    <div>
                                      <Label className="text-sm font-medium">Location</Label>
                                      <p className="text-sm mt-1">{selectedReport.location}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Reported By</Label>
                                      <p className="text-sm mt-1">{selectedReport.reportedBy}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium">Violation Types</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {(selectedReport.violationType || []).map((type, index) => (
                                        <Badge key={index} variant="outline">
                                          {type}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium">Description</Label>
                                    <p className="text-sm mt-1 text-muted-foreground">{selectedReport.description}</p>
                                  </div>

                                  {selectedReport.imageUrl && (
                                    <div>
                                      <Label className="text-sm font-medium">Evidence</Label>
                                      <div className="mt-2 rounded-lg overflow-hidden border">
                                        <img
                                          src={selectedReport.imageUrl || "/placeholder.svg"}
                                          alt="Violation evidence"
                                          className="w-full h-48 object-cover"
                                        />
                                      </div>
                                    </div>
                                  )}

                                  <div>
                                    <Label className="text-sm font-medium">Admin Notes</Label>
                                    <Textarea
                                      className="mt-2"
                                      placeholder="Add internal notes..."
                                      defaultValue={selectedReport.adminNotes}
                                    />
                                  </div>

                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      onClick={() => updateReportStatus(selectedReport.id, "investigating")}
                                    >
                                      Mark Investigating
                                    </Button>
                                    <Button onClick={() => updateReportStatus(selectedReport.id, "resolved")}>
                                      Mark Resolved
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
