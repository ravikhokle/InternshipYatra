const ContactUs = require('../Controllers/ContactUs');

const router = require('express').Router();

router.post('/send', ContactUs);

module.exports = router;
