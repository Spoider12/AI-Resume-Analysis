const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: [
        "http://localhost:5173",
       
     
    ].filter(Boolean),
    credentials: true
}));

const authRoutes = require("./routes/auth.route");
const interviewRoutes = require("./routes/interview.route");
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

module.exports = app;