const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacher');
const isAuth = require('../middleware/isAuth');

router.get('/dashboard',isAuth,teacherController.getDashBoard);

router.get('/report',isAuth, teacherController.getReport);

router.get('/report/:courseId',isAuth, teacherController.getReportDetail);

router.post('/examlist/delete',teacherController.deleteExam);

router.get('/examlist/:courseId',isAuth,teacherController.getExamList);

router.get('/createexamination',isAuth,teacherController.getCreateExamination);

router.post('/createexamination',teacherController.postCreateExamination);

router.get('/subjectiveexaminationupload',isAuth,teacherController.getSubjectiveExaminationUpload);

router.post('/subjectiveexaminationupload',teacherController.postSubjectiveExaminationUpload);

router.get('/objectiveexaminationupload',isAuth,teacherController.getObjectiveExaminationUpload);

router.post('/objectiveexaminationupload',teacherController.postObjectiveExaminationUpload);


// router.post('/editprofile',studentController.postEditProfile);


module.exports=router;
