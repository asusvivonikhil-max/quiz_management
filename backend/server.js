require('dotenv').config();
const express=require('express');
const connectDB = require('./utils/db');
const adminRouter = require('./routes/adminRoutes');
const facultyRouter = require('./routes/facultyRoutes');
const studentRouter = require('./routes/studentRoutes');
const app=express();
const cors = require("cors");
app.use(cors());

app.use(express.json());

app.use("/api/auth",adminRouter);
app.use("/faculty/",facultyRouter);
app.use("/student/",studentRouter);

connectDB().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}
).catch((error)=>{  
    console.log(error);
});