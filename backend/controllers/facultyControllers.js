const express = require("express");
const Quiz = require("../models/Quiz");


const createQuiz = async (req, res) => {
    try {
        const { quizId, subject, createdBy, duration, nquestions, questions } = req.body;

        // Validate required fields
        if (!quizId || !subject || !createdBy || !duration || !nquestions || !questions.length) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Ensure the number of questions matches the specified count
        if (questions.length !== nquestions) {
            return res.status(400).json({ message: `Expected ${nquestions} questions, but received ${questions.length}` });
        }
        
        // Create and save the new quiz
        const newQuiz = new Quiz({ quizId, subject, createdBy, duration, nquestions, questions });

        await newQuiz.save();

        res.status(201).json({ message: "Quiz Created Successfully", quiz: newQuiz });
    } catch (error) {
        console.error("Error creating quiz:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getQuizzes = async (req, res) => {
    try {
        const { email } = req.query; // Get email from query params
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const quizzes = await Quiz.find({ createdBy: email }); // Filter by faculty email
        res.status(200).json(quizzes); // ✅ Send quizzes directly (no object wrapper)
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const updates = req.body;

        const updatedQuiz = await Quiz.findOneAndUpdate({ quizId }, updates, { new: true });

        if (!updatedQuiz) {
            return res.status(404).json({ message: "Quiz Not Found" });
        }

        res.status(200).json({ message: "Quiz Updated Successfully", updatedQuiz });
    } catch (error) {
        console.error("Error updating quiz:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const deleteQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;

        const deletedQuiz = await Quiz.findOneAndDelete({ quizId });

        if (!deletedQuiz) {
            return res.status(404).json({ message: "Quiz Not Found" });
        }

        res.status(200).json({ message: "Quiz Deleted Successfully" });
    } catch (error) {
        console.error("Error deleting quiz:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const toggleQuizStatus = async (req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await Quiz.findOne({ quizId });
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        quiz.isActive = !quiz.isActive;
        await quiz.save();
        res.status(200).json({ message: `Quiz ${quiz.isActive ? 'Activated' : 'Deactivated'}`, isActive: quiz.isActive });
    } catch (error) {
        console.error("Error toggling quiz status:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const Result = require('../models/Result');

const getFacultyResults = async (req, res) => {
    try {
        const { email } = req.query;
        // Find all quizzes created by this faculty
        const quizzes = await Quiz.find({ createdBy: email });
        const quizIds = quizzes.map(q => q.quizId);
        
        // Find all results for these quizzes
        const results = await Result.find({ quizId: { $in: quizIds } }).sort({ submittedAt: -1 });
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching faculty results:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getFacultyStats = async (req, res) => {
    try {
        const { email } = req.query;
        const totalQuizzes = await Quiz.countDocuments({ createdBy: email });
        const quizzes = await Quiz.find({ createdBy: email });
        const quizIds = quizzes.map(q => q.quizId);
        const totalSubmissions = await Result.countDocuments({ quizId: { $in: quizIds } });
        const activeQuizzes = await Quiz.countDocuments({ createdBy: email, isActive: true });
        
        res.status(200).json({ totalQuizzes, totalSubmissions, activeQuizzes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { createQuiz, getQuizzes, updateQuiz, deleteQuiz, toggleQuizStatus, getFacultyResults, getFacultyStats };
