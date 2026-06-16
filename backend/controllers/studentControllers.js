const Quiz = require('../models/Quiz');
const Result = require('../models/Result');

const getAvailableQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ isActive: true }, '-questions.correct'); // Only active quizzes
        res.status(200).json(quizzes);
    } catch (error) {
        console.error("Error fetching available quizzes:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ quizId: req.params.quizId });
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });
        res.status(200).json(quiz);
    } catch (error) {
        console.error("Error fetching quiz:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const submitQuiz = async (req, res) => {
    try {
        const { studentEmail, quizId, answers } = req.body;
        
        const quiz = await Quiz.findOne({ quizId });
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        let score = 0;
        quiz.questions.forEach((q, index) => {
            if (answers[index] === q.correct) {
                score++;
            }
        });

        const newResult = new Result({
            studentEmail,
            quizId,
            subject: quiz.subject,
            score,
            total: quiz.questions.length
        });
        
        await newResult.save();
        res.status(200).json({ message: "Quiz submitted successfully", score, total: quiz.questions.length });
    } catch (error) {
        console.error("Error submitting quiz:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getResults = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const results = await Result.find({ studentEmail: email }).sort({ submittedAt: -1 });
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getStudentStats = async (req, res) => {
    try {
        const { email } = req.query;
        const totalTaken = await Result.countDocuments({ studentEmail: email });
        const activeQuizzes = await Quiz.countDocuments({ isActive: true });
        
        // Calculate average score
        const results = await Result.find({ studentEmail: email });
        const avgScore = results.length > 0 
            ? (results.reduce((acc, curr) => acc + (curr.score/curr.total), 0) / results.length * 100).toFixed(1)
            : 0;
            
        res.status(200).json({ totalTaken, activeQuizzes, avgScore });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getAvailableQuizzes, getQuizById, submitQuiz, getResults, getStudentStats };
