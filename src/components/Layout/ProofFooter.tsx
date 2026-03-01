import React from "react";
import { ShieldCheck, Zap } from "lucide-react";

export const ProofFooter: React.FC = () => {
    return (
        <footer className="mt-auto border-t border-slate-800 bg-slate-900/50 px-8 py-6 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                        <ShieldCheck className="h-4 w-4" />
                        Verified Build Track
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                        <Zap className="h-4 w-4" />
                        AI Optimized
                    </div>
                </div>

                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    © 2026 AI Resume Builder — Build Track v1.0
                </div>
            </div>
        </footer>
    );
};
