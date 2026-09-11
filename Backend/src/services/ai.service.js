const Groq = require("groq-sdk");
const ai = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const interviewReportSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    matchScore: { type: "number", minimum: 0, maximum: 100 },
    summary: { type: "string" },

    strengths: {
      type: "array",
      items: { type: "string" }
    },

    weaknesses: {
      type: "array",
      items: { type: "string" }
    },

    technicalQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          difficulty: {
            type: "string",
            enum: ["Easy", "Medium", "Hard"]
          },
          intention: { type: "string" },
          answer: { type: "string" },
          followUp: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["question", "difficulty", "intention", "answer", "followUp"]
      }
    },

    behavioralQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" }
        },
        required: ["question", "intention", "answer"]
      }
    },

    codingQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          topic: { type: "string" },
          difficulty: {
            type: "string",
            enum: ["Easy", "Medium", "Hard"]
          },
          question: { type: "string" },
          expectedApproach: { type: "string" }
        },
        required: ["topic", "difficulty", "question", "expectedApproach"]
      }
    },

    projectQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          project: { type: "string" },
          question: { type: "string" },
          reason: { type: "string" },
          idealAnswer: { type: "string" }
        },
        required: ["project", "question", "reason", "idealAnswer"]
      }
    },

    skillGaps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          skill: { type: "string" },
          severity: {
            type: "string",
            enum: ["low", "medium", "high"]
          },
          whyImportant: { type: "string" },
          learningResource: { type: "string" }
        },
        required: ["skill", "severity", "whyImportant", "learningResource"]
      }
    },

    preparationPlan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "number" },
          focus: { type: "string" },
          tasks: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["day", "focus", "tasks"]
      }
    },

    resumeSuggestions: {
      type: "array",
      items: { type: "string" }
    },

    atsKeywordsMissing: {
      type: "array",
      items: { type: "string" }
    },

    interviewerTips: {
      type: "array",
      items: { type: "string" }
    },

    salaryConfidence: {
      type: "object",
      properties: {
        confidence: {
          type: "string",
          enum: ["Low", "Medium", "High"]
        },
        reason: { type: "string" }
      },
      required: ["confidence", "reason"]
    },

    finalVerdict: { type: "string" }
  },

  required: [
    "title",
    "matchScore",
    "summary",
    "strengths",
    "weaknesses",
    "technicalQuestions",
    "behavioralQuestions",
    "codingQuestions",
    "projectQuestions",
    "skillGaps",
    "preparationPlan",
    "resumeSuggestions",
    "atsKeywordsMissing",
    "interviewerTips",
    "salaryConfidence",
    "finalVerdict"
  ]
};

function normalizeReport(report) {
  return {
    ...report,
    technicalQuestions: (report.technicalQuestions || []).map((item) => ({
      ...item,
      followUp: Array.isArray(item.followUp)
        ? item.followUp
        : item.followUp
          ? [item.followUp]
          : [],
    })),
    codingQuestions: (report.codingQuestions || []).map((item) => ({
      ...item,
      topic: item.topic || item.title || "General coding",
      question: item.question || item.title || "Solve this coding problem.",
      expectedApproach: item.expectedApproach || "Explain the algorithm, complexity, and edge cases.",
    })),
    projectQuestions: (report.projectQuestions || []).map((item) => ({
      ...item,
      project: item.project || "Candidate project",
      reason: item.reason || item.intention || "Assess project understanding.",
      idealAnswer: item.idealAnswer || item.answer || "Explain the design, tradeoffs, and results.",
    })),
    skillGaps: (report.skillGaps || []).map((item) => ({
      ...item,
      severity: String(item.severity || "low").toLowerCase(),
    })),
    preparationPlan: (report.preparationPlan || []).map((item, index) => ({
      ...item,
      day: Number.parseInt(item.day, 10) || index + 1,
    })),
    salaryConfidence: report.salaryConfidence
      ? {
          ...report.salaryConfidence,
          confidence: report.salaryConfidence.confidence === "Moderate"
            ? "Medium"
            : report.salaryConfidence.confidence,
        }
      : report.salaryConfidence,
  };
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = `
Generate an interview preparation report.

Return ONLY valid JSON. Do not use markdown or code fences.
Include every field in this exact structure, using [] for an empty array and
an empty string only where a text value is genuinely unavailable:
title, matchScore, summary, strengths, weaknesses, technicalQuestions,
behavioralQuestions, codingQuestions, projectQuestions, skillGaps,
preparationPlan, resumeSuggestions, atsKeywordsMissing, interviewerTips,
salaryConfidence, finalVerdict.

Each technical question must include question, difficulty, intention, answer,
and followUp. Difficulty is mandatory and must be exactly one of Easy, Medium,
or Hard. Never omit the difficulty field. Each behavioral question must include question, intention, and
answer. Each skill gap must include skill, severity, whyImportant, and
learningResource. Each preparation day must include day, focus, and tasks.
salaryConfidence must include confidence and reason.

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  const response = await ai.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 1,
    max_completion_tokens: 8192,
    top_p: 1,
    reasoning_effort: "medium",
    response_format: {
      type: "json_object",
    },
  });

  const report = normalizeReport(JSON.parse(response.choices[0].message.content));

  return report;
}

module.exports = generateInterviewReport;