const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

const _dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: [
        "http://localhost:5173",
        process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true
}));

const authRoutes = require("./routes/auth.route");
const interviewRoutes = require("./routes/interview.route");

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use (express.static(path.join(_dirname, "Frontend","dist")));
app.use((req,res) => {
    res.sendFile(path.resolve(_dirname, "Frontend" , "dist", "index.html" ));
});

module.exports = app;