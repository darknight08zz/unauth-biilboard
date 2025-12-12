const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test_db';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['citizen', 'inspector', 'admin'], default: 'citizen' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const existingUser = await User.findOne({ email: 'citizen@email.com' });
        if (existingUser) {
            console.log('User already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash('citizen123', 10);
        await User.create({
            name: 'Test Citizen',
            email: 'citizen@email.com',
            password: hashedPassword,
            role: 'citizen',
        });

        console.log('Test user created');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
