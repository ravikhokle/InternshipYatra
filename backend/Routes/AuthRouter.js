const SignUp = require('../Controllers/SignUp');
const Login = require('../Controllers/Login');
const RefreshToken = require('../Controllers/RefreshToken');
const Logout = require('../Controllers/Logout');
const ForgotPassword = require('../Controllers/ForgotPassword');
const VerifyOTP = require('../Controllers/VerifyOTP');
const ResetPassword = require('../Controllers/ResetPassword');
const GoogleAuth = require('../Controllers/GoogleAuth');
const SendSignupOTP = require('../Controllers/SendSignupOTP');
const VerifySignupOTP = require('../Controllers/VerifySignupOTP');
const ResendSignupOTP = require('../Controllers/ResendSignupOTP');
const { SignUpValidation, LoginValidation, SendSignupOTPValidation, VerifySignupOTPValidation } = require('../Middlewares/AuthValidation');
const upload = require('../lib/multer');

const router = require('express').Router();

router.post('/login', LoginValidation, Login);
router.post('/signup', upload.single("profileImage"), SignUpValidation, SignUp);
router.post('/send-signup-otp', SendSignupOTPValidation, SendSignupOTP);
router.post('/verify-signup-otp', VerifySignupOTPValidation, VerifySignupOTP);
router.post('/resend-signup-otp', ResendSignupOTP);
router.post('/refresh', RefreshToken);
router.post('/logout', Logout);
router.post('/forgot-password', ForgotPassword);
router.post('/verify-otp', VerifyOTP);
router.post('/reset-password', ResetPassword);
router.post('/google', GoogleAuth);

module.exports = router;