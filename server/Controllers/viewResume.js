const mongoose = require('mongoose');
const User = require('../Models/userModel');

const normalizePdfUrl = (url) => {
    if (!url) return url;
    let normalized = url.trim();
    if (normalized.includes('/image/upload/') && normalized.includes('/resume/')) {
        normalized = normalized.replace('/image/upload/', '/raw/upload/');
    }
    if (!normalized.toLowerCase().endsWith('.pdf')) {
        normalized = `${normalized}.pdf`;
    }
    return normalized;
};

const viewResume = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(userId).select('resumeURL name');

        if (!user?.resumeURL) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        const candidates = [user.resumeURL, normalizePdfUrl(user.resumeURL)]
            .filter((url, index, arr) => url && arr.indexOf(url) === index);

        let buffer = null;

        for (const url of candidates) {
            try {
                const response = await fetch(url);
                if (!response.ok) continue;

                const contentType = response.headers.get('content-type') || '';
                const data = Buffer.from(await response.arrayBuffer());

                if (data.length > 4 && data.subarray(0, 4).toString() === '%PDF') {
                    buffer = data;
                    break;
                }

                if (contentType.includes('pdf') && data.length > 0) {
                    buffer = data;
                    break;
                }
            } catch {
                // try next candidate URL
            }
        }

        if (!buffer) {
            return res.status(502).json({ message: 'Could not load resume file' });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${(user.name || 'resume').replace(/"/g, '')}-resume.pdf"`);
        res.setHeader('Cache-Control', 'private, max-age=3600');
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: 'Error loading resume', error: error.message });
    }
};

module.exports = viewResume;
