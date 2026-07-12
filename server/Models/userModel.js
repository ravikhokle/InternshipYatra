const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    googleId: {
        type: String,
        default: null,
        sparse: true,
        unique: true,
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local',
    },
    profileImgURL: {
        type: String,
        required: true,
    },
    companyLogoURL: {
        type: String,
    },
    companyName:{
        type: String,
    },
    companyBio: {
        type: String,
    },
    resumeURL: {
        type: String,
    },
    bio: {
        type: String,
    },
    city: {
        type: String,
    },
    number: {
        type: String,
    },
    refreshToken: {
        type: String,
        default: null,
    },
    otp: {
        type: String,
        default: null,
    },
    otpExpiry: {
        type: Date,
        default: null,
    },
    resetToken: {
        type: String,
        default: null,
    },

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
