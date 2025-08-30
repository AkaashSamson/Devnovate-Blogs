import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
        verifyOtp: {
            type: String,
            default: null
        },
        verifyOtpExpireAt: {
            type: Number,
            default: 0
        },
        isAccountVerified: {
            type: Boolean,
            default: false
        },
        resetOtp: {
            type: String,
            default: ''
        },
        resetOtpExpireAt: {
            type: Number,
            default: 0
        }
});

const User = mongoose.models.user || mongoose.model('User', userSchema);

export default User;

