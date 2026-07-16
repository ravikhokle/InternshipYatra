const mongoose = require('mongoose');
const URI = process.env.URI;
const { backfillPostSlugs } = require('../lib/slug');
const { backfillUsernames } = require('../lib/username');

const DBConnect = async () =>{
    try {
        await mongoose.connect(URI);
        console.log("Conneted to database");
        await backfillPostSlugs();
        await backfillUsernames();
    } catch (error) {
        console.log("Connetion Problem:", error.message);
    }
}

module.exports = DBConnect;