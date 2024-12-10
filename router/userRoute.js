const express=require('express')
const router=express.Router();
const userController=require('../controller/userController')
const verfiyToken=require('../middleware/verfayToken')
const multer=require('multer');
const appErorr = require('../utils/appErorr');
const diskStorage=multer.diskStorage({
    destination:function(req,file,cb){
        console.log("FILE",file);
        cb(null,'uploads');
    },
    filename:function(req,file,cb){
        const ext=file.mimetype.split('/')[1];
        const fileName=`user-${Date.now()}.${ext}`
        cb(null,fileName);
    }
})

 const fileFilter=(req,file,cb)=>{
    const imageType=file.mimetype.split('/')[0];

    if(imageType=='image'){
        return cb(null,true)
    }else{
        return(appErorr.create('file must be an image',400),false)
    }
 }
const upload=multer({storage:diskStorage,fileFilter:fileFilter});

//get all users
//register
//login

router.route('/').get(verfiyToken,userController.getAllUsers);
router.route('/register').post(upload.single('avatar'),userController.register);
router.route('/login').post(userController.login)

module.exports=router 