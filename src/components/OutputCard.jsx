import ActionButton from "./ActionButton";

function Badge({ label, tone }) {
  const tones = {
    critical: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300",
    high: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300",
    medium: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
    low: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
  };

  if (!label) {
    return null;
  }

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone] ?? tones.medium}`}>
      {label}
    </span>
  );
}

function Section({ title, children }) {
  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/50">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {title}
      </h3>
      <div className="text-sm leading-7 text-slate-700 dark:text-slate-200">
        {children}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center gap-5 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-2xl font-bold text-indigo-600 shadow-sm dark:bg-indigo-500/10 dark:text-indigo-300">
        QA
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight text-slate-800 dark:text-white">
          No report generated yet
        </h3>
        <p className="max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          Add a clear issue description and generate a structured report ready for Jira or Azure DevOps.
        </p>
      </div>
    </div>
  );
}

export default function OutputCard({
  report,
  onCopy,
  onRegenerate,
  copied,
  canCopy,
  canRegenerate,
  loading,
}) {
  const title = report?.title || "---";
  const environment = report?.environment ?? {};
  const preconditions = Array.isArray(report?.preconditions) ? report.preconditions : ["---"];
  const steps = Array.isArray(report?.steps) ? report.steps : [];
  const expected = report?.expected || "---";
  const actual = report?.actual || "---";
  const severity = report?.severity || "Medium";
  const priority = report?.priority || "Medium";
  const hasReport = title !== "---";

  return (
    <section className="flex h-full w-full flex-col rounded-2xl border border-white/70 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <header className="mb-6 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white shadow-sm">
              3
            </span>
            <h2 className="text-xl font-semibold tracking-tight text-slate-800 dark:text-white">
              Your Bug Report
            </h2>
          </div>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            Structured output with reproducible steps and triage metadata.
          </p>
        </div>
      </header>

      <div className="flex-1">
        {!hasReport ? (
          <EmptyState />
        ) : (
          <div className="w-full space-y-5">
            <Section title="Title">
              <p className="text-lg font-semibold leading-7 text-slate-950 dark:text-white">
                {title}
              </p>
            </Section>

            <div className="grid w-full gap-4 sm:grid-cols-2">
              <Section title="Environment">
                <ul className="space-y-1.5">
                  <li>Platform: {environment.platform || "-"}</li>
                  <li>Browser: {environment.browser || "-"}</li>
                  <li>OS: {environment.os || "-"}</li>
                </ul>
              </Section>

              <Section title="Triage">
                <div className="flex flex-wrap gap-2">
                  <Badge label={`Severity: ${severity}`} tone={severity.toLowerCase()} />
                  <Badge label={`Priority: ${priority}`} tone={priority.toLowerCase()} />
                </div>
              </Section>
            </div>

            <Section title="Preconditions">
              <ul className="space-y-1.5">
                {preconditions.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </Section>

            <Section title="Steps to Reproduce">
              {steps.length ? (
                <ol className="space-y-2">
                  {steps.map((step, index) => (
                    <li key={`${index + 1}-${step}`}>
                      <span className="mr-2 font-semibold text-indigo-600 dark:text-indigo-300">
                        {index + 1}.
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              ) : (
                <p>---</p>
              )}
            </Section>

            <div className="grid w-full gap-4 sm:grid-cols-2">
              <Section title="Expected Result">
                <p>{expected}</p>
              </Section>

              <Section title="Actual Result">
                <p>{actual}</p>
              </Section>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-10 w-full border-t border-slate-200 pt-6 dark:border-slate-800">
        <div className="flex flex-nowrap items-center justify-center gap-4">
          <div className="[&>button]:min-w-[156px] [&>button]:px-8 [&>button]:py-3.5">
            <ActionButton onClick={onCopy} disabled={!canCopy}>
              {copied ? "Copied" : "Copy"}
            </ActionButton>
          </div>

          <div className="[&>button]:min-w-[156px] [&>button]:px-8 [&>button]:py-3.5">
            <ActionButton
              onClick={onRegenerate}
              disabled={!canRegenerate}
              variant="primary"
            >
              {loading ? "Generating..." : "Regenerate"}
            </ActionButton>
          </div>
        </div>
      </footer>
    </section>
  );
}
