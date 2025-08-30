const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');

// Generate random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT token with safety checks
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not configured');
    }
    try {
        return jwt.sign({ userId }, secret, { expiresIn: '7d' });
    } catch (err) {
        throw new Error('Failed to sign JWT token');
    }
};

// Register user
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Generate OTP for email verification
        const verifyOtp = generateOTP();
        const verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isAccountVerified: true
        });

        // Generate JWT token
        const token = generateToken(user._id);

        // Hardcoded production behavior for deployment
        const isProduction = true;
        console.log('Force production mode in register:', isProduction);
        console.log('Sending token in register response for cross-domain compatibility');

        // Always send token in response for better cross-domain compatibility
        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please verify your email.',
            token: token, // Always send token
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {
        console.error('register error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        // Hardcoded production behavior for deployment
        const isProduction = true;
        console.log('Force production mode in auth:', isProduction);
        console.log('Sending token in response for cross-domain compatibility');

        // Always send token in response for better cross-domain compatibility
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token, // Always send token
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {
        console.error('login error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Logout user
const logout = async (req, res) => {
    try {
        // Hardcoded production behavior for deployment
        const isProduction = true;
        console.log('Force production mode in logout:', isProduction);
        
        // Clear the token cookie (for any existing cookies)
        res.clearCookie('token', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'strict'
        });

        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });

    } catch (error) {
        console.error('logout error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Verify account with OTP
const verifyAccount = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validation
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if account is already verified
        if (user.isAccountVerified) {
            return res.status(400).json({
                success: false,
                message: 'Account is already verified'
            });
        }

        // Check OTP and expiry
        if (user.verifyOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired'
            });
        }

        // Verify account
        user.isAccountVerified = true;
        user.verifyOtp = null;
        user.verifyOtpExpireAt = 0;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Account verified successfully'
        });

    } catch (error) {
        console.error('verifyAccount error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Send password reset OTP
const sendPasswordResetOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Validation
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found with this email'
            });
        }

        // Generate reset OTP
        const resetOtp = generateOTP();
        const resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes

        // Save reset OTP
        user.resetOtp = resetOtp;
        user.resetOtpExpireAt = resetOtpExpireAt;
        await user.save();

        // TODO: Send password reset email with OTP
        console.log(`Password reset OTP for ${email}: ${resetOtp}`);

        res.status(200).json({
            success: true,
            message: 'Password reset OTP sent to your email'
        });

    } catch (error) {
        console.error('sendPasswordResetOTP error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Reset password with OTP
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Validation
        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Email, OTP, and new password are required'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check OTP and expiry
        if (user.resetOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password and clear reset OTP
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });

    } catch (error) {
        console.error('resetPassword error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get user profile (requires authentication)
const getProfile = async (req, res) => {
    try {
        // Extract user ID from token (requires auth middleware)
        const userId = req.userId;

        const user = await User.findById(userId).select('-password -verifyOtp -resetOtp');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error('getProfile error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    register,
    login,
    logout,
    verifyAccount,
    sendPasswordResetOTP,
    resetPassword,
    getProfile
};
