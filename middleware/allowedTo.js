const appErorr = require("../utils/appErorr");

module.exports=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.currentUser.role)){
            return next(appErorr.create("this role is not authorized ",401))
        }
        next();
    }
}