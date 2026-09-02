require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/database");
const invokeGemini = require("./src/services/ai.service");
const {resume , selfDescription , jobDescription} = require ("./src/services/temp")
const generateInterviewReport = require("./src/services/ai.service")

connectDB();

async function runStartupReport() {
  try {
    await generateInterviewReport({resume, selfDescription,jobDescription});
  } catch (error) {
    console.error("Startup interview report failed:", error.message);
  }
}

runStartupReport();

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});