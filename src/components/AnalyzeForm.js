import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import AnalysisCard from '@components/AnalysisCard';
import { analyzeMockRequest } from '@utils/mockApi';
const modeCopy = {
    url: '4-source fusion: DistilBERT + Pipeline + Graph + OTX with threat intelligence and domain analysis.',
    text: 'DistilBERT NLP model (cybersectony/phishing-email-detection-distilbert_v2.4.1) with calibrated probabilities.',
    image: 'Enhanced OCR (Tesseract + EasyOCR + PaddleOCR) + YOLOv5/v8 brand detection. Live soon.'
};
const AnalyzeForm = ({ compact = false, onComplete, showInlineResult = true }) => {
    const [mode, setMode] = useState('url');
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const validate = () => {
        if (!value.trim()) {
            setError('Provide a URL or payload to analyze.');
            return false;
        }
        if (mode === 'url' && !/^https?:\/\//i.test(value.trim())) {
            setError('Enter a valid URL that includes http(s)://');
            return false;
        }
        setError('');
        return true;
    };
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        if (mode === 'image') {
            setError('Image ingestion not available in this preview build.');
            return;
        }
        if (!validate())
            return;
        setLoading(true);
        setResult(null);
        try {
            const response = await analyzeMockRequest({ mode, value: value.trim() });
            setResult(response);
            onComplete?.(response);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("section", { id: "analyze", className: `glass-surface w-full rounded-3xl p-6 shadow-xl transition-all duration-500 dark:shadow-2xl dark:shadow-black/50 ${compact ? '' : 'lg:p-8'}`, "aria-label": "Analyze suspicious content", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-brand-500 dark:text-brand-300", children: "Real-Time Analysis" }), _jsx("h2", { className: "text-xl font-bold text-slate-900 dark:text-white", children: "Multi-modal AI detection" })] }), _jsx("div", { className: "flex gap-1 rounded-full border border-slate-200 bg-white/80 p-1.5 text-xs backdrop-blur-md shadow-sm dark:border-white/10 dark:bg-slate-950/50", children: ['url', 'text', 'image'].map((item) => (_jsx("button", { type: "button", className: `relative rounded-full px-4 py-1.5 capitalize transition-all duration-300 ${mode === item ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg dark:bg-white dark:text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10'}`, onClick: () => {
                                setMode(item);
                                setResult(null);
                                setError('');
                                setValue('');
                            }, "aria-pressed": mode === item, "aria-label": `${item} mode`, children: item }, item))) })] }), _jsx("div", { className: "mt-6 min-h-[3rem]", children: _jsx("p", { className: "text-sm leading-relaxed text-slate-600 dark:text-slate-300", "aria-live": "polite", children: modeCopy[mode] }) }), _jsxs("form", { className: "mt-6 space-y-6", onSubmit: handleSubmit, children: [mode === 'text' ? (_jsxs("label", { className: "block", children: [_jsx("span", { className: "text-sm font-medium text-slate-700 dark:text-white/80", children: "Paste content" }), _jsx("textarea", { className: "focus-ring mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 p-4 text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors hover:border-brand-300 hover:bg-white focus:border-brand-500 dark:border-white/10 dark:bg-slate-950/50 dark:text-white dark:placeholder:text-white/20 dark:hover:bg-slate-950/70", rows: compact ? 4 : 6, value: value, onChange: (e) => setValue(e.target.value), placeholder: "Paste email headers, body text, or suspicious messages here...", required: true })] })) : (_jsxs("label", { className: "block", children: [_jsx("span", { className: "text-sm font-medium text-slate-700 dark:text-white/80", children: "Suspicious URL" }), _jsx("input", { className: "focus-ring mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 p-4 text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors hover:border-brand-300 hover:bg-white focus:border-brand-500 dark:border-white/10 dark:bg-slate-950/50 dark:text-white dark:placeholder:text-white/20 dark:hover:bg-slate-950/70", type: "url", value: value, onChange: (e) => setValue(e.target.value), placeholder: "https://suspicious-site.com/login", required: true })] })), mode === 'image' && (_jsx("div", { className: "rounded-xl border border-amber-500/20 bg-amber-500/10 p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("svg", { className: "mt-0.5 h-5 w-5 text-amber-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }), _jsx("p", { className: "text-sm text-amber-200", children: "Image analysis available via backend API. Frontend integration coming soon." })] }) })), error && (_jsxs("div", { role: "alert", className: "flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-300", children: [_jsx("svg", { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), error] })), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 pt-2", children: [_jsxs("button", { type: "submit", className: "btn-primary group relative w-full overflow-hidden sm:w-auto", disabled: loading, children: [_jsx("span", { className: "relative z-10 flex items-center gap-2", children: loading ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "h-4 w-4 animate-spin", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Analyzing..."] })) : (_jsxs(_Fragment, { children: ["Analyze with AI", _jsx("svg", { className: "h-4 w-4 transition-transform group-hover:translate-x-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M14 5l7 7m0 0l-7 7m7-7H3" }) })] })) }), _jsx("span", { className: "absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" })] }), _jsx("span", { className: "text-xs font-mono text-slate-600 dark:text-slate-500", children: "~24.7ms text \u00B7 <100ms URL \u00B7 model v2.4.1" })] })] }), loading && (_jsxs("div", { className: "mt-8 space-y-4", "aria-live": "polite", "aria-label": "Loading analysis", children: [_jsx("div", { className: "flex gap-2", children: [...Array(3)].map((_, idx) => (_jsx("div", { className: "h-2 w-2 animate-bounce rounded-full bg-brand-400", style: { animationDelay: `${idx * 0.1}s` } }, idx))) }), _jsx("div", { className: "h-32 w-full animate-pulse rounded-2xl bg-white/5" })] })), showInlineResult && result && !loading && (_jsx("div", { className: "mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", "aria-live": "polite", children: _jsx(AnalysisCard, { data: result }) }))] }));
};
export default AnalyzeForm;
