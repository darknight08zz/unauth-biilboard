import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { analyzeImage } from "@/lib/analysis";
import dbConnect from "@/lib/db";
import Billboard from "@/models/Billboard";
// import { auth } from "@/auth"; // Removed invalid import
// I need to get session. I can use getServerSession from next-auth.
// Or use the auth helper if I created one. I didn't create a central auth helper file, just the route.
// I should use getServerSession with the options.
// But I didn't export options. I should have exported options from a config file.

// Let's refactor auth config first? Or just duplicate it for now?
// Duplicating is bad. I'll create auth.config.ts or similar if I can.
// But for now, I'll just assume I can get session or skip auth for MVP testing if needed, but better to do it right.

// I'll create a simple session check.
import { getToken } from "next-auth/jwt";

export async function POST(req: Request) {
    try {
        // Check auth
        // const token = await getToken({ req });
        // if (!token) {
        //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        // }
        // Commented out auth for easier testing if needed, but should be enabled.
        // Let's enable it.
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            // For MVP, maybe allow unauthenticated uploads? The user said "unauth-biilboard" folder name...
            // But the prompt says "work on backend... for signing".
            // I'll enforce auth if possible, but getToken might fail if cookies aren't sent right in Postman.
            // I'll return 401.
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("image") as File;
        const name = formData.get("name") as string || "Untitled Billboard";

        if (!file) {
            return NextResponse.json({ message: "No image provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Analyze
        const analysis = await analyzeImage(buffer);

        // Save to DB
        await dbConnect();

        // Convert buffer to base64 for storage (MVP only, not production ready for large apps)
        const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

        const billboard = await Billboard.create({
            userId: new mongoose.Types.ObjectId((token.id || token.sub) as string),
            name,
            imageUrl: base64Image,
            analysis: {
                width: analysis.width,
                height: analysis.height,
                aspectRatio: analysis.aspectRatio,
                compliant: analysis.compliant,
                details: analysis.details,
            },
        });

        return NextResponse.json({
            message: "Analysis complete",
            data: billboard,
            analysis
        }, { status: 201 });

    } catch (error) {
        console.error("Analysis error:", error);
        return NextResponse.json(
            { message: "Internal server error", error: String(error) },
            { status: 500 }
        );
    }
}
