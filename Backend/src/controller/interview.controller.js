const { PDFParse } = require("pdf-parse");

const interviewReportModel = require("../models/interviewReport.model");
const generateInterviewReport = require("../services/ai.service");

async function generateInterviewReportController(req, res) {
    let parser;

    try {
        const resumeFile = req.file;
        const { selfDescription, jobDescription } = req.body;

        if (!resumeFile) {
            return res.status(400).json({
                message: "Resume file is required for this request."
            });
        }

        if (!resumeFile.buffer) {
            return res.status(400).json({
                message: "Resume file buffer is missing. Check Multer configuration."
            });
        }

        // pdf-parse v2 syntax
        parser = new PDFParse({
            data: resumeFile.buffer
        });

        const resumeContent = await parser.getText();
        const resumeText = resumeContent.text;

        if (!resumeText || !resumeText.trim()) {
            return res.status(400).json({
                message: "Could not extract text from the uploaded PDF."
            });
        }

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        });

        return res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });

    } catch (error) {
        console.error("Error generating interview report:", error);

        if (
            error?.status === 429 ||
            error?.statusCode === 429 ||
            error?.code === 429
        ) {
            return res.status(429).json({
                message: "AI quota exceeded. Please wait and try again later.",
                details: error?.message || String(error)
            });
        }

        if (
            error?.status === 401 ||
            error?.status === 403 ||
            error?.status === 404 ||
            error?.status === 503
        ) {
            return res.status(503).json({
                message: "The AI service is temporarily unavailable.",
                details: error?.message || String(error)
            });
        }

        return res.status(500).json({
            message: "Failed to generate interview report.",
            error: error?.message || "Internal server error"
        });

    } finally {
        if (parser) {
            await parser.destroy();
        }
    }
}

/**
 * @description Get interview report by ID
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        return res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        });

    } catch (error) {
        console.error("Error fetching interview report:", error);

        return res.status(500).json({
            message: "Failed to fetch interview report.",
            error: error?.message || "Internal server error"
        });
    }
}

/**
 * @description Get all interview reports of logged-in user
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({
                user: req.user.id
            })
            .sort({
                createdAt: -1
            })
            .select(
                "-resume " +
                "-selfDescription " +
                "-jobDescription " +
                "-__v " +
                "-technicalQuestions " +
                "-behavioralQuestions " +
                "-skillGaps " +
                "-preparationPlan"
            );

        return res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        });

    } catch (error) {
        console.error("Error fetching interview reports:", error);

        return res.status(500).json({
            message: "Failed to fetch interview reports.",
            error: error?.message || "Internal server error"
        });
    }
}

module.exports = {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController
};