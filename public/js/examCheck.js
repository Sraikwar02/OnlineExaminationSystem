// select all elements
const start = document.getElementById("start");
const quiz = document.getElementById("quiz");
const question = document.getElementById("question");
const choiceA = document.getElementById("A");
const choiceB = document.getElementById("B");
const choiceC = document.getElementById("C");
const choiceD = document.getElementById("D");
const counter = document.getElementById("counter");
const examSubmit = document.getElementById("examSubmit");
const examId = document.querySelector('[name=examId]').value;

let runningQuestion = 0;
let score = 0;
let Questions;

console.log(quiz);

const startExam = async (btn) => {
    console.log("running");
    const examId = btn.parentNode.querySelector('[name=examId]').value;
    try {
        const questions = await fetch('/student/exam/questions/' + examId, {
            method: 'Get',
        })
            .then(result => {
                return result.json();
            }).then(data => {
                return data;
            }).then(questions => {
                return questions.questions;
            })
        Questions = questions;
        start.style.display = "none";
        await renderQuestion()
        quiz.style.display = "block";
        // TIMER = setInterval(renderCounter,1000); // 1000ms = 1s

    }
    catch (err) {
        console.log(err);
    }


};

function renderQuestion() {
    let q = Questions[runningQuestion];
    question.innerHTML = "<p>" + q.question + "</p>";
    choiceA.innerHTML = q.option1;
    choiceB.innerHTML = q.option2;
    choiceC.innerHTML = q.option3;
    choiceD.innerHTML = q.option4;
}

function checkAnswer(ans) {
    if (ans == Questions[runningQuestion].answer) {
        // answer is correct
        score++;
        // change progress color to green
        answerIsCorrect();
    } else {
        // answer is wrong
        // change progress color to red
        answerIsWrong();
    }
    let lastQuestion = Questions.length-1;
    count = 0;
    if (runningQuestion < lastQuestion) {
        runningQuestion++;
        renderQuestion();
    } else {
        // end the quiz and show the score
        // clearInterval(TIMER);
        renderForm();
        // scoreRender();
    }
}

function answerIsCorrect() {
    // document.getElementById(runningQuestion).style.backgroundColor = "#0f0";
}

// answer is Wrong
function answerIsWrong() {
    console.log("wrong option");
    // document.getElementById(runningQuestion).style.backgroundColor = "#f00";
}



// score render
function scoreRender(){
    scoreDiv.style.display = "block";
    
    // calculate the amount of question percent answered by the user
    const scorePerCent = Math.round(100 * score/Questions.length);
    
    scoreDiv.innerHTML += "<p>"+ scorePerCent +"%</p>";
}

function renderForm() {
    examSubmit.style.display = "block";
    document.forms['examSubmit']['marks'].value = score;
}

