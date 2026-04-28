function Field({ label, helper, children }) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">
        {label}
      </span>
      {children}
      {helper ? (
        <span className="block text-xs leading-5 text-slate-500 dark:text-slate-400">
          {helper}
        </span>
      ) : null}
    </label>
  );
}

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-50 dark:hover:border-indigo-500/70 dark:focus:ring-indigo-500/20";

export default function EnvironmentSelector({ form, osOptions, onChange }) {
  const options = osOptions[form.platform] ?? [];
  const showBrowser = form.platform === "Web";

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/35">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white shadow-sm dark:bg-white dark:text-slate-950">
            2
          </span>
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
            Environment
          </h2>
        </div>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          Capture the runtime context needed to reproduce and triage the defect.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Platform *" helper="Choose where the issue was found.">
          <select
            value={form.platform}
            onChange={(event) => onChange("platform", event.target.value)}
            className={inputClassName}
          >
            <option value="Web">Web</option>
            <option value="Mobile">Mobile</option>
          </select>
        </Field>

        <Field label="Operating System *" helper="Select the affected operating system.">
          <select
            value={form.os}
            onChange={(event) => onChange("os", event.target.value)}
            className={inputClassName}
          >
            {options.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {showBrowser ? (
        <Field label="Browser *" helper="Auto-detected from your browser, editable when needed.">
          <input
            value={form.browser}
            onChange={(event) => onChange("browser", event.target.value)}
            className={inputClassName}
            placeholder="Chrome 124, Edge 124, Firefox 125"
          />
        </Field>
      ) : null}
    </section>
  );
}
