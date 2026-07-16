const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    companyName:{
        type:String,
        required:true,
    },
    skills:{
        type:String,
        required:true,
    },
    stipend:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    duration:{
        type:String,
        required:true,
    },
    startDate:{
        type:Date,
        required:true,
    },
    postDetails:{
        type:String,
        required:true,
    },
    userId:{
        type:String,
        required:true,
    },
    slug: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
    },
    companyLogoURL:{
        type:String,
    },
    applyLink: {
        type: String,
        trim: true,
        default: "",
    },
},{ timestamps: true });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;