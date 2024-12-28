const mongoose = require('mongoose');
const Post = require('../Models/PostModel');

const viewDetails = async (req,res)=>{   
    const { id } = req.query; 
    try {
        const posts = await Post.find({_id:id});
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = viewDetails;