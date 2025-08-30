const express = require('express');
const cors = require('cors');
require('dotenv/config');
const cookieParser = require('cookie-parser');
const connectDB = require('../config/mongodb');
const authRoutes = require('../routes/authRoutes');
const userRoutes = require('../routes/userRoutes');
const blogRoutes = require('../routes/blogRoutes');

const app = express();
const PORT = parseInt(process.env.PORT || '10000', 10);  // Use Render's default 10000

// Smart production detection for deployment
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER || process.env.PORT === '10000' || PORT === 10000;
console.log('Smart production detection:', {
    NODE_ENV: process.env.NODE_ENV,
    RENDER: process.env.RENDER,
    PORT: PORT,
    isProduction: isProduction
});

connectDB();

// Parse request bodies & cookies early
app.use(express.json());
app.use(cookieParser());

// Debug middleware for production troubleshooting
app.use((req, res, next) => {
  // Only log non-health check requests to reduce noise
  if (req.path !== '/' && req.path !== '/health') {
    console.log(`${req.method} ${req.path}`);
    console.log('Origin:', req.headers.origin);
    console.log('Cookies:', req.headers.cookie ? 'Present' : 'Missing');
    console.log('Auth header:', req.headers.authorization ? 'Present' : 'Missing');
  }
  next();
});

// CORS configuration (SINGLE middleware) -----------------------------------
// Smart origins based on environment
const allowedOrigins = isProduction 
    ? (process.env.CLIENT_URL ? [process.env.CLIENT_URL] : ['https://yourfrontendurl.com'])
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174']; // Local dev origins

console.log('Allowed origins:', allowedOrigins);
console.log('Production mode:', isProduction);

app.use(
  cors({
   origin: allowedOrigins,
   credentials: true,
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is running',
        port: PORT,
        env: isProduction ? 'production' : 'development', // Use our hardcoded value
        mode: 'forced-production'
    });
});

const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on PORT: ${PORT}`);
    console.log(`🌍 Environment: ${isProduction ? 'production' : 'development'} (forced)`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});
