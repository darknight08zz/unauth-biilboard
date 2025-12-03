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
