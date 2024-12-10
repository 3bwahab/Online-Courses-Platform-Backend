const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const httpStatusTxt = require("../utils/httpStatusTxt");
const appError = require("../utils/appErorr");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generatejwt = require("../utils/generatejwt");
const userRoles = require("../utils/userRoles");
//const { query } = require("express");
const getAllUsers = asyncHandler(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  res.json({ status: httpStatusTxt.SUCCESS, data: { users } });
});
const register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    const error = appError.create(
      "user already exist",
      400,
      httpStatusTxt.FAIL
    );
    return next(error);
  }
  // if we pass that the user is the first time register so we will hashing the password
  const hashedPassword = await bcrypt.hash(password, 8);
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.fieldname,
  });
  //generate JWT token
  const token = await generatejwt({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;

  await newUser.save();
  res.status(201).json({ status: httpStatusTxt.SUCCESS, data: { newUser } });
});
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && !password) {
    const error = appError.create(
      "email and password are required",
      400,
      httpStatusTxt.FAIL
    );
    return next(error);
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    const error = appError.create("user not found", 400, httpStatusTxt.FAIL);
    return next(error);
  }
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (user && matchedPassword) {
    //loged in successfully
    const token = await generatejwt({
      email: user.email,
      id: user._id,
      role: user.role,
    });

    return res.json({ status: httpStatusTxt.SUCCESS, data: { token } });
  } else {
    const error = appError.create("somthing wrong", 400, httpStatusTxt.ERORR);
    return next(error);
  }
});
module.exports = {
  getAllUsers,
  register,
  login,
};
