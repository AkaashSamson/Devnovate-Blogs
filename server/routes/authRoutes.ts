import express from 'express';
import {
    register,
    login,
    logout,
    verifyAccount,
    sendPasswordResetOTP,
    resetPassword,
    getProfile
} from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify-account', verifyAccount);
router.post('/send-reset-otp', sendPasswordResetOTP);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', authMiddleware, getProfile);

export default router;
