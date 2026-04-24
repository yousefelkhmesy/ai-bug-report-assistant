const allowedPlatforms = new Set(["Web", "Mobile"]);

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateBugRequest(payload) {
  const description = normalizeString(payload?.description);
  const platform = normalizeString(payload?.platform);
  const os = normalizeString(payload?.os);
  const browser = normalizeString(payload?.browser);

  if (!description) {
    return {
      error: "Description is required.",
      statusCode: 400,
    };
  }

  if (description.length < 10) {
    return {
      warning: "Description is too short. Please provide at least 10 characters.",
      statusCode: 400,
    };
  }

  if (!allowedPlatforms.has(platform)) {
    return {
      error: "Platform must be either Web or Mobile.",
      statusCode: 400,
    };
  }

  if (!os) {
    return {
      error: "OS is required.",
      statusCode: 400,
    };
  }

  if (!browser) {
    return {
      error: "Browser is required.",
      statusCode: 400,
    };
  }

  return {
    statusCode: 200,
    data: {
      description,
      platform,
      os,
      browser,
    },
  };
}
