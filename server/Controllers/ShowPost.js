const mongoose = require('mongoose');
const Post = require('../Models/PostModel');

const ShowPost = async (req,res)=>{
    try {
        const posts = await Post.find()
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = ShowPost;