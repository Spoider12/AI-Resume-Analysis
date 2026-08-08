 const express = require('express');
 /* require all the routes here */

 const cookieParser = require("cookie-parser");
 const cors = require("cors")




 const app = express();

 app.use(express.json());
 app.use(cookieParser());
 app.use(cors({
    origin: "https://ai-interview-ebon-eight.vercel.app/",
    credentials: true
 }))
 /*require all the routes here*/
  const authRoutes = require("./routes/auth.route");
  const interviewRoutes = require("./routes/interview.route");
 /*using all the routes here*/
 app.use("/api/auth",authRoutes);
 app.use("/api/interview",interviewRoutes);

 module.exports = app;