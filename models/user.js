const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required:true
    },
    courseList:[{
        courseId:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:'Course'
        }
    }],
    grades:[{
        examId: {
            type:Schema.Types.ObjectId,
            required:true,
            ref:'Exam'
        },
        examName:String,
        achievedMarks:Number,
        totalMarks:Number
    }],
    resetToken: String,
    resetTokenExpiration: Date,
});

userSchema.methods.addCourseTostudent=function(course) {

    const courseList=this.courseList;
    courseList.push({courseId:course._id});
    return this.save();
};

userSchema.methods.updatingGrades=function(examId,examName,marks,totalMarks) {

    const grades=this.grades;
    grades.push({examId:examId,examName:examName,achievedMarks:marks,totalMarks:totalMarks});
    return this.save();
};


userSchema.methods.removeCourseFromStudent=function(CourseId) {
    const updatedCourseList = this.courseList.filter(courseId => {
            return courseId.toString() !== CourseId.toString();
        })
        this.courseList=updatedCourseList;
        return this.save();

};

module.exports = mongoose.model('User', userSchema);