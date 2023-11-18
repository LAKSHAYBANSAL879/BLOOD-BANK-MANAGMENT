const mongoose = require("mongoose");
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')
const userSchema = new mongoose.Schema(
  {
   
    name: {
      type: String,
      required:[true,"name is required"] 
    },
    
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is requied"],
    },
   
    address: {
      type: String,
      required:[true,"address is required"] 
    },
    phone: {
      type: String,
      required: [true, "phone numbe is required"],
    },
    gender:{
      type:String,

      enum:["male","female"],
      
    },
    forgotPasswordToken:{
      type:String
  },
  forgotPasswordExpiryDate:{
      type:Date
  }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {

  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});


userSchema.methods={
  jwtToken(){
      return jwt.sign(
          {
              id:this._id,email:this.email
          },
          process.env.SECRET,
          {expiresIn:'96h'}
      );
  },
  getForgotPasswordToken() {
      const forgotToken = crypto.randomBytes(20).toString('hex');
      //step 1 - save to DB
      this.forgotPasswordToken = crypto
        .createHash('sha256')
        .update(forgotToken)
        .digest('hex');
  
      /// forgot password expiry date
      this.forgotPasswordExpiryDate = Date.now() + 120 * 60 * 1000; 
  
      //step 2 - return values to user
      return forgotToken;
    }
  };

module.exports=mongoose.model("User",userSchema);
