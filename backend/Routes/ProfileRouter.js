const router = require('express').Router();
const userProfile = require('../Controllers/userProfile')
const ensureAuthenticated = require('../Middlewares/Auth');
const updateProfile = require('../Controllers/UpdateProfile');
const updateResume = require('../Controllers/updateResume');
const updateProfileImg = require('../Controllers/updateProfileImg');
const updateCompanyLogo = require('../Controllers/updateCompanyLogo')
const uploadCompanyLogo = require('../lib/companyLogo')
const uploadresume = require('../lib/resume');
const upload = require('../lib/multer'); // for profileImg
const userPosts = require('../Controllers/userPosts');
const userApplications = require('../Controllers/userApplications');
const publicProfile = require('../Controllers/publicProfile');
const checkUsername = require('../Controllers/checkUsername');
const deleteAccount = require('../Controllers/DeleteAccount');
const viewResume = require('../Controllers/viewResume');

router.get('/', ensureAuthenticated, userProfile);
router.get('/resume/:userId', ensureAuthenticated, viewResume);
router.put('/updateProfile', updateProfile); // for all text fields.
router.put('/updateProfileImg', upload.single("profileImage"), updateProfileImg);
router.put('/updateResume', uploadresume.single("resume"), updateResume);
router.put('/updateCompanyLogo', uploadCompanyLogo.single("companyLogo"), updateCompanyLogo);
router.get('/userPosts', userPosts);
router.get('/userApplications', ensureAuthenticated, userApplications);
router.get('/publicProfile', publicProfile);
router.get('/checkUsername', ensureAuthenticated, checkUsername);
router.delete('/delete-account', ensureAuthenticated, deleteAccount);

module.exports = router;
