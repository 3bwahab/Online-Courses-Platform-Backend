const express=require('express');
const router=express.Router();
const controller=require('../controller/controller');
const verfayToken=require('../middleware/verfayToken');
const {body,vailidatorResult, validationResult}=require('express-validator');
const userRoles = require('../utils/userRoles');
const allowedTo=require("../middleware/allowedTo");



router.get('/',controller.getAllCourses)

// app.get('/api/courses/1',(req,res)=>{
//     const course=courses.find((courses)=>courses.id==1);
//     res.json(course); 
// })
//we will make the upove route using dynamic route


//get singel course
router.get('/:courseId',controller.getSingleCourse)


//create a courese

router.post('/',verfayToken,controller.createCourse)

//update exited course you can use put or patch but the differece between them is put exchange the old object with the new but the patch update the element you want to update
router.patch('/:courseId',controller.updateCourse)


//delete a course
router.delete('/:courseId',verfayToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),controller.deleteCourse)


module.exports=router