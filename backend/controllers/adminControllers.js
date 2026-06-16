const express=require('express');
const bcrypt=require('bcryptjs');
const User = require('../models/User');
const Quiz = require('../models/Quiz');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }

        const pass = await bcrypt.compare(password, user.password);
        if (!pass) {
            return res.status(400).json({ message: "Wrong Password" });
        }

        const token = await user.generateToken();

        // Return only necessary user data
        res.status(200).json({
            message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Login Success`,
            token,
            role: user.role, 
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};








const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User Already Exists" });
        }

        const validRoles = ['admin', 'student', 'faculty'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid Role" });
        }

        const newUser = new User({ name, email, password, role });

        await newUser.save();

        res.status(201).json({ message: "User Created Successfully",
            token: await newUser.generateToken(),
            userId: newUser._id.toString(),
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude passwords
        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOneAndDelete({ email });

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        res.status(200).json({ message: "User Deleted Successfully", deletedUser: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};





const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({});
        res.status(200).json(quizzes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const deleteQuiz = async (req, res) => {
    try {
        const { quizId } = req.body;
        const quiz = await Quiz.findOneAndDelete({ quizId });
        if (!quiz) {
            return res.status(404).json({ message: "Quiz Not Found" });
        }
        res.status(200).json({ message: "Quiz Deleted Successfully", deletedQuiz: quiz });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const Result = require('../models/Result');

const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalQuizzes = await Quiz.countDocuments();
        const totalSubmissions = await Result.countDocuments();
        const activeQuizzes = await Quiz.countDocuments({ isActive: true });
        
        res.status(200).json({ totalUsers, totalQuizzes, totalSubmissions, activeQuizzes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports={login,register,getAllUsers,deleteUser,getAllQuizzes,deleteQuiz,getStats};
