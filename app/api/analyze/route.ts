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
        const location = formData.get("location") as string || "Unknown Location";
        const lat = parseFloat(formData.get("lat") as string);
        const lng = parseFloat(formData.get("lng") as string);
        const analysisDataString = formData.get("analysisData") as string;

        const requestId = formData.get("requestId") as string | null;

        if (!file) {
            return NextResponse.json({ message: "No image provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Check for duplicate request
        await dbConnect();
        if (requestId) {
            const existingBillboard = await Billboard.findOne({ requestId });
            if (existingBillboard) {
                // If the user submits the same request ID, return the existing process
                return NextResponse.json({
                    message: "Analysis already completed for this request",
                    data: existingBillboard,
                    analysis: {
                        complianceResults: {
                            overallCompliance: existingBillboard.analysis.compliant,
                            violations: existingBillboard.analysis.violations,
                            complianceScore: existingBillboard.analysis.complianceScore,
                            riskLevel: existingBillboard.analysis.riskLevel
                        }
                    } // Reconstruct minimal analysis object if needed by frontend, or fetch fully
                }, { status: 200 });
            }
        }

        // Server-side analysis ONLY - ignore client data for security
        const imageAnalysis = await analyzeImage(buffer);

        // Calculate compliance using the robust engine
        const { enhanceAnalysisWithCompliance } = await import("@/lib/compliance-engine");

        // Map sharp analysis to compliance engine input
        const enhancedResult = enhanceAnalysisWithCompliance({
            estimatedWidth: imageAnalysis.width / 100, // Approximate scale if no reference object
            estimatedHeight: imageAnalysis.height / 100,
            width: imageAnalysis.width,
            height: imageAnalysis.height,
            aspectRatio: imageAnalysis.aspectRatio,
            // Pass other detected attributes if available from analyzeImage
        }, {
            location: location // Use provided location string for context
        });

        // Convert buffer to base64 for storage (MVP only)
        const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

        const isCompliant = enhancedResult.complianceResults.overallCompliance;

        const billboard = await Billboard.create({
            userId: new mongoose.Types.ObjectId((token.id || token.sub) as string),
            requestId: requestId,
            status: isCompliant ? 'resolved' : 'pending', // Auto-resolve if compliant
            name,
            location,
            coordinates: (!isNaN(lat) && !isNaN(lng)) ? { lat, lng } : undefined,
            imageUrl: base64Image,
            analysis: {
                width: imageAnalysis.width,
                height: imageAnalysis.height,
                aspectRatio: imageAnalysis.aspectRatio,
                compliant: isCompliant,
                details: enhancedResult.complianceResults.violations.map(v => v.result.violationMessage).join(", ") || "Compliant",
                complianceScore: enhancedResult.complianceResults.complianceScore,
                riskLevel: enhancedResult.complianceResults.riskLevel,
                violations: enhancedResult.complianceResults.violations
            },
        });

        // Award points and badges
        const pointsAwarded = 10;
        const userUpdateUpdates: any = { $inc: { points: pointsAwarded } };

        // Check if this is the first report to award a badge
        const userReportCount = await Billboard.countDocuments({ userId: billboard.userId });
        if (userReportCount === 1) {
            userUpdateUpdates.$addToSet = { badges: "First Reporter" };
        } else if (userReportCount === 5) {
            userUpdateUpdates.$addToSet = { badges: "Active Citizen" };
        }

        await mongoose.model('User').findByIdAndUpdate(billboard.userId, userUpdateUpdates);

        return NextResponse.json({
            message: "Analysis complete",
            data: billboard,
            analysis: enhancedResult,
            pointsEarned: pointsAwarded
        }, { status: 201 });

    } catch (error) {
        console.error("Analysis error:", error);
        return NextResponse.json(
            { message: "Internal server error", error: String(error) },
            { status: 500 }
        );
    }
}
