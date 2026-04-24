const riskKeywords = {
  high: ["login", "payment", "checkout", "security", "crash", "delete", "redirect"],
  medium: ["slow", "broken", "error", "fail", "issue", "incorrect"],
};

function normalizeDescription(description) {
  return description.trim().replace(/\s+/g, " ");
}

function createTitle(text) {
  const lowered = text.toLowerCase();

  if (lowered.includes("login")) {
    return "Login does not redirect user after valid credentials";
  }

  if (lowered.includes("payment") || lowered.includes("checkout")) {
    return "Payment flow does not complete successfully";
  }

  return `Issue: ${text.slice(0, 72)}${text.length > 72 ? "..." : ""}`;
}

function createPreconditions(text) {
  const lowered = text.toLowerCase();

  if (lowered.includes("login")) {
    return ["User is on the login page", "User has valid credentials"];
  }

  if (lowered.includes("payment") || lowered.includes("checkout")) {
    return ["User has items in the cart", "User is on the checkout page"];
  }

  return ["User is on the relevant page"];
}

function createSteps(text) {
  return text
    .split(/[.!?]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function createExpected(text) {
  const lowered = text.toLowerCase();

  if (lowered.includes("login")) {
    return "User should be redirected to the dashboard after successful login.";
  }

  if (lowered.includes("payment") || lowered.includes("checkout")) {
    return "Payment should be processed successfully and the order should be confirmed.";
  }

  return "The expected product behavior should occur without errors.";
}

function pickTone(text) {
  const lowered = text.toLowerCase();

  if (riskKeywords.high.some((item) => lowered.includes(item))) {
    return "High";
  }

  if (riskKeywords.medium.some((item) => lowered.includes(item))) {
    return "Medium";
  }

  return "Low";
}

export function generateReport({ description, platform, browser, os }) {
  const text = normalizeDescription(description);
  const steps = createSteps(text);
  const level = pickTone(text);

  return {
    title: createTitle(text),
    environment: {
      platform,
      browser,
      os,
    },
    preconditions: createPreconditions(text),
    steps,
    expected: createExpected(text),
    actual: text,
    severity: level,
    priority: level,
  };
}
