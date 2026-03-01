import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { TopBar } from "./TopBar";
import { ContextHeader } from "./ContextHeader";
import { BuildPanel } from "./BuildPanel";
import { ProofFooter } from "./ProofFooter";
import { BUILD_STEPS } from "../../types";

export const BuildLayout: React.FC = () => {
    const location = useLocation();
    const currentStep = BUILD_STEPS.find((s) => s.path === location.pathname);
    const stepNumber = currentStep ? currentStep.stepNumber : 0;

    return (
        <div className="flex h-screen flex-col bg-slate-950 text-slate-50 overflow-hidden">
            <TopBar stepNumber={stepNumber} totalSteps={BUILD_STEPS.length} />
            <ContextHeader />

            <div className="flex flex-1 overflow-hidden">
                {/* Main Workspace (Expands if no step panel) */}
                <div className={`${stepNumber > 0 ? 'flex-[0.7] border-r border-slate-800' : 'flex-1'} overflow-y-auto bg-slate-950 transition-all duration-300`}>
                    <div className="mx-auto w-full max-w-4xl px-12 py-10">
                        <Outlet />
                    </div>
                </div>

                {/* Secondary Build Panel (30%) */}
                {stepNumber > 0 && (
                    <aside className="flex-[0.3] overflow-y-auto bg-slate-900/10 p-6">
                        <BuildPanel
                            stepNumber={stepNumber}
                            promptText={`[AI Resume Builder - Step ${stepNumber}]
Objective: Implement ${currentStep?.title}
Instructions: Create the necessary components and logic to handle the ${currentStep?.id} phase.
Requirements:
1. Ensure premium aesthetics
2. Handle edge cases
3. Integrate with the existing routing system`}
                        />
                    </aside>
                )}
            </div>

            <ProofFooter />
        </div>
    );
};
