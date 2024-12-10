const {
  body,
  vailidatorResult,
  validationResult,
} = require("express-validator");
const Course = require("../models/courseModel");
const httpStatusTxt = require("../utils/httpStatusTxt");
const { query } = require("express");
const asyncHandler=require('express-async-handler');
const appError=require('../utils/appErorr')

const getAllCourses = asyncHandler(async (req, res) => {
  //get all courses using model
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip= (page-1)*limit;
  const courses = await Course.find().limit(limit).skip(skip);
  res.json({ status: httpStatusTxt.SUCCESS, data: { courses } });
});

const getSingleCourse =asyncHandler( async (req, res,next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
   const error= appError.create("the Course Not Found",404,httpStatusTxt.FAIL)
   return next(error);
    
  }
  res.json({ status: httpStatusTxt.SUCCESS, data: { course } });
});

const createCourse =asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error=appError.create( errors.array(),400,httpStatusTxt.FAIL);
    return next(error)
    
  }
  const newCourse = new Course(req.body);
  await newCourse.save();
  res
    .status(201)
    .json({ status: httpStatusTxt.SUCCESS, data: { course: newCourse } });
});

const updateCourse =asyncHandler( async (req, res) => {
  const courseId = req.params.courseId;
  
    const updatedCourse = await Course.findByIdAndUpdate(courseId, {  $set: { ...req.body }, });
    res .status(200).json({ status: httpStatusTxt.SUCCESS, data: { course: updatedCourse } });
  });

const deleteCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  await Course.findByIdAndDelete(courseId);
  res.status(200).json({ status: httpStatusTxt.SUCCESS, data: null });
});

module.exports = {
  getAllCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
