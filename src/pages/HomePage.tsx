import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";

export const HomePage: React.FC = () => {
    return (
        <div className="relative flex min-h-full flex-col items-center justify-center overflow-hidden px-6 text-center">
            {/* Background Glow */}
            <div className="absolute top-1/4 -z-10 h-64 w-64 rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 -z-10 h-72 w-72 rounded-full bg-blue-500/10 blur-[130px]" />

            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Resume Builder
            </div>

            <h1 className="mt-8 max-w-4xl text-5xl font-extrabold tracking-tight text-white md:text-7xl">
                Build a Resume That <br />
                <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent italic">
                    Gets Read.
                </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-slate-400">
                Stop fighting with margins. Our intelligent builder handles the design,
                leaving you to focus on your impact.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                    to="/builder"
                    className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-white transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(79,70,229,0.4)]"
                >
                    Start Building
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <button className="rounded-xl border border-slate-700 bg-slate-900/50 px-8 py-4 text-lg font-bold text-slate-300 transition-all hover:border-slate-500 hover:text-white">
                    View Templates
                </button>
            </div>

            <div className="mt-20 grid grid-cols-1 gap-12 text-left md:grid-cols-3">
                <div className="space-y-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-primary">
                        <Zap className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Instant Preview</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        See your changes in real-time with our high-fidelity layout engine.
                    </p>
                </div>
                <div className="space-y-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-emerald-400">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">AI Content Support</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Generate impactful bullet points with zero effort using GPT-4o.
                    </p>
                </div>
                <div className="space-y-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-blue-400">
                        <Shield className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">ATS Optimized</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Our layouts are machine-readable and built for hiring systems.
                    </p>
                </div>
            </div>
        </div>
    );
};
