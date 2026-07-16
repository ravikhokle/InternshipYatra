const mongoose = require('mongoose');
const User = require('../Models/userModel');
const { isFieldPublic } = require('../lib/privacy');

const publicProfile = async (req, res) => {
    try {
        const { username, _id } = req.query;

        if (!username && !_id) {
            return res.status(400).json({ message: 'Username is required.' });
        }

        let user;

        if (username) {
            user = await User.findOne({ username: username.toLowerCase().trim() });
        } else if (mongoose.Types.ObjectId.isValid(_id)) {
            user = await User.findById(_id);
        } else {
            return res.status(400).json({ message: 'Invalid profile identifier.' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const ps = user.privacySettings || {};

        const publicProfileData = {
            _id: user._id,
            username: user.username,
            name: user.name,
            profileImgURL: user.profileImgURL,
            createdAt: user.createdAt,
        };

        const maybeSet = (field, value) => {
            if (isFieldPublic(ps, field) && value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value)) {
                    if (value.length > 0) publicProfileData[field] = value;
                } else {
                    publicProfileData[field] = value;
                }
            }
        };

        maybeSet('headline', user.headline);
        maybeSet('bio', user.bio);
        maybeSet('city', user.city);
        maybeSet('email', user.email);
        maybeSet('number', user.number);
        maybeSet('skills', user.skills);
        maybeSet('education', user.education);
        maybeSet('experience', user.experience);
        maybeSet('linkedinURL', user.linkedinURL);
        maybeSet('githubURL', user.githubURL);
        maybeSet('companyName', user.companyName);
        maybeSet('companyBio', user.companyBio);

        if (isFieldPublic(ps, 'companyName') && user.companyLogoURL) {
            publicProfileData.companyLogoURL = user.companyLogoURL;
        }

        res.status(200).json(publicProfileData);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = publicProfile;
