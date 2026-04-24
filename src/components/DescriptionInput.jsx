const tips = [
  "Use: action + data + result",
  'Avoid vague phrases like "not working"',
  "Mention what you expected and what happened",
];

export default function DescriptionInput({ value, onChange, maxLength }) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white shadow-sm">
            1
          </span>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Describe the Issue
          </h2>
        </div>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          Write in Arabic, English, or both. Be clear about the user action, expected result, and actual result.
        </p>
      </div>

      <div className="space-y-3">
        <textarea
          value={value}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          placeholder="After entering valid credentials and clicking login, the page keeps loading and never redirects to the dashboard."
          className="min-h-[220px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-900 shadow-sm outline-none transition duration-300 placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-50 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-brand-400 dark:focus:ring-brand-500/20"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Better reports start with clearer context
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {value.length} / {maxLength}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-4 dark:border-indigo-500/20 dark:from-indigo-500/10 dark:via-slate-900 dark:to-slate-900">
        <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-200">
          Tips for better results
        </p>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {tips.map((tip) => (
            <span
              key={tip}
              className="rounded-full border border-white bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {tip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
