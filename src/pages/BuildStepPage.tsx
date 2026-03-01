import React, { useEffect, useState } from "react";
import type { BuildStep } from "../types";
import { BUILD_STEPS } from "../types";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Lock, ArrowRight, ArrowLeft } from "lucide-react";

interface BuildStepPageProps {
    step: BuildStep;
}

export const BuildStepPage: React.FC<BuildStepPageProps> = ({ step }) => {
    const navigate = useNavigate();
    const [isCompleted, setIsCompleted] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        // Check if step is locked (previous steps must be completed)
        const checkGating = () => {
            for (let i = 1; i < step.stepNumber; i++) {
                const artifact = localStorage.getItem(`rb_step_${i}_artifact`);
                if (!artifact) {
                    setIsLocked(true);
                    return;
                }
            }
            setIsLocked(false);
        };

        const checkCompletion = () => {
            const artifact = localStorage.getItem(`rb_step_${step.stepNumber}_artifact`);
            setIsCompleted(!!artifact);
        };

        checkGating();
        checkCompletion();

        // Listen for storage changes (in case of multi-tab or panel updates)
        window.addEventListener("storage", checkGating);
        window.addEventListener("storage", checkCompletion);

        return () => {
            window.removeEventListener("storage", checkGating);
            window.removeEventListener("storage", checkCompletion);
        };
    }, [step]);

    const handleNext = () => {
        const nextStep = BUILD_STEPS.find((s) => s.stepNumber === step.stepNumber + 1);
        if (nextStep) {
            navigate(nextStep.path);
        } else {
            navigate("/rb/proof");
        }
    };

    const handlePrev = () => {
        const prevStep = BUILD_STEPS.find((s) => s.stepNumber === step.stepNumber - 1);
        if (prevStep) {
            navigate(prevStep.path);
        }
    };

    // Trigger manual success (mocking the build panel's "It Worked" button functionality)
    // In a real app, this would be triggered via context or events
    useEffect(() => {
        const handleArtifactUploaded = (e: any) => {
            if (e.detail?.stepNumber === step.stepNumber) {
                setIsCompleted(true);
            }
        };
        window.addEventListener('artifact-uploaded', handleArtifactUploaded);
        return () => window.removeEventListener('artifact-uploaded', handleArtifactUploaded);
    }, [step.stepNumber]);

    if (isLocked) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center">
                <div className="mb-6 rounded-full bg-slate-900 p-6 text-slate-700">
                    <Lock className="h-12 w-12" />
                </div>
                <h2 className="text-2xl font-bold text-slate-200">Step Locked</h2>
                <p className="mt-2 max-w-md text-slate-500">
                    Please complete all previous steps before proceeding to {step.title}.
                </p>
                <button
                    onClick={() => navigate(BUILD_STEPS[0].path)}
                    className="mt-8 rounded-lg bg-slate-800 px-6 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                    Return to Step 1
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-xs font-bold text-primary">
                        0{step.stepNumber}
                    </span>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white">{step.title}</h1>
                </div>
                <p className="max-w-2xl text-lg text-slate-400">
                    Implement the core foundations for {step.title.toLowerCase()} in your AI Resume Builder project.
                    Follow the instructions in the build panel to generate the required artifacts.
                </p>
            </div>

            <div className="grid gap-6">
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-10">
                    <h3 className="text-xl font-bold text-slate-100">Implementation Guide</h3>
                    <ul className="mt-6 space-y-4 text-slate-400">
                        <li className="flex gap-3">
                            <CheckCircle2 className={`h-5 w-5 shrink-0 ${isCompleted ? 'text-emerald-500' : 'text-slate-700'}`} />
                            <span>Copy the prompt from the right panel and paste it into Lovable.</span>
                        </li>
                        <li className="flex gap-3">
                            <CheckCircle2 className={`h-5 w-5 shrink-0 ${isCompleted ? 'text-emerald-500' : 'text-slate-700'}`} />
                            <span>Verify the implementation and click "It Worked" to advance.</span>
                        </li>
                        <li className="flex gap-3">
                            <CheckCircle2 className={`h-5 w-5 shrink-0 ${isCompleted ? 'text-emerald-500' : 'text-slate-700'}`} />
                            <span>Capture a screenshot of your progress and upload it to the build panel.</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-8">
                <button
                    onClick={handlePrev}
                    disabled={step.stepNumber === 1}
                    className="group flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-white disabled:opacity-0"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Previous Step
                </button>

                <button
                    onClick={handleNext}
                    disabled={!isCompleted}
                    className={`group flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-bold transition-all ${isCompleted
                        ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-400'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    {step.stepNumber === BUILD_STEPS.length ? 'Go to Proof' : 'Next Step'}
                    <ArrowRight className={`h-4 w-4 transition-transform ${isCompleted ? 'group-hover:translate-x-1' : ''}`} />
                </button>
            </div>
        </div>
    );
};
