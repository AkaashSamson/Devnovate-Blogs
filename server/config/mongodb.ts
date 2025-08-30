import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log('MongoDB connected'));
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

export default connectDB;