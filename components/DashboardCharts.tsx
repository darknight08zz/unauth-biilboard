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
import { useMemo } from "react"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

interface DashboardChartsProps {
    billboards: any[]
}

export default function DashboardCharts({ billboards }: DashboardChartsProps) {

    const trendData = useMemo(() => {
        // Group by month
        const months: Record<string, { compliant: number, violations: number }> = {}

        billboards.forEach(b => {
            const date = new Date(b.createdAt)
            const month = date.toLocaleString('default', { month: 'short' })

            if (!months[month]) {
                months[month] = { compliant: 0, violations: 0 }
            }

            if (b.analysis.compliant) {
                months[month].compliant++
            } else {
                months[month].violations++
            }
        })

        return Object.entries(months).map(([month, data]) => ({
            month,
            compliance: data.compliant,
            violations: data.violations
        })).reverse() // Show oldest to newest if needed, or sort properly
    }, [billboards])

    const violationTypeData = useMemo(() => {
        const types: Record<string, number> = {}

        billboards.forEach(b => {
            if (!b.analysis.compliant) {
                // Simple extraction of violation type from details string for demo
                // In real app, we'd have structured violation types
                const type = b.analysis.details ? b.analysis.details.split(' ')[0] : "General"
                types[type] = (types[type] || 0) + 1
            }
        })

        return Object.entries(types).map(([name, value]) => ({ name, value }))
    }, [billboards])

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
                        Monthly compliance vs. violation rates based on reported data.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={trendData.length > 0 ? trendData : [{ month: 'No Data', compliance: 0, violations: 0 }]}
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
                                    name="Compliant"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="violations"
                                    stroke="#ef4444"
                                    fillOpacity={1}
                                    fill="url(#colorViolations)"
                                    name="Violations"
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
                                data={violationTypeData.length > 0 ? violationTypeData : [{ name: 'No Data', value: 0 }]}
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
