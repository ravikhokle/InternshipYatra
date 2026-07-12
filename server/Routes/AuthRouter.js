const SignUp = require('../Controllers/SignUp');
const Login = require('../Controllers/Login');
const RefreshToken = require('../Controllers/RefreshToken');
const Logout = require('../Controllers/Logout');
const { SignUpValidation, LoginValidation } = require('../Middlewares/AuthValidation');
const upload = require('../lib/multer');

const router = require('express').Router();

router.post('/login', LoginValidation, Login);
router.post('/signup', upload.single("profileImage"), SignUpValidation, SignUp);
router.post('/refresh', RefreshToken);   // issue new accessToken using refreshToken cookie
router.post('/logout', Logout);          // clear refreshToken from DB + cookie

module.exports = router;