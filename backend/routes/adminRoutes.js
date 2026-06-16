const express=require('express');
const {login,register, getAllUsers, deleteUser, getAllQuizzes, deleteQuiz, getStats}=require('../controllers/adminControllers');  
const { validate, registerValidator } = require('../middleware/validateMiddleware');
const adminRouter=express.Router();


adminRouter.route("/login").get(login).post(login);
adminRouter.route("/register").get(register).post(validate(registerValidator),register);
adminRouter.route("/allUsers").get(getAllUsers);
adminRouter.route("/deleteUser").get(deleteUser).delete(deleteUser);
adminRouter.route("/allQuizzes").get(getAllQuizzes);
adminRouter.route("/deleteQuiz").delete(deleteQuiz);
adminRouter.route("/stats").get(getStats);

module.exports=adminRouter;