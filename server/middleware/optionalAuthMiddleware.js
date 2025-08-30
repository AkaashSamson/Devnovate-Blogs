const jwt = require('jsonwebtoken');

// Optional auth middleware - sets userId if token is valid, but doesn't require it
const optionalAuthMiddleware = (req, res, next) => {
  try {
    // Get token from cookie (development) or Authorization header (production)
    let token = req.cookies?.token;
    
    // If no cookie token, check Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }
    
    if (token) {
      const secret = process.env.JWT_SECRET;
      if (secret) {
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.userId;
      }
    }
    
    // Continue regardless of whether token was valid or not
    next();
  } catch (error) {
    // Invalid token, but continue without authentication
    next();
  }
};

module.exports = { optionalAuthMiddleware };
