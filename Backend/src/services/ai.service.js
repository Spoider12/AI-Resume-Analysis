const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
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

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = `
Generate an interview preparation report.

Return ONLY valid JSON.
Do not add extra keys.
Follow exactly this structure:
matchScore, technicalQuestions, behavioralQuestions, skillGaps, preparationPlan, title.

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
      tools: [
        { type: "google_search" }
      ],
    config: {
      responseMimeType: "application/json",
      responseSchema: interviewReportSchema,
    },
  });

  const report = JSON.parse(response.text);

  console.log(report);
  return report;
}

module.exports = generateInterviewReport;