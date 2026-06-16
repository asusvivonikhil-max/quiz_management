const express = require('express');
const { getAvailableQuizzes, getQuizById, submitQuiz, getResults, getStudentStats } = require('../controllers/studentControllers');
const studentRouter = express.Router();

studentRouter.route("/quizzes").get(getAvailableQuizzes);
studentRouter.route("/quiz/:quizId").get(getQuizById);
studentRouter.route("/submit").post(submitQuiz);
studentRouter.route("/results").get(getResults);
studentRouter.route("/stats").get(getStudentStats);

module.exports = studentRouter;
