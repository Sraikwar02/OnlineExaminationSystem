const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');
const path=require('path');

router.get('/dashboard',isAuth, adminController.getDashBoard);

router.get('/createcourse',isAuth, adminController.getCreateCourse);

router.post('/createcourse',isAuth, adminController.postCreateCourse);

router.post('/course/delete',adminController.deleteCourse);

router.get('/course/:courseId',adminController.getCourseDetail);

router.get('/studentlist',isAuth, adminController.getStudentList);

router.get('/allotcourse/:studentId',isAuth, adminController.getAllotCourse);

router.post('/allotcourse',isAuth,adminController.postAllotCourse);

// router.get('/editprofile',isAuth, studentController.getEditProfile);



module.exports=router;
