const mongoose = require('mongoose');
const Post = require('../Models/PostModel');

const searchPost = async (req,res)=>{   
    const { title } = req.query; 
    try {
        const posts = await Post.find({     
            title: { '$regex': title, '$options': 'i' } 
        }).limit(10); 
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = searchPost;