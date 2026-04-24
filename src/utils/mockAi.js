const severityRules = {
  High: ["crash", "not working", "fails", "error", "can't", "cannot"],
  Medium: ["slow", "delay", "issue", "bug"],
  Low: ["ui", "alignment", "spacing", "color"],
};

function normalizeDescription(description) {
  return description.trim().replace(/\s+/g, " ");
}

function includesAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function detectSeverity(text) {
  if (includesAny(text, severityRules.High)) {
    return "High";
  }

  if (includesAny(text, severityRules.Medium)) {
    return "Medium";
  }

  if (includesAny(text, severityRules.Low)) {
    return "Low";
  }

  return "Medium";
}

function detectTitle(text) {
  if (text.includes("login")) {
    return "Login functionality issue";
  }

  if (text.includes("payment")) {
    return "Payment process failure";
  }

  return "Unexpected system behavior";
}

function buildSteps(text) {
  if (text.includes("login")) {
    return [
      "Navigate to the login page",
      "Enter valid credentials",
      "Click on the login button",
      "Observe behavior",
    ];
  }

  if (text.includes("payment")) {
    return [
      "Navigate to the payment page",
      "Enter valid payment details",
      "Submit the payment form",
      "Observe behavior",
    ];
  }

  if (text.includes("button")) {
    return [
      "Open the application",
      "Navigate to the relevant page",
      "Click on the affected button",
      "Observe behavior",
    ];
  }

  return [
    "Open application",
    "Perform action",
    "Observe result",
  ];
}

function buildExpected(text) {
  if (text.includes("login")) {
    return "The user should be successfully logged in and redirected to the dashboard.";
  }

  if (text.includes("payment")) {
    return "The payment should be completed successfully and a confirmation should be displayed.";
  }

  if (text.includes("ui") || text.includes("alignment") || text.includes("spacing")) {
    return "The interface should display correct styling, alignment, and spacing across the affected view.";
  }

  return "The system should complete the requested action successfully without unexpected issues.";
}

function detectPriority(severity) {
  if (severity === "High") {
    return "High";
  }

  if (severity === "Medium") {
    return "Medium";
  }

  return "Low";
}

export function generateBugReport(description) {
  const actual = normalizeDescription(description);
  const text = actual.toLowerCase();
  const severity = detectSeverity(text);

  return {
    title: detectTitle(text),
    steps: buildSteps(text),
    expected: buildExpected(text),
    actual,
    severity,
    priority: detectPriority(severity),
  };
}
