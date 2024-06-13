const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

//auth
exports.auth = async (req, res, next) => {
    try{
        //extract token
        const token =
			req.cookies.token ||
			req.body.token ||
			req.header("Authorization").replace("Bearer ", "");

        //if token missing, then return response
        if(!token){
            return res.status(401).json({
                success: false,
                message: `Token is missing`,
            });
        }

        //verify token
        try{
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;

        }catch(error){
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            });
        }
        next();
    }catch(error){
        return res.status(500).json({
            success: false,
            message: `Something went wrong while validating the token`,
        });
    }
};

//isStudent
exports.isStudent = async (req, res, next) => {
    try{
        const userDetails = await User.findOne({ email: req.user.email });
        if(userDetails.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Students only",
            });
        }
        next();

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, Please try again",
        });
    }
}

//instructor
exports.isInstructor = async (req, res, next) => {
    try{
        const userDetails = await User.findOne({ email: req.user.email });
        console.log(userDetails);

		console.log(userDetails.accountType);
        if(userDetails.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Instructor only",
            });
        }
        next();

    }catch(error){
        return res.status(500).json({
            success: false,
            message: `User role cannot be verified, Please try again`
        });
    }
}

//admin
exports.isAdmin = async (req, res, next) => {
    try{
        const userDetails = await User.findOne({ email: req.user.email });

        if(userDetails.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admin only",
            });
        }
        next();

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, Please try again",
        });
    }
}