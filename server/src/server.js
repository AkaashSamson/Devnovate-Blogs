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
connectDB();

// Parse request bodies & cookies early
app.use(express.json());
app.use(cookieParser());

// CORS configuration (SINGLE middleware) -----------------------------------
// Include all dev client origins you might use. You can adjust CLIENT_URL in .env
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
];
console.log(allowedOrigins);

app.use(
  cors({
   origin: allowedOrigins,
   credentials: true
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
        env: process.env.NODE_ENV 
    });
});

const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on PORT: ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});
