const multer  = require('multer')
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '../backend/public/resume'));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const uploadresume = multer({ storage });
  
module.exports = uploadresume;
