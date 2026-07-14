const mongoose = require('mongoose');
const User = require('../Models/userModel');

const isPublic = (settings, field) => settings?.[field] !== false;

const publicProfile = async (req, res) => {
    try {
        const { _id } = req.query;

        if (!_id) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: 'Invalid User ID.' });
        }

        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const ps = user.privacySettings || {};

        const publicProfileData = {
            _id,
            name: user.name,
            profileImgURL: user.profileImgURL,
            createdAt: user.createdAt,
            ...(isPublic(ps, 'headline') && user.headline && { headline: user.headline }),
            ...(isPublic(ps, 'bio') && user.bio && { bio: user.bio }),
            ...(isPublic(ps, 'city') && user.city && { city: user.city }),
            ...(isPublic(ps, 'email') && user.email && { email: user.email }),
            ...(isPublic(ps, 'number') && user.number && { number: user.number }),
            ...(isPublic(ps, 'skills') && user.skills?.length > 0 && { skills: user.skills }),
            ...(isPublic(ps, 'education') && user.education && { education: user.education }),
            ...(isPublic(ps, 'experience') && user.experience && { experience: user.experience }),
            ...(isPublic(ps, 'linkedinURL') && user.linkedinURL && { linkedinURL: user.linkedinURL }),
            ...(isPublic(ps, 'githubURL') && user.githubURL && { githubURL: user.githubURL }),
            ...(isPublic(ps, 'companyName') && user.companyName && { companyName: user.companyName }),
            ...(isPublic(ps, 'companyBio') && user.companyBio && { companyBio: user.companyBio }),
        };

        res.status(200).json(publicProfileData);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = publicProfile;
