const { MongoMemoryServer } = require('mongodb-memory-server');
const { spawn } = require('child_process');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Config
const PORT = 3000;

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['citizen', 'inspector', 'admin'], default: 'citizen' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seed(uri) {
    try {
        console.log('Connecting to MongoDB for seeding...');
        await mongoose.connect(uri);
        console.log('Connected.');

        const existingUser = await User.findOne({ email: 'citizen@email.com' });
        if (existingUser) {
            console.log('User already exists');
        } else {
            const hashedPassword = await bcrypt.hash('citizen123', 10);
            await User.create({
                name: 'Test Citizen',
                email: 'citizen@email.com',
                password: hashedPassword,
                role: 'citizen',
            });
            console.log('Test user created: citizen@email.com');
        }
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

async function run() {
    let mongod;
    let nextProcess;

    try {
        // 1. Start MongoDB Memory Server
        console.log('Starting MongoDB Memory Server...');
        mongod = await MongoMemoryServer.create({
            instance: {
                port: 27017 // Try fixing port if possible, or dynamic
            }
        });
        const uri = mongod.getUri();
        console.log(`MongoDB started at ${uri}`);

        // Set Env Vars for Child Process
        const env = {
            ...process.env,
            MONGODB_URI: uri,
            AUTH_SECRET: process.env.AUTH_SECRET || 'supersecret_for_testing',
            NEXTAUTH_URL: `http://localhost:${PORT}`,
            PORT: String(PORT)
        };

        // 2. Seed Database
        await seed(uri);

        // 3. Start Next.js App
        console.log('Starting Next.js...');
        // Use 'npm run dev' but we need to pass the env
        nextProcess = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'dev'], {
            stdio: 'inherit',
            env: env,
            shell: true
        });

        // 4. Handle Cleanup
        const cleanup = async () => {
            console.log('Stopping...');
            if (nextProcess) nextProcess.kill();
            if (mongod) await mongod.stop();
            process.exit();
        };

        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);
        process.on('exit', cleanup);

        // Keep process alive while next runs
        nextProcess.on('close', (code) => {
            console.log(`Next.js process exited with code ${code}`);
            cleanup();
        });

    } catch (err) {
        console.error(err);
        if (mongod) await mongod.stop();
        process.exit(1);
    }
}

run();
