const { required } = require('joi');
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

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
