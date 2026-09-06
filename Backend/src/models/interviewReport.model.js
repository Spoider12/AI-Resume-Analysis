const mongoose = require("mongoose");

const technicalQuestionsSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"]
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: [true, "Difficulty is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    },
    followUp: [{
        type: String
    }]
}, {
    _id: false
});

const behaviouralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Behavioral question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, {
    _id: false
});

const codingQuestionSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: [true, "Topic is required"]
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: [true, "Difficulty is required"]
    },
    question: {
        type: String,
        required: [true, "Coding question is required"]
    },
    expectedApproach: {
        type: String,
        required: [true, "Expected approach is required"]
    }
}, {
    _id: false
});

const projectQuestionSchema = new mongoose.Schema({
    project: {
        type: String,
        required: [true, "Project name is required"]
    },
    question: {
        type: String,
        required: [true, "Project question is required"]
    },
    reason: {
        type: String,
        required: [true, "Reason is required"]
    },
    idealAnswer: {
        type: String,
        required: [true, "Ideal answer is required"]
    }
}, {
    _id: false
});

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is required"]
    },
    whyImportant: {
        type: String,
        required: [true, "Why important is required"]
    },
    learningResource: {
        type: String,
        required: [true, "Learning resource is required"]
    }
}, {
    _id: false
});

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"]
    },
    tasks: [{
        type: String,
        required: [true, "Task is required"]
    }]
}, {
    _id: false
});

const salaryConfidenceSchema = new mongoose.Schema({
    confidence: {
        type: String,
        enum: ["Low", "Medium", "High"],
        required: [true, "Confidence is required"]
    },
    reason: {
        type: String,
        required: [true, "Reason is required"]
    }
}, {
    _id: false
});

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },

    resume: {
        type: String
    },

    selfDescription: {
        type: String
    },

    title: {
        type: String,
        required: [true, "Job title is required"]
    },

    matchScore: {
        type: Number,
        min: 0,
        max: 100,
        required: [true, "Match score is required"]
    },

    summary: {
        type: String,
        required: [true, "Summary is required"]
    },

    strengths: [{
        type: String
    }],

    weaknesses: [{
        type: String
    }],

    technicalQuestions: [technicalQuestionsSchema],

    behavioralQuestions: [behaviouralQuestionSchema],

    codingQuestions: [codingQuestionSchema],

    projectQuestions: [projectQuestionSchema],

    skillGaps: [skillGapSchema],

    preparationPlan: [preparationPlanSchema],
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    resumeSuggestions: [{
        type: String
    }],

    atsKeywordsMissing: [{
        type: String
    }],

    interviewerTips: [{
        type: String
    }],

    salaryConfidence: salaryConfidenceSchema,

    finalVerdict: {
        type: String,
        required: [true, "Final verdict is required"]
    }
}, {
    timestamps: true
});

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;