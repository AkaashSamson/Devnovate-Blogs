import { Request, Response } from 'express';
import User from '../models/usermodel';

// GET /api/users/me - returns current authenticated user (minus sensitive fields)
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('-password -verifyOtp -resetOtp');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('getCurrentUser error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
