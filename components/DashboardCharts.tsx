"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import { BarChart3, PieChart } from "lucide-react"

const trendData = [
    { month: "Jan", compliance: 65, violations: 35 },
    { month: "Feb", compliance: 59, violations: 41 },
    { month: "Mar", compliance: 80, violations: 20 },
    { month: "Apr", compliance: 81, violations: 19 },
    { month: "May", compliance: 56, violations: 44 },
    { month: "Jun", compliance: 55, violations: 45 },
    { month: "Jul", compliance: 40, violations: 60 },
]

const violationTypeData = [
    { name: "Zoning", value: 400 },
    { name: "Content", value: 300 },
    { name: "Safety", value: 300 },
    { name: "Permit", value: 200 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function DashboardCharts() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Compliance Trend Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Compliance Trends
                    </CardTitle>
                    <CardDescription>
                        Monthly compliance vs. violation rates over the last 7 months.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={trendData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorViolations" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <Tooltip />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="compliance"
                                    stroke="#22c55e"
                                    fillOpacity={1}
                                    fill="url(#colorCompliance)"
                                    name="Compliance Score"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="violations"
                                    stroke="#ef4444"
                                    fillOpacity={1}
                                    fill="url(#colorViolations)"
                                    name="Violation Rate"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Violation Types Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Violation Types
                    </CardTitle>
                    <CardDescription>
                        Breakdown of most common violation categories.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={violationTypeData}
                                layout="vertical"
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={80} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} name="Count">
                                    {violationTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
