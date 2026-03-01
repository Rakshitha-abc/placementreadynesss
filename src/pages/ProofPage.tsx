import React from "react";
import { ShieldCheck, History, Clock } from "lucide-react";

export const ProofPage: React.FC = () => {
    return (
        <div className="flex h-full flex-col items-center justify-center bg-slate-950 p-6 text-center">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Project Artifacts</h1>
            <p className="mt-4 max-w-md text-slate-400">
                This section will contain your build history, export logs, and AI generation
                proofs once the core engine is fully implemented.
            </p>

            <div className="mt-12 w-full max-w-xl space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/30 p-4 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-500">
                                <History className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <div className="h-2 w-32 rounded bg-slate-800 mb-2" />
                                <div className="h-1.5 w-48 rounded bg-slate-800/50" />
                            </div>
                        </div>
                        <Clock className="h-4 w-4 text-slate-700" />
                    </div>
                ))}
            </div>

            <p className="mt-8 text-[11px] font-bold uppercase tracking-widest text-slate-600">
                Status: Implementation Pending Section 8
            </p>
        </div>
    );
};
