const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    option_a: { type: String, required: true },
    option_b: { type: String, required: true },
    option_c: { type: String, required: true },
    option_d: { type: String, required: true },
    correct: { type: String, required: true },
});

const QuizSchema = new mongoose.Schema({
    quizId: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    createdBy: { type: String, required: true },  // Added field to store creator's email
    duration: { type: Number, required: true },
    nquestions: { type: Number, required: true },
    isActive: { type: Boolean, default: false },
    questions: [QuestionSchema],
});

const Quiz = new mongoose.model("Quiz", QuizSchema);
module.exports = Quiz;
