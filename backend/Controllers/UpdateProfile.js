const mongoose = require('mongoose');
const User = require('../Models/userModel');
const { mergePrivacy } = require('../lib/privacy');
const {
    validateUsername,
    getUsernameChangeStatus,
    isUsernameAvailable,
} = require('../lib/username');

const updateProfile = async (req, res) => {
    try {
        const { _id } = req.query; 
        const { name, email, username, bio, city, number, companyName, companyBio, headline, education, experience, linkedinURL, githubURL, skills, privacySettings } = req.body;

        if (!_id) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: 'Invalid User ID.' });
        }

        const currentUser = await User.findById(_id);
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found.' });
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
                return res.status(400).json({ message: 'This email is already used in other account.' });
            }
        }

        const skillsArray = skills
            ? (Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim()).filter(Boolean))
            : undefined;

        const updateFields = {
            ...(name && { name }),
            ...(email && { email }),
            ...(bio !== undefined && { bio }),
            ...(city !== undefined && { city }),
            ...(number !== undefined && { number }),
            ...(companyName !== undefined && { companyName }),
            ...(companyBio !== undefined && { companyBio }),
            ...(headline !== undefined && { headline }),
            ...(education !== undefined && { education }),
            ...(experience !== undefined && { experience }),
            ...(linkedinURL !== undefined && { linkedinURL }),
            ...(githubURL !== undefined && { githubURL }),
            ...(skillsArray !== undefined && { skills: skillsArray }),
        };

        if (username !== undefined && username !== null && username !== '') {
            const validation = validateUsername(username);
            if (!validation.valid) {
                return res.status(400).json({ message: validation.message, success: false });
            }

            const normalizedUsername = validation.username;

            if (normalizedUsername !== currentUser.username) {
                const changeStatus = getUsernameChangeStatus(currentUser);
                if (!changeStatus.canChange) {
                    return res.status(400).json({
                        message: `You can change your username again in ${changeStatus.daysRemaining} day(s).`,
                        success: false,
                        daysRemaining: changeStatus.daysRemaining,
                        nextChangeAt: changeStatus.nextChangeAt,
                    });
                }

                const available = await isUsernameAvailable(normalizedUsername, _id);
                if (!available) {
                    return res.status(409).json({
                        message: 'This username is already taken. Please choose another.',
                        success: false,
                    });
                }

                updateFields.username = normalizedUsername;
                updateFields.usernameChangedAt = new Date();
            }
        }

        if (privacySettings !== undefined) {
            const mergedPrivacy = mergePrivacy(privacySettings);
            Object.entries(mergedPrivacy).forEach(([key, value]) => {
                updateFields[`privacySettings.${key}`] = value;
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ 
            message: 'Profile updated',
            success: true,
            username: updatedUser.username,
        });
    } catch (error) {
        if (error?.code === 11000 && error?.keyPattern?.username) {
            return res.status(409).json({
                message: 'This username is already taken. Please choose another.',
                success: false,
            });
        }

        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = updateProfile;
