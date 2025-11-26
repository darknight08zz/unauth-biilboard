import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'citizen' | 'inspector' | 'admin';
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
    role: {
        type: String,
        enum: ['citizen', 'inspector', 'admin'],
        default: 'citizen',
    },
}, { timestamps: true });

const User: Model<IUser> = mongoose.models.User as Model<IUser> || mongoose.model<IUser>('User', UserSchema);

export default User;
