import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Layout, Eye, ShieldCheck, FileText } from "lucide-react";

export const MainLayout: React.FC = () => {
    return (
        <div className="flex h-screen flex-col bg-slate-950 text-slate-50">
            <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/50 px-8 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">AI Resume Builder</span>
                    </Link>
                </div>

                <nav className="flex items-center gap-1">
                    <NavLink
                        to="/builder"
                        className={({ isActive }) =>
                            `flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${isActive ? "bg-primary text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`
                        }
                    >
                        <Layout className="h-4 w-4" />
                        Builder
                    </NavLink>
                    <NavLink
                        to="/preview"
                        className={({ isActive }) =>
                            `flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${isActive ? "bg-primary text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`
                        }
                    >
                        <Eye className="h-4 w-4" />
                        Preview
                    </NavLink>
                    <NavLink
                        to="/proof"
                        className={({ isActive }) =>
                            `flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${isActive ? "bg-primary text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`
                        }
                    >
                        <ShieldCheck className="h-4 w-4" />
                        Proof
                    </NavLink>
                </nav>

                <div className="w-40 flex justify-end">
                    <Link
                        to="/rb/01-problem"
                        className="text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-primary transition-colors"
                    >
                        Build Track →
                    </Link>
                </div>
            </header>

            <main className="flex-1 overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
};
