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
const publicProfile = require('../Controllers/publicProfile');

router.get('/', ensureAuthenticated, userProfile);
router.put('/updateProfile', updateProfile); // for all text fields.
router.put('/updateProfileImg', upload.single("profileImage"), updateProfileImg);
router.put('/updateResume', uploadresume.single("resume"), updateResume);
router.put('/updateCompanyLogo', uploadCompanyLogo.single("companyLogo"), updateCompanyLogo);
router.get('/userPosts', userPosts);
router.get('/publicProfile', publicProfile);

module.exports = router;
