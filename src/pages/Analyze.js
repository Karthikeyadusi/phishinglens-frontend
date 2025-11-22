import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AnalyzeForm from '@components/AnalyzeForm';
import AnalysisCard from '@components/AnalysisCard';
import ScrollFade from '@components/ScrollFade';
const DetailsModal = ({ open, onClose, data }) => {
    const modalRef = useRef(null);
    useEffect(() => {
        if (!open || !modalRef.current)
            return;
        const focusable = modalRef.current.querySelectorAll('button, [href], textarea, [tabindex]:not([tabindex="-1"])');
        focusable[0]?.focus();
        const handleKeydown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
            if (event.key === 'Tab' && focusable.length) {
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last?.focus();
                }
                else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first?.focus();
                }
            }
        };
        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    }, [open, onClose]);
    return (_jsx(AnimatePresence, { children: open && data && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", role: "dialog", "aria-modal": "true", "aria-labelledby": "analysis-details-title", children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: onClose, className: "absolute inset-0 bg-slate-950/80 backdrop-blur-sm" }), _jsxs(motion.div, { ref: modalRef, initial: { opacity: 0, scale: 0.95, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 20 }, transition: { type: 'spring', duration: 0.5 }, className: "glass-surface relative w-full max-w-2xl overflow-hidden rounded-3xl p-0 text-slate-900 shadow-2xl dark:text-white", children: [_jsx("div", { className: "border-b border-slate-200 bg-white/90 p-6 dark:border-white/5 dark:bg-white/5", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-brand-600 dark:text-brand-300", children: "Analysis details" }), _jsxs("h3", { id: "analysis-details-title", className: "mt-1 text-2xl font-bold", children: ["Request ", data.request_id.split('-')[0]] })] }), _jsxs("button", { type: "button", onClick: onClose, className: "group rounded-full border border-slate-200 bg-white/70 p-2 text-slate-500 transition-colors hover:bg-white hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white/70", children: [_jsx("span", { className: "sr-only", children: "Close modal" }), _jsx("svg", { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })] })] }) }), _jsxs("div", { className: "grid gap-6 p-6 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-2", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "font-medium text-slate-900 dark:text-white", children: "Detected brands" }), data.detected_brands.length ? (_jsx("ul", { className: "space-y-1", children: data.detected_brands.map((brand) => (_jsxs("li", { className: "flex items-center gap-2", children: [_jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-brand-400" }), brand] }, brand))) })) : (_jsx("p", { className: "italic text-slate-400 dark:text-slate-500", children: "No brands detected" }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "font-medium text-slate-900 dark:text-white", children: "Visual reasons" }), data.visual_reasons.length ? (_jsx("ul", { className: "space-y-1", children: data.visual_reasons.map((reason) => (_jsxs("li", { className: "flex items-center gap-2", children: [_jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-amber-400" }), reason] }, reason))) })) : (_jsx("p", { className: "italic text-slate-400 dark:text-slate-500", children: "No visual flags" }))] }), _jsxs("div", { className: "space-y-2 md:col-span-2", children: [_jsx("p", { className: "font-medium text-slate-900 dark:text-white", children: "Extracted URLs" }), data.extracted_urls.length ? (_jsx("div", { className: "max-h-32 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-950/30", children: _jsx("ul", { className: "space-y-1 font-mono text-xs", children: data.extracted_urls.map((url) => (_jsx("li", { className: "break-all text-slate-600 dark:text-slate-300", children: url }, url))) }) })) : (_jsx("p", { className: "italic text-slate-400 dark:text-slate-500", children: "No URLs extracted" }))] }), _jsx("div", { className: "md:col-span-2", children: _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400", children: "Model Version" }), _jsx("p", { className: "font-mono text-brand-500 dark:text-brand-300", children: data.model_version })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400", children: "Timestamp" }), _jsx("p", { className: "font-medium text-slate-900 dark:text-white", children: new Date(data.timestamp).toLocaleString() })] })] }) })] })] })] })) }));
};
const Analyze = () => {
    const [latest, setLatest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleComplete = useCallback((response) => {
        setLatest(response);
        setIsModalOpen(false);
    }, []);
    return (_jsxs("div", { className: "mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-20 pt-10 text-slate-900 dark:text-white sm:px-8", children: [_jsx(ScrollFade, { children: _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-300", children: "Multi-Modal Detection" }), _jsxs("h1", { className: "text-4xl font-black text-slate-900 dark:text-white sm:text-5xl", children: ["4-Source ", _jsx("span", { className: "text-gradient-brand", children: "fusion analysis" })] }), _jsx("p", { className: "max-w-3xl text-lg text-slate-600 dark:text-slate-300", children: "Analyze URLs, text, and images with AI/ML models. Results combine Scanner + HuggingFace + Graph + OTX intelligence with 2-of-4 consensus voting." })] }) }), _jsxs("div", { className: "grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]", children: [_jsx(ScrollFade, { children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r from-brand-500 to-purple-600 opacity-20 blur-xl" }), _jsx("div", { className: "relative rounded-[2rem] bg-white/90 p-px dark:bg-slate-950/60", children: _jsx(AnalyzeForm, { showInlineResult: false, onComplete: handleComplete }) })] }) }), _jsx(ScrollFade, { delay: 0.1, children: _jsx("div", { className: "sticky top-24", children: latest ? (_jsx(AnalysisCard, { data: latest, compact: true, onViewDetails: () => setIsModalOpen(true) })) : (_jsxs("div", { className: "glass-surface flex h-64 flex-col items-center justify-center rounded-3xl p-8 text-center text-slate-600 dark:text-slate-400", children: [_jsx("div", { className: "mb-4 rounded-full border border-slate-200 bg-white/70 p-4 text-slate-400 dark:border-white/10 dark:bg-white/5", children: _jsx("svg", { className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }), _jsx("p", { className: "font-semibold", children: "Awaiting submission\u2026" }), _jsx("p", { className: "mt-2 text-sm text-slate-500 dark:text-slate-400", children: "Results will show verdict from Scanner, HF transformer, Graph GNN, and OTX feeds." })] })) }) })] }), _jsx(DetailsModal, { open: isModalOpen, onClose: () => setIsModalOpen(false), data: latest })] }));
};
export default Analyze;
