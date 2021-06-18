const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseName: {
        type: String,
        require: true
    },
    courseDescription: {
        type: String,
        require: true
    },
    creatorName:{
        // type:Schema.Types.ObjectId,
        // ref:'User',
        type: String,
        require: true
    },
    managedBy:{
        type: String,
        // ref:'User',
        require: true
    },
    studentList:{
        students:[
            {
                studentId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                name:{
                    type: String,
                    required:true
                },
                email: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    grades:[{
        examId:{
            type:Schema.Types.ObjectId,
            ref:'Exam',
            required:true
        },
        examName:{
            type: String,
            required:true
        },
        studentId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        studentName:{
            type: String,
            required:true
        },
        achievedMarks:Number,
        totalMarks:Number
    }]    
});

courseSchema.methods.addStudentToCourse=function(student) {
    
    const studentList=this.studentList.students;
    studentList.push({ studentId:student._id,name:student.userName,email:student.email });
    return this.save();
};


courseSchema.methods.updatingGradesToCourse=function(examId,examName,studentId,studentName,achievedMarks,totalMarks) {
    
    const grades=this.grades;
    grades.push({examId:examId,examName:examName,studentId:studentId,studentName:studentName,achievedMarks:achievedMarks,totalMarks:totalMarks});
    return this.save();
};

module.exports = mongoose.model('Course', courseSchema);