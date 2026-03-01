import React from "react";

interface TopBarProps {
    stepNumber: number;
    totalSteps: number;
}

export const TopBar: React.FC<TopBarProps> = ({ stepNumber, totalSteps }) => {
    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/50 px-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold tracking-tight text-white">AI Resume Builder</h2>
            </div>

            <div className="flex flex-col items-center">
                <span className="text-xs font-medium uppercase tracking-widest text-slate-400">Project 3</span>
                <span className="text-sm font-semibold text-slate-100">
                    {stepNumber > 0 ? `Step ${stepNumber} of ${totalSteps}` : "Final Submission"}
                </span>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1 text-xs font-medium text-slate-300">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Session
                </div>
            </div>
        </header>
    );
};
