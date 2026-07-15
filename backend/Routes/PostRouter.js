const router = require('express').Router();
const CreatePost = require('../Controllers/CreatePost')
const ShowPost = require('../Controllers/ShowPost');
const ensureAuthenticated = require('../Middlewares/Auth');
const searchPost = require('../Controllers/searchPost');
const handleApply = require('../Controllers/handleApply');
const appliedUsers = require('../Controllers/appliedUsers');
const viewDetails = require('../Controllers/viewDetails');
const deletePost = require('../Controllers/deletePost');
const updatePost = require('../Controllers/updatePost');
const findPost = require('../Controllers/findPost')

router.post('/create', ensureAuthenticated, CreatePost);
router.get('/showall', ShowPost);
router.get('/searchPost', searchPost);
router.get('/viewdetails', viewDetails);
router.get('/findpost', findPost);
router.get('/apply', handleApply);
router.get('/appliedUsers', appliedUsers);
router.delete('/deletepost', deletePost);
router.put('/updatepost', updatePost);


module.exports = router;
