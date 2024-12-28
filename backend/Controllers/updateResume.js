const mongoose = require('mongoose');
const User = require('../Models/userModel');

const updateResume = async (req, res) => {
    try {
        const { _id } = req.query; 
        const resumeURL = `https://internship-kro.onrender.com/public/resume/${req.file.filename}`;

        if (!_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { $set: {...(resumeURL && { resumeURL }) } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ 
            message: 'Resume Updated',
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: 'Error while updating resume', error: error.message });
    }
};

module.exports = updateResume;
