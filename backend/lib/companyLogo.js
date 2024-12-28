
const multer  = require('multer')
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
     cb(null, path.resolve(__dirname, '../public/images/companyLogos'));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const uploadCompanyLogo = multer({ storage });
  

module.exports = uploadCompanyLogo;
