const mongoose=require('mongoose')
const JWT=require('jsonwebtoken')
const bycrupt=require('bcrypt')
const crypto=require('crypto')
const hospitalSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Hospital Name is required']
    },
address:{
    type:String
},
website:{
    type:String
},
email:{
    type:String,
    required:[true,'email is required'],
    unique :true,
    lowercase:true,
    unique:[true,'hospital is already registred']
},
phone:{
type:Number,
required:[true,'Phone no is required']
},
password:{
    type:String,
    required:[true,'Password is required'],
    minLength:[6,"Min length should be 6"],
    maxLength:[20,"Max length should be 20"],
    select:false

},
forgotPasswordToken:{
    type:String
},
forgotPasswordExpiryDate:{
    type:Date
}
},{
    timestamps:true
});
hospitalSchema.pre('save',async function(next){
if(!this.isModified('password')){
return next();
}
this.password=await bycrupt.hash(this.password,10);
return next();
});
hospitalSchema.methods={
    jwtToken(){
        return JWT.sign(
            {
                id:this._id,email:this.email
            },
            process.env.SECRET,
            {expiresIn:'48h'}
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
        this.forgotPasswordExpiryDate = Date.now() + 60 * 60 * 1000; // 60min
    
        //step 2 - return values to user
        return forgotToken;
      }
    };

    module.exports=mongoose.model("Hospital",hospitalSchema);