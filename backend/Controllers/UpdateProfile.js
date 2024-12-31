const mongoose = require('mongoose');
const User = require('../Models/userModel');

const updateProfile = async (req, res) => {
    try {
        const { _id } = req.query; 
        const { name, email, bio, city, number, companyName, companyBio } = req.body;

        if (!_id) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: 'Invalid User ID.' });
        }

        if (!name && !email) {
            return res.status(400).json({ 
                message: 'Name or email is required for update.',
                success: false
             });
        }

        if (email) {
            const emailExists = await User.findOne({ email, _id: { $ne: _id } });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already exists.' });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { $set: { ...(name && { name }), ...(email && { email }), ...(bio && { bio }), ...(city && { city }), ...(number && { number }), ...(companyName && { companyName }), ...(companyBio && { companyBio }) } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ 
            message: 'Profile updated',
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = updateProfile;
