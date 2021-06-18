const Course = require('../models/course');
const Exam = require('../models/exam');

exports.getDashBoard = (req, res, next) => {
    Course.find({ managedBy: req.user.userName })
        .then(courses => {
            res.render('teacher/dashboard', {
                title: 'DashBoard',
                courses: courses
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getExamList = (req,res,next) => {
    const courseId = req.params.courseId;
    Exam.find({ course : courseId })
    .then(exam=>{
        res.render('teacher/examList', {
            title: 'Exam List',
            exams:exam
        })
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getCreateExamination = (req, res, next) => {
    Course.find({ managedBy: req.user.userName })
        .then(courses => {
            res.render('teacher/createExamination', {
                title: 'Create Examination',
                courses: courses
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postCreateExamination = (req, res, next) => {
    const examName = req.body.examname;
    const courseName = req.body.coursename;
    const examType = req.body.examtype;
    const examDate = req.body.date;
    const examStartingTime = req.body.startingtime;
    const examEndingTime = req.body.endingtime;
    Course.findOne({ courseName: courseName }).then(course => {
        const exam = new Exam({
            examName: examName,
            course: course,
            examDate: examDate,
            examType: examType,
            questionPaperFilePath: '',
        })
        return exam.save();
    }).then(result => {
        let exam = encodeURIComponent(result._id);
        console.log(exam);
        if(examType == 'subjective') {
            res.redirect('/teacher/subjectiveexaminationupload/?exam='+exam);
        } else {
            res.redirect('/teacher/objectiveexaminationupload/?exam='+exam);
        }
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};


exports.getReport = (req, res, next) => {
    Course.find({ managedBy :req.user.userName})
    .then(course=>{
        res.render('teacher/report', {
            title: 'Report',
            courses: course
        })
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getReportDetail = (req,res,next)=>{
    const courseId = req.params.courseId;
    Course.findById(courseId)
    .then(course=>{
        res.render('teacher/reportDetail', {
            title: 'report',
            grades:course.grades
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getSubjectiveExaminationUpload = (req, res, next) => {
    Exam.find().then(exam => {
        res.render('teacher/subjectiveExaminationUpload', {
            title: 'Upload Subjective Exam',
            exam: exam
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postSubjectiveExaminationUpload = (req, res, next) => {
    const examId = req.body.exam;
    const subjectiveQuestionPaper = req.subjectivequestionpaper;
    const instruction = req.body.instruction;

    console.log("reached postsubjective exam");


    // Exam.find({ _id:exam._id })
    // .then(exam=>{
    //     // console.log(exam[0]);
    //     return exam.fileUpload(subjectiveQuestionPaper,instruction);
    // }).then(result=>{
    //     console.log(result);
    // })
    // .catch(err=>console.log(err));
}


exports.getObjectiveExaminationUpload = (req, res, next) => {
    const exam= req.query.exam;
    // console.log("reached get objective",exam);
    Exam.find({_id:exam}).then(exam => {
        // console.log("exam:___",exam);
        res.render('teacher/objectiveExamUpload', {
            title: 'Upload Objective Exam',
            exam: exam[0]
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postObjectiveExaminationUpload =(req,res,next) => {
    const examId = req.body.examId;
    const question = req.body.question;
    const option1 = req.body.option1;
    const option2 = req.body.option2;
    const option3 = req.body.option3;
    const option4 = req.body.option4;
    const answer = req.body.answer;
    // console.log(examId);
    Exam.findById(examId)
    .then(exam=>{
        exam.addQuestion(question,option1,option2,option3,option4,answer)
    }).then(result=>{
        let exam = encodeURIComponent(examId); 
        res.redirect('/teacher/objectiveexaminationupload/?exam='+exam);
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.deleteExam = (req,res,next) =>{
    const examId = req.body.examId;
    const courseId = req.body.courseId;
    Exam.findByIdAndRemove({ _id : examId })
    .then(result=>{
        res.redirect('/teacher/dashboard');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

