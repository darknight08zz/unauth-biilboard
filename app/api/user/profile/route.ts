import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import User from "@/models/User"
import Billboard from "@/models/Billboard"
import { auth } from "@/auth"

export async function GET(req: Request) {
    try {
        console.log("Profile API: Connecting to DB...")
        await connectToDatabase()
        console.log("Profile API: DB Connected")

        // Get user from session
        const session = await auth()

        if (!session || !session.user) {
            console.log("Profile API: No session found")
            return NextResponse.json({ error: "Unauthorized - No session" }, { status: 401 })
        }

        const userId = session.user.id
        console.log("Profile API: Session verified, UserId:", userId)

        // Fetch user details
        const user = await User.findById(userId).select("-password")
        if (!user) {
            console.log("Profile API: User not found in DB")
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Fetch user's reports
        const reports = await Billboard.find({ userId }).sort({ createdAt: -1 })
        console.log(`Profile API: Found ${reports.length} reports for user`)

        // Calculate stats
        const totalReports = reports.length
        const compliantReports = reports.filter((r) => r.analysis.compliant).length
        const complianceRate = totalReports > 0 ? Math.round((compliantReports / totalReports) * 100) : 0

        return NextResponse.json({
            user,
            stats: {
                totalReports,
                complianceRate,
                points: user.points || 0,
            },
            recentActivity: reports.slice(0, 5), // Last 5 reports
        })
    } catch (error) {
        console.error("Error fetching profile:", error)
        return NextResponse.json({ error: "Failed to fetch profile: " + (error as Error).message }, { status: 500 })
    }
}
