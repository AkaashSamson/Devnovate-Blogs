// import express, { Express, Request, Response } from 'express';
// import cors from 'cors';
// import 'dotenv/config';
// import cookieParser from 'cookie-parser';
// import connectDB from '../config/mongodb';
// import authRoutes from '../routes/authRoutes';
// import userRoutes from '../routes/userRoutes';
// import blogRoutes from '../routes/blogRoutes';
// import uploadRoutes from '../routes/uploadRoutes';

// // dotenv.config();

// const app: Express = express();
// const PORT: number = parseInt(process.env.PORT || '10000', 10);  // Use Render's default 10000
// connectDB();

// // Parse request bodies & cookies early
// app.use(express.json());
// app.use(cookieParser());
// app.use('/uploads', express.static('uploads'));
// // Connect to MongoDB


// // CORS configuration (SINGLE middleware) -----------------------------------
// // Include all dev client origins you might use. You can adjust CLIENT_URL in .env
// const allowedOrigins: string[] = [
//   process.env.CLIENT_URL || 'http://localhost:3000',
// ];
// console.log(allowedOrigins);

// app.use(
//   cors({
//    origin: allowedOrigins,
//    credentials: true
//   })
// );

// // (Removed manual app.options('*') handler; Express 5/path-to-regexp v6 rejects bare '*'.
// // The cors middleware above already responds to preflight requests.)

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/blogs', blogRoutes);
// app.use('/api/upload', uploadRoutes);

// app.get('/health', (_req: Request, res: Response) => {
//     res.status(200).json({ 
//         status: 'OK', 
//         message: 'Server is running',
//         port: PORT,
//         env: process.env.NODE_ENV 
//     });
// });

// const server = app.listen(PORT, () => {
//     console.log(`🚀 Server is running on PORT: ${PORT}`);
//     console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
//     console.log(`🔗 Health check: http://localhost:${PORT}/health`);
// });

// // Graceful shutdown
// process.on('SIGTERM', () => {
//     console.log('SIGTERM received, shutting down gracefully');
//     server.close(() => {
//         console.log('Process terminated');
//     });
// });