const JWT = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];

    if (!auth) {
        return res.status(401).json({ message: 'Unauthorized, JWT token is required' });
    }

    try {
        // Accepts "Bearer <token>" or plain "<token>"
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
        const decoded = JWT.verify(token, process.env.JWT_SECRATE);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized, JWT token wrong or expired', expired: true });
    }
};

module.exports = ensureAuthenticated;