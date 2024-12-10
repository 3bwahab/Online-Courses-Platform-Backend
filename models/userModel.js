const mongoose=require('mongoose');
const validator=require('validator');
const userRoles=require('../utils/userRoles');
const { use } = require('../router/router');

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail,"the field must be a valid email"]
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String
    },
    role:{
        type:String,
        enum :[userRoles.ADMIN,userRoles.USER,userRoles.MANAGER],
        default:userRoles.USER

    },
    avatar:{
        type:String,
        default:"uploads/Avatar2.png"

    }
});

module.exports=mongoose.model("User",userSchema);