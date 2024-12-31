const router = require('express').Router();
const CreatePost = require('../Controllers/CreatePost')
const ShowPost = require('../Controllers/ShowPost');
const ensureAuthenticated = require('../Middlewares/Auth');
const searchPost = require('../Controllers/searchPost');
const handleApply = require('../Controllers/handleApply');
const appliedUsers = require('../Controllers/appliedUsers');
const viewDetails = require('../Controllers/viewDetails');

router.post('/create', ensureAuthenticated, CreatePost);
router.get('/showall', ShowPost);
router.get('/searchPost', searchPost);
router.get('/viewdetails', viewDetails);
router.get('/apply', handleApply);
router.get('/appliedUsers', appliedUsers);


module.exports = router;
