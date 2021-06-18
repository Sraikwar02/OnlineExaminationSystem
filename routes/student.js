const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student');
const isAuth = require('../middleware/isAuth');
const path=require('path');

router.get('/dashboard',isAuth, studentController.getDashBoard);

router.get('/grades',isAuth , studentController.getGrades);

router.get('/profile',isAuth, studentController.getProfile);

router.get('/editprofile',isAuth, studentController.getEditProfile);

router.get('/exam/:examId',isAuth, studentController.getObjectiveExam);

router.get('/exam/questions/:examId',isAuth, studentController.getExamStart);

router.post('/exam/objective',isAuth, studentController.postObjectiveExam);

router.get('/subjectiveexam',isAuth, studentController.getSubjectiveExam);

router.get('/examlist/:courseId',isAuth, studentController.getExamList);

router.get('/course/subjectivepaperdownload',studentController.getSubjectiveExamPaper);


module.exports=router;
