import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { BUILD_STEPS } from "../../types";

export const ContextHeader: React.FC = () => {
    const location = useLocation();
    const currentStep = BUILD_STEPS.find(s => s.path === location.pathname);
    const isProofPage = location.pathname === "/rb/proof";

    return (
        <div className="border-b border-slate-800 bg-slate-900/30 px-8 py-3 backdrop-blur-sm">
            <div className="mx-auto flex max-w-6xl items-center gap-2 text-xs font-medium">
                <Link to="/" className="text-slate-500 hover:text-white transition-colors">
                    <Home className="h-3.5 w-3.5" />
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-slate-700" />
                <span className="text-slate-500">Resume Builder</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-700" />
                <span className="text-slate-200">
                    {isProofPage ? "Shipment Proof" : currentStep?.title || "Walkthrough"}
                </span>
            </div>
        </div>
    );
};
