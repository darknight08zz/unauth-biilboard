import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import User from "@/models/User"

export async function GET() {
    try {
        await connectToDatabase()

        const topUsers = await User.find({})
            .select("name points badges")
            .sort({ points: -1 })
            .limit(10)

        return NextResponse.json(topUsers)
    } catch (error) {
        console.error("Error fetching leaderboard:", error)
        return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
    }
}
