require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin','student','faculty'],
        required:true
    },
});

userSchema.pre('save',async function(next){
    try {
        const isModified = this.isModified('password');
        if(!isModified){
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    } catch (error) {
        next(error);
    }
    
}
);

userSchema.methods.generateToken=function(){
    try {
        return jwt.sign(
            {
                userId:this._id.toString(),
                name:this.name,
                email:this.email,
                password:this.password,
                role:this.role
            },
            process.env.JWT_SECRET,
            {expiresIn:'30d'}
        );
    } catch (error) {
        console.log(error);
    }
};

const User = new mongoose.model('User',userSchema);

module.exports = User;