const mongoose = require('mongoose');
const User = require('../Models/userModel');

const userProfile = async (req, res) => {
    try {

        const { _id } = req.query;

        if (!_id) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: 'Invalid User ID.' });
        }

        const response = await User.findById(_id);

        if (!response) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = userProfile;
