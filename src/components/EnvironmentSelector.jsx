function Field({ label, children }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition duration-300 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-50 dark:hover:border-slate-600 dark:focus:border-brand-400 dark:focus:ring-brand-500/20";

export default function EnvironmentSelector({ form, osOptions, onChange }) {
  const options = osOptions[form.platform] ?? [];
  const showBrowser = form.platform === "Web";

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white shadow-sm dark:bg-slate-100 dark:text-slate-950">
            2
          </span>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Environment Details
          </h2>
        </div>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          Capture the platform and runtime context so the generated report is actionable.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Platform *">
          <select
            value={form.platform}
            onChange={(event) => onChange("platform", event.target.value)}
            className={inputClassName}
          >
            <option value="Web">Web</option>
            <option value="Mobile">Mobile</option>
          </select>
        </Field>

        <Field label="Operating System *">
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
        <Field label="Browser (Auto-detected)">
          <input value={form.browser} readOnly className={inputClassName} />
        </Field>
      ) : null}

      <div className="rounded-2xl border border-sky-100 bg-sky-50/80 px-4 py-3 text-sm text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200">
        {showBrowser
          ? "Browser is automatically detected for web issues."
          : "Browser details are hidden for mobile reports."}
      </div>
    </div>
  );
}
