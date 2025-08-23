"use client"

import { useState } from "react"
import { Shield, AlertTriangle, CheckCircle, XCircle, FileText, Scale, MapPin, Building, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { complianceRules } from "@/lib/compliance-engine"
import Link from "next/link"

export default function CompliancePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = [
    { id: "all", name: "All Rules", icon: Shield },
    { id: "size", name: "Size Limits", icon: Scale },
    { id: "placement", name: "Placement", icon: MapPin },
    { id: "permit", name: "Permits", icon: FileText },
    { id: "structural", name: "Structural", icon: Building },
    { id: "content", name: "Content", icon: Eye },
  ]

  const filteredRules =
    selectedCategory === "all" ? complianceRules : complianceRules.filter((rule) => rule.category === selectedCategory)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-4 w-4" />
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <AlertTriangle className="h-4 w-4" />
      case "low":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find((cat) => cat.id === category)
    if (categoryData) {
      const Icon = categoryData.icon
      return <Icon className="h-4 w-4" />
    }
    return <Shield className="h-4 w-4" />
  }

  const ruleStats = {
    total: complianceRules.length,
    critical: complianceRules.filter((r) => r.severity === "critical").length,
    high: complianceRules.filter((r) => r.severity === "high").length,
    medium: complianceRules.filter((r) => r.severity === "medium").length,
    low: complianceRules.filter((r) => r.severity === "low").length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Billboard Compliance Rules</h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive regulations and compliance requirements for billboard installations
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/">
                <Button variant="outline">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Test Compliance
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline">Admin Dashboard</Button>
              </Link>
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
                  <p className="text-sm font-medium text-muted-foreground">Total Rules</p>
                  <p className="text-2xl font-bold">{ruleStats.total}</p>
                </div>
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold text-red-600">{ruleStats.critical}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-bold text-orange-600">{ruleStats.high}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Medium Priority</p>
                  <p className="text-2xl font-bold text-yellow-600">{ruleStats.medium}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Priority</p>
                  <p className="text-2xl font-bold text-green-600">{ruleStats.low}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="rules" className="space-y-6">
          <TabsList>
            <TabsTrigger value="rules">Compliance Rules</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="penalties">Penalties & Fines</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-6">
            {/* Category Filter */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const Icon = category.icon
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {category.name}
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Rules Table */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Rules ({filteredRules.length})</CardTitle>
                <CardDescription>
                  {selectedCategory === "all"
                    ? "All billboard compliance regulations"
                    : `${categories.find((c) => c.id === selectedCategory)?.name} regulations`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rule ID</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Severity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-mono text-sm">{rule.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            {getCategoryIcon(rule.category)}
                            {rule.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{rule.name}</TableCell>
                        <TableCell className="max-w-md">{rule.description}</TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(rule.severity)}>
                            <div className="flex items-center gap-1">
                              {getSeverityIcon(rule.severity)}
                              {rule.severity}
                            </div>
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.slice(1).map((category) => {
                const Icon = category.icon
                const categoryRules = complianceRules.filter((rule) => rule.category === category.id)
                const criticalCount = categoryRules.filter((r) => r.severity === "critical").length
                const highCount = categoryRules.filter((r) => r.severity === "high").length

                return (
                  <Card key={category.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        {category.name}
                      </CardTitle>
                      <CardDescription>{categoryRules.length} rules in this category</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Critical Rules</span>
                          <span className="font-medium text-red-600">{criticalCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>High Priority Rules</span>
                          <span className="font-medium text-orange-600">{highCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total Rules</span>
                          <span className="font-medium">{categoryRules.length}</span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        View Rules
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="penalties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Penalty Structure</CardTitle>
                <CardDescription>Fine amounts and enforcement actions for compliance violations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Severity Levels</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="font-medium">Critical</span>
                          </div>
                          <Badge className="bg-red-100 text-red-800">$1,500 - $2,000</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <span className="font-medium">High</span>
                          </div>
                          <Badge className="bg-orange-100 text-orange-800">$500 - $1,000</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium">Medium</span>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">$250 - $400</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-medium">Low</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">$100 - $250</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Enforcement Actions</h3>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                          <div className="font-medium text-red-600 mb-1">Critical Violations</div>
                          <p className="text-sm text-muted-foreground">
                            Immediate removal order, maximum fines, potential legal action
                          </p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="font-medium text-orange-600 mb-1">High Priority</div>
                          <p className="text-sm text-muted-foreground">
                            30-day compliance notice, escalating fines, permit suspension
                          </p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="font-medium text-yellow-600 mb-1">Medium Priority</div>
                          <p className="text-sm text-muted-foreground">
                            60-day compliance notice, standard fines, warning letters
                          </p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="font-medium text-green-600 mb-1">Low Priority</div>
                          <p className="text-sm text-muted-foreground">
                            90-day compliance notice, minimal fines, educational resources
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-3">Appeal Process</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-primary font-bold text-sm">1</span>
                        </div>
                        <h4 className="font-medium mb-1">File Appeal</h4>
                        <p className="text-xs text-muted-foreground">Submit appeal within 30 days</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-primary font-bold text-sm">2</span>
                        </div>
                        <h4 className="font-medium mb-1">Review Process</h4>
                        <p className="text-xs text-muted-foreground">Administrative review within 14 days</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-primary font-bold text-sm">3</span>
                        </div>
                        <h4 className="font-medium mb-1">Final Decision</h4>
                        <p className="text-xs text-muted-foreground">Written decision with reasoning</p>
                      </div>
                    </div>
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
