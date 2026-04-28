import { useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header";
import EnvironmentSelector from "./components/EnvironmentSelector";
import OutputCard from "./components/OutputCard";
import { detectBrowser } from "./utils/browser";
import { useTheme } from "./hooks/useTheme";

const apiUrl = "http://localhost:5000/generate-bug";
const maxDescriptionLength = 500;

const initialForm = {
  description: "",
  platform: "Web",
  os: "Windows",
  browser: "",
};

const emptyReport = {
  title: "---",
  environment: {
    platform: "-",
    browser: "-",
    os: "-",
  },
  preconditions: ["---"],
  steps: [],
  expected: "---",
  actual: "---",
  severity: "",
  priority: "",
};

const tips = [
  "Include the exact user action",
  "Mention expected and actual results",
  "Add error text or affected screen when available",
];

function normalizeString(value, fallback = "---") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeStringArray(value, fallback = ["---"]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length ? items : fallback;
}

function normalizeReport(data, form) {
  return {
    title: normalizeString(data?.title),
    environment: {
      platform: form.platform,
      browser: form.platform === "Web" ? normalizeString(form.browser, "Unknown browser") : "N/A",
      os: form.os,
    },
    preconditions: normalizeStringArray(data?.preconditions),
    steps: normalizeStringArray(data?.steps, []),
    expected: normalizeString(data?.expected),
    actual: normalizeString(data?.actual),
    severity: normalizeString(data?.severity, "Medium"),
    priority: normalizeString(data?.priority, "Medium"),
  };
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState(initialForm);
  const [report, setReport] = useState(emptyReport);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const resultRef = useRef(null);

  useEffect(() => {
    setForm((current) => ({ ...current, browser: detectBrowser() }));
  }, []);

  const osOptions = useMemo(
    () => ({
      Web: ["Windows", "Mac", "Linux"],
      Mobile: ["Android", "iOS"],
    }),
    [],
  );

  useEffect(() => {
    setForm((current) => {
      const options = osOptions[current.platform] ?? [];
      const nextOs = options.includes(current.os) ? current.os : options[0] ?? "";

      return nextOs === current.os ? current : { ...current, os: nextOs };
    });
  }, [form.platform, osOptions]);

  const isValid =
    form.description.trim().length >= 10 &&
    form.platform.trim().length > 0 &&
    form.os.trim().length > 0 &&
    (form.platform !== "Web" || form.browser.trim().length > 0);

  const hasReport = report.title !== "---";

  const handleFieldChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleGenerate = async () => {
    if (!isValid || loading) {
      return;
    }

    setLoading(true);
    setCopied(false);
    setError("");

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          description: form.description.trim(),
          platform: form.platform,
          os: form.os,
          browser: form.platform === "Web" ? form.browser.trim() : "",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || data?.warning || "Failed to generate bug report.");
      }

      setReport(normalizeReport(data, form));

      window.requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    } catch (requestError) {
      setError(
        requestError.name === "AbortError"
          ? "Request timed out. Please try again."
          : requestError.message || "Failed to generate bug report.",
      );
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!hasReport) {
      return;
    }

    const payload = [
      "Title:",
      report.title,
      "",
      "Environment:",
      `Platform: ${report.environment.platform}`,
      `Browser: ${report.environment.browser}`,
      `OS: ${report.environment.os}`,
      "",
      "Preconditions:",
      ...report.preconditions,
      "",
      "Steps to Reproduce:",
      ...report.steps.map((step, index) => `${index + 1}. ${step}`),
      "",
      "Expected Result:",
      report.expected,
      "",
      "Actual Result:",
      report.actual,
      "",
      `Severity: ${report.severity}`,
      `Priority: ${report.priority}`,
    ].join("\n");

    await navigator.clipboard.writeText(payload);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <Header theme={theme} onToggleTheme={toggleTheme} />

        <main className="mt-8 grid flex-1 gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <section className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-soft backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85 sm:p-6">
            <div className="space-y-7">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white shadow-sm">
                      1
                    </span>
                    <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                      Describe the Issue
                    </h2>
                  </div>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Add enough context for a tester or developer to reproduce the issue confidently.
                  </p>
                </div>

                <textarea
                  value={form.description}
                  maxLength={maxDescriptionLength}
                  onChange={(event) => handleFieldChange("description", event.target.value)}
                  placeholder="Example: After entering valid credentials and clicking Login, the page keeps loading and never redirects to the dashboard. No validation error is shown."
                  className="min-h-[260px] w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-900 shadow-sm outline-none transition hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-50 dark:placeholder:text-slate-500 dark:hover:border-indigo-500/70 dark:focus:ring-indigo-500/20"
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Minimum 10 characters. Clear symptoms produce better reports.
                  </p>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {form.description.length} / {maxDescriptionLength}
                  </span>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  {tips.map((tip) => (
                    <div
                      key={tip}
                      className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-3 py-2 text-xs font-medium text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-200"
                    >
                      {tip}
                    </div>
                  ))}
                </div>
              </div>

              <EnvironmentSelector form={form} osOptions={osOptions} onChange={handleFieldChange} />

              <div className="space-y-3">
                <div className="flex w-full items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!isValid || loading}
                    className="inline-flex min-w-[220px] items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 px-6 py-4 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 dark:focus:ring-indigo-500/30"
                  >
                    {loading ? "Generating..." : "Generate Bug Report"}
                  </button>
                </div>

                {error ? (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
                    {error}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <div ref={resultRef}>
            <OutputCard
              report={report}
              onCopy={handleCopy}
              onRegenerate={handleGenerate}
              copied={copied}
              canCopy={hasReport}
              canRegenerate={isValid && !loading}
              loading={loading}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
