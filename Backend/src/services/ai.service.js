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
          learningResource: { type: "string" },
          referenceLinks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                url: { type: "string" },
                platform: { type: "string" }
              },
              required: ["title", "url"]
            }
          },
          estimatedLearningTime: { type: "string" }
        },
        required: ["skill", "severity", "whyImportant", "learningResource"]
      }
    },

    skillGapQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          skill: { type: "string" },
          question: { type: "string" },
          difficulty: {
            type: "string",
            enum: ["Easy", "Medium", "Hard"]
          },
          whyAsked: { type: "string" },
          keyPoints: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["skill", "question", "difficulty", "whyAsked"]
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
    "skillGapQuestions",
    "preparationPlan",
    "resumeSuggestions",
    "atsKeywordsMissing",
    "interviewerTips",
    "salaryConfidence",
    "finalVerdict"
  ]
};

function normalizeReport(report) {
  const normalizeLearningResource = (resource, skill, referenceLinks) => {
    if (typeof resource === "string" && resource.trim()) {
      return resource.trim();
    }

    if (resource && typeof resource === "object" && !Array.isArray(resource)) {
      const description = [
        resource.description,
        resource.summary,
        resource.title,
        resource.name,
        resource.resource,
        resource.url,
      ]
        .filter((value) => typeof value === "string" && value.trim())
        .join(" — ");

      if (description) {
        return description;
      }

      return JSON.stringify(resource);
    }

    if (Array.isArray(resource)) {
      const descriptions = resource
        .map((item) => {
          if (typeof item === "string") {
            return item.trim();
          }

          if (item && typeof item === "object") {
            return [item.title, item.url, item.description]
              .filter((value) => typeof value === "string" && value.trim())
              .join(" — ");
          }

          return "";
        })
        .filter(Boolean);

      if (descriptions.length > 0) {
        return descriptions.join("; ");
      }
    }

    if (referenceLinks.length > 0) {
      return `Study ${skill} using the reference links provided.`;
    }

    console.warn(`AI did not provide a learning resource for skill gap "${skill}".`);
    return `Study ${skill} using a trusted learning resource.`;
  };

  const rawSalaryConfidence = report.salaryConfidence?.confidence;
  const normalizedSalaryConfidence = String(rawSalaryConfidence || "")
    .trim()
    .toLowerCase();
  const confidenceAliases = {
    low: "Low",
    "low confidence": "Low",
    medium: "Medium",
    moderate: "Medium",
    "medium confidence": "Medium",
    "moderate confidence": "Medium",
    high: "High",
    "high confidence": "High",
  };

  let salaryConfidence = report.salaryConfidence;

  if (report.salaryConfidence) {
    let confidence = confidenceAliases[normalizedSalaryConfidence];

    if (!confidence) {
      console.warn(
        `AI returned an unrecognized salary confidence (${String(rawSalaryConfidence)}); using Medium.`
      );
      confidence = "Medium";
    }

    salaryConfidence = {
      ...report.salaryConfidence,
      confidence,
    };
  }

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
    skillGaps: (report.skillGaps || []).map((item) => {
      const referenceLinks = Array.isArray(item.referenceLinks)
        ? item.referenceLinks
        : [];

      return {
        ...item,
        severity: String(item.severity || "low").toLowerCase(),
        learningResource: normalizeLearningResource(
          item.learningResource,
          item.skill || "this skill",
          referenceLinks
        ),
        referenceLinks,
        estimatedLearningTime: item.estimatedLearningTime || "2-4 hours",
      };
    }),
    skillGapQuestions: (report.skillGapQuestions || []).map((item) => ({
      ...item,
      difficulty: item.difficulty || "Medium",
      keyPoints: Array.isArray(item.keyPoints) ? item.keyPoints : [],
    })),
    preparationPlan: (report.preparationPlan || []).map((item, index) => ({
      ...item,
      day: Number.parseInt(item.day, 10) || index + 1,
    })),
    salaryConfidence,
  };
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = `
Generate a comprehensive interview preparation report with STRONG FOCUS on SKILL GAPS.

CRITICAL: Analyze the Job Description and Resume carefully:
1. Identify ALL skills/technologies mentioned in Job Description
2. Compare with Resume to find MISSING SKILLS (skills in job description but NOT in resume)
3. Generate targeted interview questions specifically about these missing skill gaps
4. Include reference links to authoritative learning resources

Return ONLY valid JSON. Do not use markdown or code fences.
Include every field in this exact structure, using [] for an empty array and
an empty string only where a text value is genuinely unavailable:
title, matchScore, summary, strengths, weaknesses, technicalQuestions,
behavioralQuestions, codingQuestions, projectQuestions, skillGaps, skillGapQuestions,
preparationPlan, resumeSuggestions, atsKeywordsMissing, interviewerTips,
salaryConfidence, finalVerdict.

SKILL GAPS REQUIREMENTS:
- Each skill gap MUST have: skill, severity (low/medium/high), whyImportant, learningResource
- learningResource MUST be a plain text string, never an object or array
- MUST include referenceLinks array with objects containing: title, url, platform
- Include estimatedLearningTime (e.g., "2-4 hours", "1-2 days", "1 week")
- Severity should be HIGH for critical skills, MEDIUM for important skills, LOW for nice-to-have

REFERENCE LINKS REQUIREMENTS:
- Provide 2-3 authoritative learning resources per skill gap
- Include platforms like: GeeksforGeeks, W3Schools, MDN Web Docs, freeCodeCamp, Coursera, Udemy, YouTube Channels
- Ensure URLs are real and accessible
- Format: { "title": "Topic name - Source", "url": "https://exact.url", "platform": "GeeksforGeeks/W3Schools/etc" }

SKILL GAP QUESTIONS REQUIREMENTS:
- For each HIGH/MEDIUM severity skill gap, create 1-2 interview questions
- Each question MUST have: skill, question, difficulty (Easy/Medium/Hard), whyAsked, keyPoints
- These questions should test understanding of the missing skill
- Questions should be specific to the job description requirements

Each technical question must include question, difficulty, intention, answer, and followUp.
Each behavioral question must include question, intention, and answer.
Each preparation day must include day, focus, and tasks.
salaryConfidence must include confidence and reason.
salaryConfidence.confidence must be exactly "Low", "Medium", or "High" (case-sensitive).

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

IMPORTANT: Generate skillGapQuestions array focusing on MISSING skills from the job description that aren't in the resume. These are critical for the interview.
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