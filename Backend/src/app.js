const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth.route");
const interviewRoutes = require("./routes/interview.route");

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "https://ai-resume-analysis-phi.vercel.app",
    "https://ai-resume-analysis-3ldp.onrender.com",
    ...(process.env.CORS_ORIGINS || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Register API endpoints
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

module.exports = app;