import React, { useState } from "react";
import { Copy, ExternalLink, ThumbsUp, AlertCircle, Image as ImageIcon, Check } from "lucide-react";

interface BuildPanelProps {
    promptText: string;
    stepNumber: number;
    onSuccess?: () => void;
    onShare?: () => void;
}

export const BuildPanel: React.FC<BuildPanelProps> = ({ promptText, stepNumber, onSuccess, onShare }) => {
    const [copied, setCopied] = useState(false);

    const handleItWorked = () => {
        localStorage.setItem(`rb_step_${stepNumber}_artifact`, JSON.stringify({
            completedAt: new Date().toISOString(),
            prompt: promptText
        }));
        // Dispatch custom event to notify BuildStepPage
        window.dispatchEvent(new CustomEvent('artifact-uploaded', { detail: { stepNumber } }));
        if (onSuccess) onSuccess();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(promptText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-6 rounded-xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur-sm font-inter">
            <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Copy This Into Lovable
                </label>
                <div className="relative">
                    <textarea
                        readOnly
                        value={promptText}
                        className="h-48 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                        onClick={handleCopy}
                        className="absolute right-3 top-3 rounded-md bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                        {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                Build in Lovable
                <ExternalLink className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-3 gap-2">
                <button
                    onClick={handleItWorked}
                    className="flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-800/30 p-3 text-slate-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all font-outfit"
                >
                    <ThumbsUp className="h-5 w-5" />
                    <span className="text-[10px] font-bold uppercase">It Worked</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-800/30 p-3 text-slate-400 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400 transition-all font-outfit">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-[10px] font-bold uppercase">Error</span>
                </button>
                <button
                    onClick={onShare}
                    className="flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-800/30 p-3 text-slate-400 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400 transition-all font-outfit"
                >
                    <ImageIcon className="h-5 w-5" />
                    <span className="text-[10px] font-bold uppercase">Screenshot</span>
                </button>
            </div>
        </div>
    );
};
