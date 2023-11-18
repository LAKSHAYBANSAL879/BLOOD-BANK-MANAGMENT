const express = require("express");
const authRouter = express.Router();
const emailjs = require('emailjs-com');


emailjs.init('Sx4o6vx7xG2hKlQda');

const cookieParser = require('cookie-parser');
const JWT=require('jsonwebtoken');
const crypto=require('crypto')
const jwtAuth = require('../middleware/jwtAuth.js'); 
const jwtAuthHosp = require('../middleware/jwtAuthHosp.js');
const {
  signup,
  signin,
  getuser,
  userLogout,
  forgotPassword,
  resetPassword
} = require("../controllers/authController.js");

const {
  hospitalSignup,
  hospitalsignin,
  getHospitals,
  getHospitalByToken,
  HospitalLogout,
HospitalforgotPassword,
HospitalresetPassword
} = require("../controllers/hospcontroller.js");
authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.get('/getuser',jwtAuth,getuser);
authRouter.get('/logout', jwtAuth, userLogout);
authRouter.post('/forgotpassword', forgotPassword);
authRouter.post('/resetpassword/:token', resetPassword);
authRouter.post('/hospitalsignup', hospitalSignup);
authRouter.post('/hospitalsignin', hospitalsignin);
authRouter.get('/getHospitals',getHospitals);
authRouter.get('/gethospbytoken',jwtAuthHosp,getHospitalByToken);
authRouter.get('/hospitallogout', jwtAuthHosp, HospitalLogout);
authRouter.post('/hospitalforgotpassword', HospitalforgotPassword);
authRouter.post('/hospitalresetpassword/:token', HospitalresetPassword);

module.exports = authRouter;
