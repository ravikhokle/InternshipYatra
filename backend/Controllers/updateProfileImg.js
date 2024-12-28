const mongoose = require('mongoose');
const User = require('../Models/userModel');

const updateProfile = async (req, res) => {
    try {
        const { _id } = req.query; 
        const profileImgURL = `https://internship-kro.onrender.com/public/images/profileImages/${req.file.filename}`;

        if (!_id) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: 'Invalid User ID.' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { $set: {...(profileImgURL && { profileImgURL }) } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ 
                message: 'User not found',
                success: false
             });
        }

        res.status(200).json({ 
            message: 'Profile image updated',
            success: true,
            userProfile: profileImgURL,
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'error while updating profile image', error: error.message,
            success: false,
        });
    }
};

module.exports = updateProfile;
