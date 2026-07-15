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
    headline: {
        type: String,
        default: '',
    },
    skills: {
        type: [String],
        default: [],
    },
    education: {
        type: String,
        default: '',
    },
    experience: {
        type: String,
        default: '',
    },
    linkedinURL: {
        type: String,
        default: '',
    },
    githubURL: {
        type: String,
        default: '',
    },
    privacySettings: {
        bio: { type: Boolean, default: true },
        city: { type: Boolean, default: true },
        number: { type: Boolean, default: false },
        email: { type: Boolean, default: false },
        headline: { type: Boolean, default: true },
        skills: { type: Boolean, default: true },
        education: { type: Boolean, default: true },
        experience: { type: Boolean, default: true },
        linkedinURL: { type: Boolean, default: true },
        githubURL: { type: Boolean, default: true },
        companyName: { type: Boolean, default: true },
        companyBio: { type: Boolean, default: true },
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
