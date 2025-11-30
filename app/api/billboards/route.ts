import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Billboard from "@/models/Billboard";

export const dynamic = 'force-dynamic'; // Ensure this route is not cached statically

export async function GET() {
    try {
        await dbConnect();

        // Fetch all billboards, sorted by newest first
        const billboards = await Billboard.find({}).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: billboards
        });
    } catch (error) {
        console.error("Error fetching billboards:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch billboards" },
            { status: 500 }
        );
    }
}
