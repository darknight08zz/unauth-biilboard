"use client"

import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ActivityItem {
    _id: string
    location: string
    createdAt: string
    analysis: {
        compliant: boolean
        violations: any[]
    }
}

interface ActivityListProps {
    activities: ActivityItem[]
}

export function ActivityList({ activities }: ActivityListProps) {
    if (activities.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground border rounded-lg bg-muted/50">
                <p>No activity yet.</p>
                <p className="text-sm">Submit your first report to see it here!</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {activities.map((report) => (
                <div key={report._id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${report.analysis.compliant ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {report.analysis.compliant ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                        </div>
                        <div>
                            <p className="font-medium">{report.location || "Unknown Location"}</p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(report.createdAt).toLocaleDateString()} • {report.analysis.compliant ? "Compliant" : "Violation Detected"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={report.analysis.compliant ? "outline" : "destructive"}>
                            {report.analysis.compliant ? "Approved" : "Pending Action"}
                        </Badge>
                        <Link href={`/dashboard?id=${report._id}`}> {/* Assuming dashboard can handle ID, or just general link */}
                            {/* Ideally we'd link to specific report details */}
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )
}
