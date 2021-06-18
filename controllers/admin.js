const User = require('../models/user');
const Course = require('../models/course');
const course = require('../models/course');


exports.getDashBoard = (req, res, next) => {
    Course.find({ creatorName: req.user.userName })
        .then(course => {
            res.render('admin/dashBoard', {
                title: 'DashBoard',
                courses: course
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getCreateCourse = (req, res, next) => {
    User.find({ userType: 'teacher' }).then(teacher => {
        res.render('admin/createCourse', {
            title: 'Create Course',
            creatorName: req.user,
            teachers: teacher
        })
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postCreateCourse = (req, res, next) => {
    const courseName = req.body.courseName;
    const creatorName = req.body.creatorName;
    const courseDescription = req.body.description;
    const managedBy = req.body.managedBy;
    const course = new Course({
        courseName: courseName,
        creatorName: req.user.userName,
        courseDescription: courseDescription,
        managedBy: managedBy
    });
    return course.save().then(result => {
        res.redirect('/admin/dashboard');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });

}

exports.getStudentList = (req, res, next) => {
    User.find({ userType: 'student' })
        .then(students => {
            res.render('admin/studentList', {
                title: 'Student List',
                students: students
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getAllotCourse = (req, res, next) => {
    const studentId = req.params.studentId; 
    User.find({ _id:studentId ,userType: 'student' })
        .then(student => {
             return Course.find({ creatorName: req.user.userName })
                .then(courses => {
                    res.render('admin/allotCourse', {
                        title: 'Allot Course',
                        student: student[0] ,
                        courses: courses
                    });
                });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postAllotCourse = (req, res, next) => {
    const studentName = req.body.studentName;
    const studentEmail = req.body.studentEmail;
    const courseName = req.body.courseName;
    let user;
    User.findOne({ userName: studentName, email: studentEmail })
        .then(foundUser => {

            user = foundUser
            return Course.findOne({ courseName: courseName });

        }).then(course => {
            return course.addStudentToCourse(user);
        }).then(course => {
            user.addCourseTostudent(course);
        }).then(result => {
            res.redirect('/admin/dashboard');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};


exports.deleteCourse = (req, res, next) => {
    const courseId = req.body.courseId;
    Course.findByIdAndRemove({ _id: courseId })
        .then(course => {
            return User.find({ _id : course.studentList.students.studentId });
        }).then(student=>{
            
            res.redirect('/admin/dashboard');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getCourseDetail = (req, res, next) => {
    const courseId = req.params.courseId;
    Course.findById(courseId)
    .then(course=>{
        res.render('admin/courseDetails', {
            title: 'Course Details',
            course: course,
            students:course.studentList.students
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};
