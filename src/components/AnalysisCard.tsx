import { AnalyzeResponse } from '@utils/mockApi';

interface AnalysisCardProps {
  data: AnalyzeResponse;
  compact?: boolean;
  onViewDetails?: () => void;
}

const verdictStyles: Record<AnalyzeResponse['verdict'], string> = {
  phish: 'bg-rose-500/10 text-rose-400 border-rose-500/20 ring-rose-500/20',
  safe: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ring-emerald-500/20',
  suspicious: 'bg-amber-500/10 text-amber-400 border-amber-500/20 ring-amber-500/20'
};

const AnalysisCard = ({ data, compact = false, onViewDetails }: AnalysisCardProps) => {
  const probPercent = Math.round(data.phishing_prob * 100);

  return (
    <article
      className={`glass-surface relative overflow-hidden rounded-3xl p-6 transition-all hover:bg-white dark:hover:bg-slate-900/60 ${compact ? 'space-y-5' : 'space-y-8'
        }`}
    >
      {/* Background glow based on verdict yeqhh*/}
      <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl opacity-20 pointer-events-none ${data.verdict === 'phish' ? 'bg-rose-500' :
          data.verdict === 'safe' ? 'bg-emerald-500' : 'bg-amber-500'
        }`} />

      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Analysis Verdict</p>
          <div className="mt-2 flex items-center gap-4">
            <span className={`rounded-full border px-4 py-1.5 text-sm font-bold uppercase tracking-wide shadow-sm ring-1 ring-inset ${verdictStyles[data.verdict]}`}>
              {data.verdict}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">{probPercent}%</span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">probability</span>
            </div>
          </div>
        </div>
        {onViewDetails && (
          <button
            type="button"
            className="group flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-900 transition-all hover:bg-slate-200 hover:pr-4 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            onClick={onViewDetails}
          >
            View Details
            <svg className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      <div className="relative space-y-2">
        <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-slate-500">
          <span>Safety Score</span>
          <span>{100 - probPercent}/100</span>
        </div>
        <div className="probability-bar h-3 bg-slate-200 dark:bg-slate-800/50 ring-1 ring-slate-300 dark:ring-white/5">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-1000 ease-out"
            style={{ width: `${probPercent}%` }}
          >
            <div className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-slate-900 bg-white shadow-lg" />
          </div>
        </div>
      </div>

      <div className="relative">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Intelligence Fusion</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {Object.entries(data.fusion).map(([source, details]) => (
            <li key={source} className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white/70 p-3 transition-colors hover:border-slate-300 hover:bg-white dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-white/10 dark:hover:bg-white/10">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${details.score > 0.7 ? 'bg-rose-500' : details.score > 0.3 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                <div>
                  <p className="font-semibold capitalize text-slate-900 dark:text-slate-200">{source}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-500">{details.label}</p>
                </div>
              </div>
              <span className="font-mono text-sm font-medium text-slate-600 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white">
                {Math.round(details.score * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};

export default AnalysisCard;
