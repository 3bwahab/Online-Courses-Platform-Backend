const jwt=require('jsonwebtoken');
const verfiyToken=(req,res,next)=>{
    const authHeader=req.headers['Authorization'] || req.headers['authorization'];
    if(!authHeader){
        res.status(401).json('token is required');
    }
    const token=authHeader.split(" ")[1];
    const currentUser=jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.currentUser=currentUser;
    next();
}
module.exports=verfiyToken