import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    image?: string;
    bio?: string;
    location?: string;
    phone?: string;
    website?: string;
    socials?: {
        twitter?: string;
        linkedin?: string;
        github?: string;
    };
    role: 'citizen' | 'inspector' | 'admin';
    points: number;
    badges: string[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    image: {
        type: String,
    },
    bio: {
        type: String,
        maxlength: [160, 'Bio cannot be more than 160 characters'],
    },
    location: {
        type: String,
    },
    phone: {
        type: String,
    },
    website: {
        type: String,
    },
    socials: {
        twitter: String,
        linkedin: String,
        github: String,
    },
    role: {
        type: String,
        enum: ['citizen', 'inspector', 'admin'],
        default: 'citizen',
    },
    points: {
        type: Number,
        default: 0,
    },
    badges: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

const User: Model<IUser> = mongoose.models.User as Model<IUser> || mongoose.model<IUser>('User', UserSchema);

export default User;
