const fs = require('fs');
const path = require('path');

const Course = require('../models/course');
const exam = require('../models/exam');
const Exam = require('../models/exam');
const User = require('../models/user');


exports.getDashBoard = (req, res, next) => {
    req.user.populate('courseList.courseId')
        .execPopulate()
        .then(user => {
            const course = user.courseList.map(i=>{
                return { ...i.courseId._doc };
            });
            res.render('student/dashBoard', {
                title: 'DashBoard',
                courses: course
            })
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getExamList = (req, res, next) => {
    const courseId = req.params.courseId;
    Exam.find({ course: courseId }).then(exams => {
        res.render('student/examList', {
            title: 'Exam List',
            exams: exams
        })
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getGrades = (req, res, next) => {
    User.findById(req.user._id)
    .then(student=>{
        res.render('student/grades', {
            title: 'Grades',
            exams:student.grades
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
    
};

exports.getProfile = (req, res, next) => {
    res.render('student/profile', {
        title: 'Profile'
    })
};

exports.getEditProfile = (req, res, next) => {
    res.render('student/editProfile', {
        title: 'Edit Profile'
    })
};

exports.getExamStart = (req,res,next) => {
    const examId = req.params.examId;
    Exam.findById(examId)
    .then(exam=>{
        res.json({
            questions:exam.questions
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }); 
};

exports.getObjectiveExam = (req, res, next) => {
    const examId = req.params.examId;
    Exam.findById(examId).then(exam => {
        const question = exam.questions;
        res.render('student/objectiveExam', {
            title: 'Objective Examination',
            exam:exam,
            questions:exam.questions
        });
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });    
};

exports.postObjectiveExam = (req,res,next) =>{
    const examId = req.body.examId;
    const examName = req.body.examName;
    const achievedMarks = req.body.marks;
    const totalMarks = req.body.totalMarks;
    const courseId = req.body.courseId;
    const studentId = req.user._id;
    User.findById(studentId).then(student=>{
        student.updatingGrades(examId,examName,achievedMarks,totalMarks);
    }).then(user=>{
        Course.findById(courseId).then(course=>{
           
            course.updatingGradesToCourse(examId,examName,studentId,req.user.userName,achievedMarks,totalMarks);
        })
    }).then(result=>{
        res.redirect('/student/examlist/'+courseId);
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getSubjectiveExam = (req, res, next) => {
    res.render('student/fileUpload', {
        title: 'Subjective Examination'
    })
};

exports.getSubjectiveExamPaper = (req, res, next) => {

    const examName = 'examPaper.pdf';
    const exampath = path.join('data', 'subjective-exam', examName);

    fs.readFile(exampath, (err, data) => {
        if (err) {
            console.log(err);
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            'inline; filename="' + examName + '"'
        );
        res.send(data);
    });
    const file = fs.createReadStream(exampath);

    file.pipe(res);

};

