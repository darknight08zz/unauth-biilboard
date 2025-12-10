import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Billboard from "@/models/Billboard";

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const params = await props.params;
        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Billboard ID is required" },
                { status: 400 }
            );
        }

        const deletedBillboard = await Billboard.findByIdAndDelete(id);

        if (!deletedBillboard) {
            return NextResponse.json(
                { success: false, message: "Billboard not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Billboard deleted successfully",
            data: deletedBillboard,
        });
    } catch (error) {
        console.error("Error deleting billboard:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete billboard" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const params = await props.params;
        const { id } = params;
        const body = await request.json();
        const { status, adminNotes } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Billboard ID is required" },
                { status: 400 }
            );
        }

        const updateData: any = {};
        if (status) updateData.status = status;
        if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

        const updatedBillboard = await Billboard.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        if (!updatedBillboard) {
            return NextResponse.json(
                { success: false, message: "Billboard not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Billboard updated successfully",
            data: updatedBillboard
        });

    } catch (error) {
        console.error("Error updating billboard:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update billboard" },
            { status: 500 }
        );
    }
}
