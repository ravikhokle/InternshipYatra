const mongoose = require('mongoose');
const Post = require('../Models/PostModel');

const viewDetails = async (req,res)=>{   
    const { _id } = req.query; 
    try {
        const posts = await Post.findById(_id);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = viewDetails;