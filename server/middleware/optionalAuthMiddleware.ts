import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Optional auth middleware - sets userId if token is valid, but doesn't require it
export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    
    if (token) {
      const secret = process.env.JWT_SECRET;
      if (secret) {
        const decoded = jwt.verify(token, secret) as { userId: string };
        (req as any).userId = decoded.userId;
      }
    }
    
    // Continue regardless of whether token was valid or not
    next();
  } catch (error) {
    // Invalid token, but continue without authentication
    next();
  }
};
