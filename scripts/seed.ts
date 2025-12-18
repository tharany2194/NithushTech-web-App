import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://axelerawebtech_db_user:FKP0hAznDjd9x0TH@nithushtechcluster0.rrrmmol.mongodb.net/nithushtech?retryWrites=true&w=majority';

// User Schema (inline to avoid module issues)
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'staff'], default: 'staff' },
}, { timestamps: true });

async function seed() {
    try {
        console.log('🌱 Starting database seed...');

        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@nithushtech.com' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists. Skipping...');
        } else {
            // Create admin user
            const hashedPassword = await bcrypt.hash('admin123', 12);

            const admin = await User.create({
                name: 'Admin',
                email: 'admin@nithushtech.com',
                password: hashedPassword,
                role: 'admin',
            });

            console.log('✅ Admin user created successfully!');
            console.log('📧 Email: admin@nithushtech.com');
            console.log('🔑 Password: admin123');
            console.log('👤 Role: admin');
        }

        // Create a sample staff user
        const existingStaff = await User.findOne({ email: 'staff@nithushtech.com' });

        if (existingStaff) {
            console.log('⚠️  Staff user already exists. Skipping...');
        } else {
            const hashedPassword = await bcrypt.hash('staff123', 12);

            await User.create({
                name: 'Staff Member',
                email: 'staff@nithushtech.com',
                password: hashedPassword,
                role: 'staff',
            });

            console.log('✅ Staff user created successfully!');
            console.log('📧 Email: staff@nithushtech.com');
            console.log('🔑 Password: staff123');
            console.log('👤 Role: staff');
        }

        console.log('\n🎉 Seed completed successfully!');

    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    }
}

seed();
