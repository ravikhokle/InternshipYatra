const JWT = require('jsonwebtoken');
const { getJwtSecret } = require('../lib/env');

const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    const jwtSecret = getJwtSecret();

    if (!jwtSecret) {
        return res.status(503).json({ message: 'Server auth is not configured' });
    }

    if (!auth) {
        return res.status(401).json({ message: 'Unauthorized, JWT token is required' });
    }

    try {
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
        const decoded = JWT.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized, JWT token wrong or expired', expired: true });
    }
};

module.exports = ensureAuthenticated;