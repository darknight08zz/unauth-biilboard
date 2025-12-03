import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import User from "@/models/User"
import Billboard from "@/models/Billboard"
import { auth } from "@/auth"

export async function DELETE(req: Request) {
    try {
        await connectToDatabase()

        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userId = session.user.id

        // Delete user's billboards (optional, but good for cleanup)
        // Or we could keep them and set userId to null if we want to preserve data
        // For now, let's delete them to be "permanent" as requested
        await Billboard.deleteMany({ userId })

        // Delete the user
        const deletedUser = await User.findByIdAndDelete(userId)

        if (!deletedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Account deleted successfully" })
    } catch (error) {
        console.error("Error deleting account:", error)
        return NextResponse.json({ error: "Failed to delete account" }, { status: 500 })
    }
}
