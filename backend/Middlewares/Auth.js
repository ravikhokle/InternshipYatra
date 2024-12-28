const JWT = require('jsonwebtoken');
const ensureAuthenticated = ( req, res, next) =>{

    const auth = req.headers['authorization'];
    if(!auth){
        return res.status(401)
        .json({message:'UnAthorized, JWT token is required'});
    }

    try {
        const decoded = JWT.verify(auth, process.env.JWT_SECRATE);
        req.user = decoded;
    } catch (error) {
        return res.status(401)
        .json({message:'UnAuthorized, JWT token wrong or expired'});
    }
    next();
}

module.exports = ensureAuthenticated;