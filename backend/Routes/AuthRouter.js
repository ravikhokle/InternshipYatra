const SignUp = require('../Controllers/SignUp');
const Login = require('../Controllers/Login');
const { SignUpValidation, LoginValidation } = require('../Middlewares/AuthValidation');
const upload = require('../lib/multer');

const router = require('express').Router();

router.post('/login', LoginValidation, Login);

router.post('/signup', upload.single("profileImage"), SignUpValidation, SignUp);

module.exports = router;