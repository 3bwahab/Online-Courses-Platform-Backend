require("dotenv").config();
const cors = require("cors");
const path=require('path');
const express = require("express");
const app = express();
app.use('/uploads', express.static(path.join(__dirname,'uploads')))
const mongoose = require("mongoose");
const url = process.env.MONGO_URL;
const httpStatusTxt = require("./utils/httpStatusTxt");
const courseRouter = require('./router/router');
const userRouter=require('./router/userRoute');
mongoose.connect(url).then(() => {
  console.log("successful conected to database...");
});
app.use(cors());
app.use(express.json());
//we will make simpla api that respons for api

//get all courses


app.use("/api/course", courseRouter);
app.use('/api/user',userRouter)
//global meddleWare for not found routs
app.all("*", (req, res, next) => {
  return res
    .status(400)
    .json({
      status: httpStatusTxt.ERORR,
      message: "this source is not avilable",
    });
});
//global erorr handler
app.use((error,req,res,next)=>{
  res.status(error.statusCode || 500).json({status:httpStatusTxt.ERORR,message:error.message});
})

app.listen(process.env.PORT, () => {
  console.log("server is running on port 5000");
});
