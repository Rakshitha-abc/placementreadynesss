import React from 'react';
import { ArrowUpCircle, Sparkles } from 'lucide-react';

interface ImprovementPanelProps {
    suggestions: string[];
}

export const ImprovementPanel: React.FC<ImprovementPanelProps> = ({ suggestions }) => {
    if (suggestions.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Top 3 Improvements
                </h4>
            </div>
            <div className="space-y-3">
                {suggestions.map((s, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-xl bg-emerald-500/5 p-4 border border-emerald-500/10 shadow-sm transition-all hover:bg-emerald-500/10">
                        <ArrowUpCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                        <span className="text-xs font-bold text-emerald-100/90 leading-tight">{s}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
