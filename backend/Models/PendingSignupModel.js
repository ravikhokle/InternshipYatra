const mongoose = require('mongoose');

const pendingSignupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    otpExpiry: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

// Auto-delete pending signups after 15 minutes
pendingSignupSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

const PendingSignup = mongoose.model('PendingSignup', pendingSignupSchema);

module.exports = PendingSignup;
