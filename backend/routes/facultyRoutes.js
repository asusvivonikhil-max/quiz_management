const express=require('express');
const { createQuiz, getQuizzes, toggleQuizStatus, getFacultyResults, getFacultyStats } = require('../controllers/facultyControllers');
const facultyRouter=express.Router();


facultyRouter.route("/create-quiz").post(createQuiz);
facultyRouter.route("/view-quizzes").get(getQuizzes);
facultyRouter.route("/toggle-status/:quizId").patch(toggleQuizStatus);
facultyRouter.route("/results").get(getFacultyResults);
facultyRouter.route("/stats").get(getFacultyStats);

module.exports=facultyRouter;