import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import DescriptionInput from "./components/DescriptionInput";
import EnvironmentSelector from "./components/EnvironmentSelector";
import OutputCard from "./components/OutputCard";
import { detectBrowser } from "./utils/browser";
import { useTheme } from "./hooks/useTheme";

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

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState(initialForm);
  const [report, setReport] = useState(emptyReport);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

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

      if (nextOs === current.os) {
        return current;
      }

      return { ...current, os: nextOs };
    });
  }, [form.platform, osOptions]);

  const isValid =
    form.description.trim().length > 0 &&
    form.platform.trim().length > 0 &&
    form.os.trim().length > 0;

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

    const payload = {
      description: form.description.trim(),
      platform: form.platform,
      os: form.os,
      browser: form.platform === "Web" ? form.browser : "N/A",
    };

    console.log("Generating bug report with payload:", payload);

    try {
      const response = await fetch("http://localhost:4000/generate-bug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Generate bug response:", data);

      if (!response.ok) {
        throw new Error(data.error || data.warning || "Failed to generate bug report.");
      }

      setReport({
        title: data.title ?? "---",
        environment: {
          platform: form.platform,
          browser: payload.browser,
          os: form.os,
        },
        preconditions: data.preconditions
          ? String(data.preconditions)
              .split(/\r?\n|,\s*/)
              .map((item) => item.trim())
              .filter(Boolean)
          : ["---"],
        steps: Array.isArray(data.steps) ? data.steps : [],
        expected: data.expected ?? "---",
        actual: data.actual ?? "---",
        severity: data.severity ?? "",
        priority: data.priority ?? "",
      });
    } catch (err) {
      console.error("Generate bug request failed:", err);
      setError(err.message || "Failed to generate bug report.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (report.title === "---") {
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

        <main className="mt-8 grid flex-1 gap-6 lg:grid-cols-[minmax(0,0.98fr)_minmax(0,1.02fr)]">
          <section className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur-xl transition duration-300 dark:border-slate-800 dark:bg-slate-900/80 sm:p-6">
            <div className="space-y-8">
              <DescriptionInput
                value={form.description}
                maxLength={500}
                onChange={(value) => handleFieldChange("description", value)}
              />

              <EnvironmentSelector
                form={form}
                osOptions={osOptions}
                onChange={handleFieldChange}
              />

              <button
                type="button"
                onClick={handleGenerate}
                disabled={!isValid || loading}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-sky-500 px-5 py-4 text-sm font-semibold text-white shadow-card transition duration-300 hover:-translate-y-0.5 hover:shadow-soft focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 dark:focus:ring-indigo-500/30"
              >
                {loading ? "Generating..." : "Generate Bug Report"}
              </button>
            </div>
          </section>

          <OutputCard
            report={report}
            onCopy={handleCopy}
            copied={copied}
            canCopy={report.title !== "---"}
          />
        </main>
      </div>
    </div>
  );
}
