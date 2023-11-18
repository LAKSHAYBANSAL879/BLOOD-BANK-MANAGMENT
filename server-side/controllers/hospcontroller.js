const Hospital=require('../models/hospdet.js')
const emailValidator = require("email-validator");
const JWT=require('jsonwebtoken');
const crypto=require('crypto')
const bcrypt=require('bcrypt')
const emailjs = require('emailjs-com');

const sendWelcomeEmail = (email) => {
  const templateParams = {
      to_email: email,
      
  };

  emailjs.send('service_ewumrwj', 'template_2er001q', templateParams, 'Sx4o6vx7xG2hKlQda')
      .then((response) => {
          console.log('Email sent:', response);
      })
      .catch((error) => {
          console.error('Email sending error:', error);
      });
};

exports.hospitalSignup = async (req, res) => {
    try {
        const { name, email,address,password,website,phone} = req.body;
        if (!name || !email || !password || !website || !phone || !address) {
            throw new Error("All fields are required");
        }

        const validateEmail = emailValidator.validate(email);

        if (!validateEmail) {
            throw new Error("Please enter a valid email address");
        }

       
        const org = await Hospital.create({
            name,
            email,
            password,
       website,
       address,
          phone
        });
        sendWelcomeEmail(email);
       

        res.status(201).json({
            success: true,
            message: "Hospital signup successfully",
            data: {org}
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                message: 'Hospital already registered with this email',
            });
        } else {
            console.log(error);
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
};
exports.hospitalsignin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error("All fields are required");
        }

        const org = await Hospital.findOne({ email }).select('+password');

        if (!org || !(await bcrypt.compare(password, org.password))) {
            throw new Error('Invalid credentials');
        }

      const token = JWT.sign({ orgId: org._id }, process.env.SECRET, {
        expiresIn: "1d",
      });
        res.status(200).json({
            success: true,
            message: "Hospital sign-in successful",
            token,
            org
        });
    } catch (error) {
        if (error.message === 'Invalid credentials') {
            res.status(400).json({
                success: false,
                message: 'Invalid credentials',
            });
        } else if (error.message.includes('duplicate key error')) {
            res.status(400).json({
                success: false,
                message: 'Hospital already registered with this email',
            });
        } else {
            console.log(error);
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
};
exports.getHospitals = async (req, res) => {
  try {
      const org = await Hospital.find({})
      
      res.status(200).json({
          success: true,
          hospital:org
      });
  } catch (error) {
      console.log(error);
      res.status(400).json({
          success: false,
          message: error.message,
      })
  }
}

exports.getHospitalByToken = async (req, res) => {
  try {
     
      const org = await Hospital.findOne({ _id:req.body.orgId });

      if (!org) {
          return res.status(404).json({
              success: false,
              message: 'Hospital not found',
          });
      }

      res.status(200).json({
          success: true,
          message:"User fetched sucessfully",
        org,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          success: false,
          message: 'Internal Server Error',
      });
  }
};

exports.HospitalLogout=(req,res,next) => {
try{
const cookieOption={
expires : new Date(),
httpOnly:true
}
res.cookie("token",null,cookieOption)
res.status(200).json({
success:true,
message:"org logout sucessfully"
})
}
catch(error){
res.status(400).json({
    success: false,
    message: error.message,
})
}
}
exports.HospitalforgotPassword = async (req, res, next) => {
    const email = req.body.email;
  
    // return response with error message If email is undefined
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }
  
    try {
      // retrieve org using given email.
      const org = await Hospital.findOne({
        email
      });
  
      // return response with error message org not found
      if (!org) {
        return res.status(400).json({
          success: false,
          message: "Hospital not found"
        });
      }
  
      // Generate the token with HospitalSchema method getForgotPasswordToken().
      const forgotPasswordToken = org.getForgotPasswordToken();
  
      await org.save();
  
      return res.status(200).json({
        success: true,
        token: forgotPasswordToken
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
  exports.HospitalresetPassword = async (req, res,next) => {
    const {token} = req.params;
    const {password} = req.body;
  
    // return error message if password  is missing
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "new password  is required"
      });
    }
  
  
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");

  
    try {
      const org = await Hospital.findOne({
        forgotPasswordToken:hashToken,
        forgotPasswordExpiryDate:{
          $gt: new Date() // forgotPasswordExpiryDate() less the current date
        }
      });
  
      // return the message if org not found
      if (!org) {
        return res.status(400).json({
          success: false,
          message: "Invalid Token or token is expired"
        });
      }
  
      org.password = password;
      await org.save();
  
      return res.status(200).json({
        success: true,
        message: "successfully reset the password"
      });
    }
     catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  