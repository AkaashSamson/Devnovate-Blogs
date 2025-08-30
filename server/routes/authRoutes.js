const express = require('express');
const {
    register,
    login,
    logout,
    verifyAccount,
    sendPasswordResetOTP,
    resetPassword,
    getProfile
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

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

module.exports = router;
