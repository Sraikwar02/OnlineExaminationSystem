const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const examSchema = new Schema({

    examName: {
        type: String,
        required: true
    },
    course: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Course'
    }],
    examDate: {
        type: Date,
        required: true
    },
    examType: {
        type: String,
        required: true,
        default:'objective'
    },
    questions: [{
            question: {
                type: String,
                required: true
            },
            option1: { 
                type: String,
                required: true 
            },
            option2: { 
                type: String,
                required: true 
            },
            option3: { 
                type: String,
                required: true 
            },
            option4: { 
                type: String,
                required: true 
            },
            answer:{
                type:String,
                required:true
            }
        }],
});

examSchema.methods.addQuestion = function(question,option1,option2,option3,option4,answer) {
    
    const questions=this.questions;
    questions.push({ 
        question:question,
        option1:option1,
        option2:option2,
        option3:option3,
        option4:option4,
        answer:answer
    });
    return this.save();
};

module.exports = mongoose.model('Exam', examSchema);