import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import Billboard from "@/models/Billboard"

export async function POST(req: Request) {
    try {
        await connectToDatabase()
        const { billboardId, isCorrect, correction } = await req.json()

        if (!billboardId) {
            return NextResponse.json({ error: "Billboard ID is required" }, { status: 400 })
        }

        const updatedBillboard = await Billboard.findByIdAndUpdate(
            billboardId,
            {
                userFeedback: {
                    isCorrect,
                    correction,
                    submittedAt: new Date(),
                },
            },
            { new: true }
        )

        if (!updatedBillboard) {
            return NextResponse.json({ error: "Billboard not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, data: updatedBillboard })
    } catch (error) {
        console.error("Error submitting feedback:", error)
        return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
    }
}
