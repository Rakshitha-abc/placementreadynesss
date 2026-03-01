import React, { useState } from "react";
import { useResume } from "../context/ResumeContext";
import { Printer, Layout, AlertCircle, Check, Copy, FileText, Github, Globe, Sparkles, TrendingUp } from "lucide-react";
import type { ResumeData, ResumeTemplate, Skills } from "../types/resume";
import { calculateATSScore } from "../utils/atsScorer";
import { CircularScore } from "../components/common/CircularScore";
import { ImprovementPanel } from "../components/common/ImprovementPanel";

export const PreviewPage: React.FC = () => {
    const { resumeData, setResumeData } = useResume();
    const [showWarning, setShowWarning] = useState(false);
    const [copied, setCopied] = useState(false);
    const [exportToast, setExportToast] = useState(false);

    const atsResult = calculateATSScore(resumeData);

    const setTemplate = (template: ResumeTemplate) => {
        setResumeData((prev: ResumeData) => ({ ...prev, template }));
    };

    const currentTemplate = resumeData.template || 'modern';

    const validateBeforeAction = (action: () => void) => {
        const isMissingName = !resumeData.personal.name.trim();
        const isMissingContent = resumeData.experience.length === 0 && resumeData.projects.length === 0;

        if (isMissingName || isMissingContent) {
            setShowWarning(true);
            action();
        } else {
            action();
        }
    };

    const handlePrint = () => {
        validateBeforeAction(() => {
            setExportToast(true);
            setTimeout(() => setExportToast(false), 3000);
            window.print();
        });
    };

    const handleCopyAsText = () => {
        validateBeforeAction(() => {
            const { personal, summary, education, experience, projects, skills, links } = resumeData;

            const eduText = education.length > 0
                ? `EDUCATION\n${education.map(edu => `- ${edu.school}: ${edu.degree} (${edu.year})`).join('\n')}\n\n`
                : '';

            const expText = experience.length > 0
                ? `EXPERIENCE\n${experience.map(exp => `- ${exp.role} @ ${exp.company} (${exp.duration})\n  ${exp.description}`).join('\n\n')}\n\n`
                : '';

            const projText = projects.length > 0
                ? `PROJECTS\n${projects.map(proj => `- ${proj.name} (${proj.techStack.join(', ')})\n  ${proj.description}\n  Link: ${proj.liveUrl || proj.githubUrl}`).join('\n\n')}\n\n`
                : '';

            const skillsText = `SKILLS\n- Technical: ${skills.technical.join(', ')}\n- Soft: ${skills.soft.join(', ')}\n- Tools: ${skills.tools.join(', ')}\n\n`;

            const linksText = (links.github || links.linkedin)
                ? `LINKS\n${links.github ? `- GitHub: ${links.github}\n` : ''}${links.linkedin ? `- LinkedIn: ${links.linkedin}\n` : ''}\n`
                : '';

            const nameHeader = (personal.name || 'YOUR NAME').toUpperCase();
            const contactLine = [personal.email, personal.phone, personal.location].filter(Boolean).join(' | ');

            const text = `
${nameHeader}
${contactLine}

SUMMARY
${summary || 'Professional summary not provided.'}

${expText}${eduText}${projText}${skillsText}${linksText}`.trim();

            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        });
    };

    return (
        <div className="h-full overflow-y-auto bg-slate-900/40 px-6 py-12 resume-container">
            <div className="mx-auto max-w-4xl space-y-8 pb-12">
                {/* Export Toast */}
                {exportToast && (
                    <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-500 shadow-2xl animate-in slide-in-from-right-2 duration-300 print:hidden">
                        <Check className="h-5 w-5" />
                        <p className="text-sm font-bold">PDF export ready! Check your downloads.</p>
                    </div>
                )}

                {/* Validation Warning */}
                {showWarning && (
                    <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-500 animate-in fade-in slide-in-from-top-2 duration-300 print:hidden">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p className="text-sm font-medium">Your resume may look incomplete. Consider adding your name and at least one experience or project.</p>
                        <button onClick={() => setShowWarning(false)} className="ml-auto text-xs font-bold uppercase tracking-widest hover:underline">Dismiss</button>
                    </div>
                )}

                {/* ATS Scoring Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 rounded-2xl border border-slate-800 bg-slate-950/50 p-8 shadow-2xl backdrop-blur-xl print:hidden">
                    <div className="flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800 pb-8 lg:pb-0 lg:pr-8">
                        <CircularScore
                            score={atsResult.score}
                            label={atsResult.label}
                            color={atsResult.color}
                        />
                    </div>
                    <div className="lg:col-span-2 space-y-6 lg:pl-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-wider text-white font-outfit">Resume Optimization</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">ATS Compatibility Analysis</p>
                            </div>
                        </div>
                        <ImprovementPanel suggestions={atsResult.suggestions} />
                        {atsResult.score === 100 && (
                            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-500">
                                <Sparkles className="h-5 w-5" />
                                <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">Perfect Score! Your resume is fully optimized for ATS systems.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions & Pickers */}
                <div className="flex flex-col gap-8 rounded-xl border border-slate-800 bg-slate-950 p-8 shadow-xl preview-actions print:hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-white uppercase tracking-wider font-outfit">Export Center</p>
                                <p className="text-xs uppercase font-bold text-slate-500 tracking-widest">Select your style & download</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={handleCopyAsText} className="flex items-center gap-2 rounded-lg bg-slate-800 px-6 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700 transition-all border border-slate-700">
                                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                                {copied ? "Copied!" : "Copy as Text"}
                            </button>
                            <button onClick={handlePrint} className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-primary/90 transition-all shadow-xl">
                                <Printer className="h-4 w-4" />
                                Print / Save as PDF
                            </button>
                        </div>
                    </div>

                    <div className="h-px bg-slate-800" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Layout className="h-3.5 w-3.5" />
                                1. Choose Layout
                            </label>
                            <div className="flex gap-4">
                                {(['classic', 'modern', 'minimal'] as const).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTemplate(t)}
                                        className={`group relative flex flex-col items-center gap-2 rounded-lg border-2 p-1.5 transition-all ${currentTemplate === t ? 'border-primary ring-1 ring-primary/20' : 'border-slate-800 hover:border-slate-700'
                                            }`}
                                    >
                                        <div className={`h-20 w-14 rounded bg-slate-900 overflow-hidden relative ${currentTemplate === t ? 'opacity-100' : 'opacity-40 group-hover:opacity-60'}`}>
                                            {t === 'classic' && <div className="p-1 space-y-1"><div className="h-1 w-full bg-slate-700" /><div className="h-0.5 w-full bg-slate-800" /><div className="h-0.5 w-full bg-slate-800" /></div>}
                                            {t === 'modern' && <div className="flex h-full"><div className="w-1/3 bg-slate-700" /><div className="flex-1 p-1"><div className="h-1 w-2/3 bg-slate-600" /></div></div>}
                                            {t === 'minimal' && <div className="p-2 space-y-1"><div className="h-1 w-1/2 bg-slate-700" /><div className="h-0.5 w-full bg-slate-800" /></div>}
                                        </div>
                                        <span className={`text-[9px] font-bold uppercase tracking-wider ${currentTemplate === t ? 'text-primary' : 'text-slate-500'}`}>{t}</span>
                                        {currentTemplate === t && <Check className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary p-0.5 text-white" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Sparkles className="h-3.5 w-3.5" />
                                2. Color Theme
                            </label>
                            <div className="flex gap-4 items-center h-full pb-4">
                                {[
                                    { name: 'Teal', value: 'hsl(168, 60%, 40%)' },
                                    { name: 'Navy', value: 'hsl(220, 60%, 35%)' },
                                    { name: 'Burgundy', value: 'hsl(345, 60%, 35%)' },
                                    { name: 'Forest', value: 'hsl(150, 50%, 30%)' },
                                    { name: 'Charcoal', value: 'hsl(0, 0%, 25%)' }
                                ].map((color) => (
                                    <button
                                        key={color.value}
                                        onClick={() => setResumeData(prev => ({ ...prev, themeColor: color.value }))}
                                        className={`h-8 w-8 rounded-full transition-all hover:scale-110 flex items-center justify-center ${resumeData.themeColor === color.value ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110' : ''}`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    >
                                        {resumeData.themeColor === color.value && <Check className="h-4 w-4 text-white" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resume Sheet */}
                <div className="mx-auto min-h-[1123px] w-full max-w-[794px] bg-white p-12 text-black shadow-2xl transition-all font-inter resume-sheet overflow-hidden flex flex-col">
                    {/* Template: MODERN */}
                    {currentTemplate === 'modern' && (
                        <div className="flex h-full gap-10">
                            <div className="w-[30%] h-full flex flex-col pt-8 pr-6 border-r border-slate-100" style={{ backgroundColor: `${resumeData.themeColor}05` }}>
                                <div className="space-y-10">
                                    <div className="h-16 w-16 flex items-center justify-center rounded-2xl text-white shadow-lg" style={{ backgroundColor: resumeData.themeColor }}>
                                        <span className="text-3xl font-black">{resumeData.personal.name ? resumeData.personal.name[0] : 'U'}</span>
                                    </div>

                                    <section className="space-y-4">
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: resumeData.themeColor }}>Contact Details</h4>
                                        <div className="space-y-3 text-[12px] text-slate-600 leading-relaxed break-words">
                                            <p>{resumeData.personal.email}</p>
                                            <p>{resumeData.personal.phone}</p>
                                            <p>{resumeData.personal.location}</p>
                                        </div>
                                    </section>

                                    <section className="space-y-6">
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: resumeData.themeColor }}>Skills & Expertise</h4>
                                        {(Object.entries(resumeData.skills) as [keyof Skills, string[]][]).map(([key, skills]) => skills.length > 0 && (
                                            <div key={key} className="space-y-3">
                                                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{key}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {skills.map((s, i) => (
                                                        <span key={i} className="px-2 py-1 text-[11px] font-bold rounded border border-slate-200 bg-white shadow-sm">{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </section>

                                    {resumeData.links.github && (
                                        <section className="space-y-4">
                                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: resumeData.themeColor }}>Connectivity</h4>
                                            <p className="text-[11px] font-bold text-slate-500 truncate">GitHub: {resumeData.links.github}</p>
                                            <p className="text-[11px] font-bold text-slate-500 truncate">LinkedIn: {resumeData.links.linkedin}</p>
                                        </section>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 pt-8 space-y-10">
                                <header className="space-y-4">
                                    <h1 className="text-5xl font-black uppercase tracking-tighter" style={{ color: resumeData.themeColor }}>{resumeData.personal.name || "YOUR NAME"}</h1>
                                    <p className="text-sm text-slate-600 leading-[1.8] italic">{resumeData.summary}</p>
                                </header>

                                {resumeData.experience.length > 0 && (
                                    <section className="space-y-6">
                                        <h2 className="text-xs font-black uppercase tracking-[0.4em] border-b-2 border-slate-100 pb-2" style={{ color: resumeData.themeColor }}>Professional Experience</h2>
                                        <div className="space-y-8">
                                            {resumeData.experience.map(exp => (
                                                <div key={exp.id} className="space-y-2">
                                                    <div className="flex justify-between items-baseline font-bold text-sm">
                                                        <span className="uppercase tracking-tight text-lg">{exp.role}</span>
                                                        <span className="text-slate-400 font-medium">{exp.duration}</span>
                                                    </div>
                                                    <div className="text-sm font-black italic text-slate-400">{exp.company}</div>
                                                    <p className="text-sm text-slate-600 leading-relaxed mt-2 whitespace-pre-line">{exp.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {resumeData.projects.length > 0 && (
                                    <section className="space-y-6">
                                        <h2 className="text-xs font-black uppercase tracking-[0.4em] border-b-2 border-slate-100 pb-2" style={{ color: resumeData.themeColor }}>Key Projects</h2>
                                        <div className="space-y-8">
                                            {resumeData.projects.map(proj => (
                                                <div key={proj.id} className="space-y-3">
                                                    <div className="flex justify-between items-baseline">
                                                        <h3 className="text-md font-bold uppercase tracking-tight">{proj.name}</h3>
                                                        <div className="flex gap-4 text-[10px] text-slate-400 font-bold uppercase">
                                                            {proj.liveUrl && <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> Demo</span>}
                                                            {proj.githubUrl && <span className="flex items-center gap-1"><Github className="h-3 w-3" /> Code</span>}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-600 leading-relaxed font-light">{proj.description}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {proj.techStack.map((tech, i) => (
                                                            <span key={i} className="text-[10px] font-bold text-slate-400 border border-slate-100 px-2 py-0.5 rounded shadow-sm bg-slate-50 uppercase">{tech}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Template: CLASSIC */}
                    {currentTemplate === 'classic' && (
                        <div className="space-y-10 pt-4 font-serif">
                            <div className="text-center space-y-3 pb-6">
                                <h1 className="text-4xl font-bold tracking-tight" style={{ color: resumeData.themeColor }}>{resumeData.personal.name || "YOUR NAME"}</h1>
                                <div className="text-[11px] text-slate-600 space-x-4 font-bold uppercase tracking-widest">
                                    <span>{resumeData.personal.email}</span>
                                    <span>|</span>
                                    <span>{resumeData.personal.phone}</span>
                                    <span>|</span>
                                    <span>{resumeData.personal.location}</span>
                                </div>
                            </div>

                            {resumeData.summary && (
                                <section className="space-y-4">
                                    <h2 className="text-xs font-bold border-b-2 border-black text-center uppercase tracking-[0.3em] pb-1">Professional Qualifications</h2>
                                    <p className="text-sm leading-[1.8] text-slate-800 italic text-center px-12">{resumeData.summary}</p>
                                </section>
                            )}

                            {resumeData.experience.length > 0 && (
                                <section className="space-y-6">
                                    <h2 className="text-xs font-bold border-b-2 border-black uppercase tracking-[0.3em] pb-1">Work History</h2>
                                    <div className="space-y-10">
                                        {resumeData.experience.map(exp => (
                                            <div key={exp.id} className="space-y-2">
                                                <div className="flex justify-between font-bold text-sm">
                                                    <span className="uppercase text-lg tracking-tight">{exp.role}</span>
                                                    <span className="font-medium text-slate-500">{exp.duration}</span>
                                                </div>
                                                <div className="text-sm font-bold italic" style={{ color: resumeData.themeColor }}>{exp.company}</div>
                                                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {resumeData.skills && (
                                <section className="space-y-6">
                                    <h2 className="text-xs font-bold border-b-2 border-black uppercase tracking-[0.3em] pb-1">Technical Inventory</h2>
                                    <div className="grid grid-cols-3 gap-x-12 gap-y-4 mt-4">
                                        {(Object.entries(resumeData.skills) as [keyof Skills, string[]][]).map(([key, skills]) => skills.length > 0 && (
                                            <div key={key} className="space-y-2">
                                                <p className="text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">{key}</p>
                                                <ul className="space-y-1">
                                                    {skills.map((s, i) => (
                                                        <li key={i} className="text-[12px] text-slate-800 list-disc list-inside">{s}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}

                    {/* Template: MINIMAL */}
                    {currentTemplate === 'minimal' && (
                        <div className="space-y-16 pt-10 px-10">
                            <header className="space-y-2 border-l-[6px] pl-8" style={{ borderColor: resumeData.themeColor }}>
                                <h1 className="text-7xl font-extralight tracking-tighter lowercase leading-none" style={{ color: resumeData.themeColor }}>{resumeData.personal.name || "name"}</h1>
                                <div className="text-xs text-slate-400 flex gap-8 font-light lowercase tracking-[0.2em] pt-4">
                                    <span>{resumeData.personal.email}</span>
                                    <span>{resumeData.personal.phone}</span>
                                    <span>{resumeData.personal.location}</span>
                                </div>
                            </header>

                            <div className="space-y-20">
                                {resumeData.summary && (
                                    <section>
                                        <p className="text-xl leading-[1.6] text-slate-600 font-light max-w-[85%]">{resumeData.summary}</p>
                                    </section>
                                )}

                                <div className="grid grid-cols-1 gap-24">
                                    {resumeData.experience.length > 0 && (
                                        <section className="space-y-12">
                                            <h2 className="text-[10px] font-black uppercase text-slate-200 tracking-[0.5em] border-b border-slate-50 pb-4">experience_log</h2>
                                            <div className="space-y-16">
                                                {resumeData.experience.map(exp => (
                                                    <div key={exp.id} className="space-y-4">
                                                        <div className="flex justify-between items-end">
                                                            <div className="space-y-1">
                                                                <h3 className="text-2xl font-bold tracking-tight">{exp.role}</h3>
                                                                <p className="text-lg font-light text-slate-400">{exp.company}</p>
                                                            </div>
                                                            <span className="text-xs uppercase tracking-widest text-slate-300 font-light mb-1">{exp.duration}</span>
                                                        </div>
                                                        <p className="text-sm text-slate-500 leading-loose font-light max-w-[90%]">{exp.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    <section className="space-y-8">
                                        <h2 className="text-[10px] font-black uppercase text-slate-200 tracking-[0.5em] border-b border-slate-50 pb-4">stack_interface</h2>
                                        <div className="flex flex-wrap gap-x-12 gap-y-6">
                                            {resumeData.skills.technical.map((s, i) => (
                                                <span key={i} className="text-lg text-slate-500 lowercase font-light transition-colors hover:text-black cursor-default" style={{ borderBottom: `2px solid ${resumeData.themeColor}15` }}>{s}</span>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-auto pt-10 text-center border-t border-slate-50 print:hidden">
                        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-200 italic">
                            this masterpiece was crafted with the {currentTemplate} toolkit
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
