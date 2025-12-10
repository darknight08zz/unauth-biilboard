import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBillboard extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    location: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    imageUrl: string;
    analysis: {
        width: number;
        height: number;
        aspectRatio: number;
        compliant: boolean;
        details: string;
        complianceScore?: number;
        riskLevel?: string;
        violations?: Array<{
            rule: any; // Using any for flexibility or define a sub-interface
            result: any;
        }>;
    };
    userFeedback?: {
        isCorrect: boolean;
        correction?: string;
        submittedAt: Date;
    };
    adminNotes?: string;
    requestId?: string;
    status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
    createdAt: Date;
    updatedAt: Date;
}

const BillboardSchema: Schema<IBillboard> = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    requestId: {
        type: String,
        unique: true,
        sparse: true, // Allows null/undefined values to exist without violating uniqueness
    },
    status: {
        type: String,
        enum: ['pending', 'investigating', 'resolved', 'dismissed'],
        default: 'pending',
    },
    adminNotes: {
        type: String,
        default: "",
    },
    name: {
        type: String,
        required: [true, 'Please provide a name for the billboard'],
    },
    location: {
        type: String,
        required: [true, 'Please provide a location'],
    },
    coordinates: {
        lat: Number,
        lng: Number,
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
        complianceScore: Number,
        riskLevel: String,
        violations: [{
            rule: mongoose.Schema.Types.Mixed,
            result: mongoose.Schema.Types.Mixed
        }]
    },
    userFeedback: {
        isCorrect: Boolean,
        correction: String,
        submittedAt: Date,
    },
}, { timestamps: true });

const Billboard: Model<IBillboard> = mongoose.models.Billboard as Model<IBillboard> || mongoose.model<IBillboard>('Billboard', BillboardSchema);

export default Billboard;
