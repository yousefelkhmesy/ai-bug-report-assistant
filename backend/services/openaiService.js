import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || "gpt-5-mini";

const responseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    preconditions: {
      type: "array",
      items: { type: "string" },
    },
    steps: {
      type: "array",
      items: { type: "string" },
    },
    expected: { type: "string" },
    actual: { type: "string" },
    severity: {
      type: "string",
      enum: ["Critical", "High", "Medium", "Low"],
    },
    priority: {
      type: "string",
      enum: ["High", "Medium", "Low"],
    },
  },
  required: [
    "title",
    "preconditions",
    "steps",
    "expected",
    "actual",
    "severity",
    "priority",
  ],
};

const allowedSeverity = new Set(["Critical", "High", "Medium", "Low"]);
const allowedPriority = new Set(["High", "Medium", "Low"]);

const systemPrompt = `
You are a professional QA engineer.
Generate a structured bug report from the provided issue details.

Rules:
- Return valid JSON only.
- Use clean, concise, professional QA language.
- Infer missing reproduction steps logically when needed.
- Preserve the user's actual issue in the actual field.
- Preconditions must be an array of strings.
- Steps must be an array of strings.

Severity rules:
- Crash or app unusable -> Critical
- Login or payment failure -> High
- Core feature issue -> Medium
- UI issue -> Low

Priority rules:
- Critical or High severity -> High priority
- Medium severity -> Medium priority
- Low severity -> Low priority
`.trim();

function getClient() {
  if (!apiKey) {
    const error = new Error("OPENAI_API_KEY is not configured.");
    error.statusCode = 500;
    throw error;
  }

  return new OpenAI({ apiKey });
}

function extractTextContent(response) {
  if (response.output_text) {
    return response.output_text;
  }

  const parts = [];

  for (const item of response.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) {
        parts.push(content.text);
      }
    }
  }

  return parts.join("").trim();
}

function parseBugReport(payload) {
  let parsed;

  try {
    parsed = JSON.parse(payload);
  } catch {
    const error = new Error("OpenAI returned invalid JSON.");
    error.statusCode = 502;
    throw error;
  }

  if (
    !parsed ||
    typeof parsed.title !== "string" ||
    !Array.isArray(parsed.preconditions) ||
    !Array.isArray(parsed.steps) ||
    typeof parsed.expected !== "string" ||
    typeof parsed.actual !== "string" ||
    typeof parsed.severity !== "string" ||
    typeof parsed.priority !== "string" ||
    !allowedSeverity.has(parsed.severity) ||
    !allowedPriority.has(parsed.priority)
  ) {
    const error = new Error("OpenAI response did not match the required schema.");
    error.statusCode = 502;
    throw error;
  }

  return parsed;
}

export async function buildBugReport(input) {
  const client = getClient();

  try {
    const response = await client.responses.create({
      model,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: systemPrompt,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify(input),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "bug_report_response",
          strict: true,
          schema: responseSchema,
        },
      },
    });

    const content = extractTextContent(response);

    if (!content) {
      const error = new Error("OpenAI returned an empty response.");
      error.statusCode = 502;
      throw error;
    }

    return parseBugReport(content);
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    const serviceError = new Error("Failed to generate bug report.");
    serviceError.statusCode = 502;
    throw serviceError;
  }
}
