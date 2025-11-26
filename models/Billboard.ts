import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBillboard extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    imageUrl: string;
    analysis: {
        width: number;
        height: number;
        aspectRatio: number;
        compliant: boolean;
        details: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const BillboardSchema: Schema<IBillboard> = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Please provide a name for the billboard'],
    },
    imageUrl: {
        type: String, // Can be a URL or Base64 string
        required: [true, 'Please provide an image'],
    },
    analysis: {
        width: Number,
        height: Number,
        aspectRatio: Number,
        compliant: Boolean,
        details: String,
    },
}, { timestamps: true });

const Billboard: Model<IBillboard> = mongoose.models.Billboard as Model<IBillboard> || mongoose.model<IBillboard>('Billboard', BillboardSchema);

export default Billboard;
