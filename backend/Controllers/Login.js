const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

const Login = async (req, res) => {
    try {
        const {email, password } = req.body;
    
        const userData = await User.findOne({ email });
       
        const ErrorMSG = "Invalid email or password";
        if (!userData) {
            return res.status(403).json({ message: ErrorMSG, success:false });
        }

        const isPassEqual = await bcrypt.compare(password,userData.password);

        if(!isPassEqual){
            return res.status(403).json({ message: ErrorMSG, success:false });
        }

        const Token = JWT.sign(
            {email:userData.email, _id:userData._id},
            process.env.JWT_SECRATE,
            { expiresIn: '24h' }
        )

        res.status(200).json({
            message: "Login Success",
            success: true,
            Token,
            name: userData.name,
            userID : userData._id,
            userProfile : userData.profileImgURL,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = Login;
