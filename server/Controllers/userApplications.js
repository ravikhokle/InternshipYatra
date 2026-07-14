const mongoose = require('mongoose');
const Apply = require('../Models/applyModel');

const userApplications = async (req, res) => {
    try {
        const { _id } = req.query;

        if (!_id) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: 'Invalid User ID.' });
        }

        const applications = await Apply.find({ userId: _id }).sort({ createdAt: -1 });

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = userApplications;
