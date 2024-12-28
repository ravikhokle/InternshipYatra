const mongoose = require('mongoose');
const URI = process.env.URI;

const DBConnect = async () =>{
    try {
        await mongoose.connect(URI);
        console.log("Conneted to database");
    } catch (error) {
        console.log("Connetion Problem:", error.message);
    }
}

module.exports = DBConnect;