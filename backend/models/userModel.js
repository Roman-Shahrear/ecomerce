const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[true, "Please Enter your Name"],
        maxLength:[30, "Name can not exceed 30 characters"],
        minLength:[4, "Name should have more than 4 characters"] 
    },
    email: {
        type: String,
        required:[true, "Please Enter your Email"],
        unique: true,
        validate:[validator.isEmail, "Please Enter a valid Email"]
    },
    password: {
        type: String,
        required:[true, "Please Enter your Password"],
        minLength:[8, "Password should be greather then 8 character"],
        select: false
    },
    avatar: {
        public_id: {
            type:String,
            required:true
        },
        url: {
            type:String,
            required:true
        }
    },
    role: {
        type: String,
        default: "user"
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date
});

userSchema.pre("save", async function(next){

    if(!this.isModified("password")){
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
});


//JWT Token
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Compare Password
userSchema.methods.comparePassword = async function(enterdPassword){
    return await bcrypt.compare(enterdPassword, this.password)
}

//Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function(){

    //Generate Token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Hash and adding ResetPassword Token to userSchema
    this.resetPasswordToken = crypto.createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
    //For Expires mentioning Generate Reset Password token
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model("User", userSchema);