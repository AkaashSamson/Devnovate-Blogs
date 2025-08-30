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

// Force production mode for deployment
const isProduction = true; // Hardcoded for deployment
console.log('Forced production mode:', isProduction);

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
// Hardcoded production origins
const allowedOrigins = [
  'https://devnovate-blogs-eta.vercel.app', // Your deployed frontend
  'http://localhost:5173', // Vite dev server (for local development)
  'http://localhost:3000'  // React dev server (for local development)
];

console.log('Allowed origins (hardcoded for production):', allowedOrigins);
console.log('Production mode forced:', isProduction);

app.use(
  cors({
   origin: function (origin, callback) {
     // Allow requests with no origin (like mobile apps, curl requests, or health checks)
     if (!origin) return callback(null, true);
     
     if (allowedOrigins.indexOf(origin) !== -1) {
       callback(null, true);
     } else {
       console.log('Blocked origin:', origin);
       callback(new Error('Not allowed by CORS'));
     }
   },
   credentials: true,
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
   allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
   exposedHeaders: ['Set-Cookie']
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
