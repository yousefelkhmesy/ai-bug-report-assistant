import ActionButton from "./ActionButton";

function Badge({ label, tone }) {
  const tones = {
    high: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300",
    medium: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
    low: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  };

  if (!label) {
    return null;
  }

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {label}
    </span>
  );
}

function Section({ title, children }) {
  return (
    <section className="border-b border-slate-200/80 pb-5 last:border-b-0 last:pb-0 dark:border-slate-800">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {title}
      </h3>
      <div className="text-sm leading-7 text-slate-700 dark:text-slate-200">{children}</div>
    </section>
  );
}

export default function OutputCard({ report, onCopy, copied, canCopy }) {
  return (
    <section className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur-xl transition duration-300 dark:border-slate-800 dark:bg-slate-900/80 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white shadow-sm">
              3
            </span>
            <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Generated Bug Report
            </h2>
          </div>
          <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
            Ready
          </div>
        </div>

        <ActionButton onClick={onCopy} disabled={!canCopy}>
          {copied ? "Copied!" : "Copy Report"}
        </ActionButton>
      </div>

      <div className="mt-5 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/50">
        <div className="space-y-5">
          <Section title="Title">
            <p>{report.title}</p>
          </Section>

          <Section title="Environment">
            <ul className="space-y-1.5">
              <li>Platform: {report.environment.platform}</li>
              <li>Browser: {report.environment.browser}</li>
              <li>OS: {report.environment.os}</li>
            </ul>
          </Section>

          <Section title="Preconditions">
            <ul className="space-y-1.5">
              {report.preconditions.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </Section>

          <Section title="Steps to Reproduce">
            {report.steps.length ? (
              <ol className="space-y-1.5">
                {report.steps.map((step, index) => (
                  <li key={`${index + 1}-${step}`}>{index + 1}. {step}</li>
                ))}
              </ol>
            ) : (
              <p>---</p>
            )}
          </Section>

          <Section title="Expected Result">
            <p>{report.expected}</p>
          </Section>

          <Section title="Actual Result">
            <p>{report.actual}</p>
          </Section>

          <div className="flex flex-wrap gap-3 pt-1">
            <Badge label={`Severity: ${report.severity}`} tone={report.severity.toLowerCase()} />
            <Badge label={`Priority: ${report.priority}`} tone={report.priority.toLowerCase()} />
          </div>
        </div>
      </div>
    </section>
  );
}
