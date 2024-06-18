const OTP = require("../models/OTP");
const User = require("../models/User");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const { passwordUpdated } = require("../mail/passwordUpdate")
require('dotenv').config();
const mailSender = require("../utils/mailSender");

//signup 
exports.signup = async (req, res) => {
    try{
        //data fetch from request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        //validation
        if(!firstName || !lastName || !email || contactNumber || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success: false,
                message: "All Fields are required",
            }); 
        }

        //password confirmation
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password And Confirm Password must be same",
            });
        }

        //check user already exist
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User is already registered",
            });
        }

        //find most recent otp stored in db
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log("recent OTP: ",recentOtp);

        //validate otp 
        if(recentOtp.length === 0){
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
        }else if(otp !== recentOtp[0].otp){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password,10);

        // Create the user
        let approved = "";
        approved === "Instructor" ? (approved = false) : (approved = true);

        //entry create in db
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
            
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails:profileDetails._id,
            image:`http://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
            
        })

        //return res
        return res.status(200).json({
            success: true,
            user,
            message: "User is registered Successfully",
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again",
        });
    }
}

//login
exports.login = async (req, res) => {
    try{
        //get data from request body
        const {email, password} = req.body;

        //validate data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:'All fields are required',
            });
        }

        //user check exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:'User is not registered, Please Sign up',
            });
        }

        //generate jwt, after password matching
        if(await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                role: user.role,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"24h",
            });
            user.token = token;
            user.password = undefined;

            //create cookie and response
            const options = {
                expires : new Date(Date.now() + 3*24*60*60*100),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message: 'Logged in Successfully'
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:'Password is incorrect',
            });
        }

        
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure, Please try again',
        });
    }
}

//send otp
exports.sendotp = async (req, res) => {
    try{
        //fetch email from request body
        const {email} = req.body;

        //check if a user is already exist
        const checkUserPresent = await User.findOne({email});

        //if a user alredy exist. then return a response
        if(checkUserPresent){
            return res.status(401).json({
                success: false,
                message: 'User already registered',
            });
        }

        //generate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP: ", otp);

        const result = await OTP.findOne({otp: otp});
        console.log("Result is Generate OTP Func")
        console.log("OTP", otp)
        console.log("Result", result)
        while(result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
            });
        }

        const otpPayload = {email, otp};
        //create an entry in db for otp
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            success: true,
            message: 'OTP Sent Successfully',
            otp,
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
    

}

//changepassword
exports.changePassword = async (req, res) => {
    try {
      // Get user data from req.user
      const userDetails = await User.findById(req.user.id)
  
      // Get old password, new password, and confirm new password from req.body
      const { oldPassword, newPassword } = req.body
  
      // Validate old password
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        userDetails.password
      )
      if (!isPasswordMatch) {
        // If old password does not match, return a 401 (Unauthorized) error
        return res
          .status(401)
          .json({ success: false, message: "The password is incorrect" })
      }
  
      // Update password
      const encryptedPassword = await bcrypt.hash(newPassword, 10)
      const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
      )
  
      // Send notification email
      try {
        const emailResponse = await mailSender(
          updatedUserDetails.email,
          "Password for your account has been updated",
          passwordUpdated(
            updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
          )
        )
        console.log("Email sent successfully:", emailResponse.response)
      } catch (error) {
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while sending email:", error)
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error: error.message,
        })
      }
  
      // Return success response
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" })
    } catch (error) {
      // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while updating password:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      })
    }
}