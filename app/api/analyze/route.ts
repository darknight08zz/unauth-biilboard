import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { analyzeImage } from "@/lib/analysis";
import dbConnect from "@/lib/db";
import Billboard from "@/models/Billboard";
import { getToken } from "next-auth/jwt";

export async function POST(req: Request) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("image") as File;
        const name = formData.get("name") as string || "Untitled Billboard";
        const analysisDataString = formData.get("analysisData") as string;

        if (!file) {
            return NextResponse.json({ message: "No image provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        let analysis;

        if (analysisDataString) {
            try {
                // Use client-side analysis if provided
                analysis = JSON.parse(analysisDataString);
                console.log("Using client-side analysis:", analysis);
            } catch (e) {
                console.warn("Failed to parse client analysis data, falling back to server analysis", e);
                analysis = await analyzeImage(buffer);
            }
        } else {
            // Fallback to server-side analysis (mock)
            analysis = await analyzeImage(buffer);
        }

        // Save to DB
        await dbConnect();

        // Convert buffer to base64 for storage (MVP only)
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
