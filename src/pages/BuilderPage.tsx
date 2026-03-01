import React, { useMemo, useState } from "react";
import { useResume } from "../context/ResumeContext";
import { Plus, Trash2, Database, Wand2, ShieldCheck, Info, ChevronRight, Layout, Sparkles, X, ChevronDown, Github, Globe, Loader2, Check } from "lucide-react";
import type { Experience, ResumeData, Education, Project, ResumeTemplate, Skills } from "../types/resume";
import { calculateATSScore, checkBulletGuidance } from "../utils/atsScorer";

export const BuilderPage: React.FC = () => {
    const { resumeData, setResumeData, loadSampleData } = useResume();
    const [suggesting, setSuggesting] = useState(false);
    const [expandedProject, setExpandedProject] = useState<string | null>(null);

    // Deterministic ATS Scoring
    const { score, suggestions, label, color } = useMemo(() => calculateATSScore(resumeData), [resumeData]);

    const updatePersonal = (field: keyof ResumeData['personal'], value: string) => {
        setResumeData((prev: ResumeData) => ({
            ...prev,
            personal: { ...prev.personal, [field]: value }
        }));
    };

    const updateLinks = (field: keyof ResumeData['links'], value: string) => {
        setResumeData((prev: ResumeData) => ({
            ...prev,
            links: { ...prev.links, [field]: value }
        }));
    };

    const setTemplate = (template: ResumeTemplate) => {
        setResumeData((prev: ResumeData) => ({ ...prev, template }));
    };

    const addEntry = (section: 'education' | 'experience' | 'projects') => {
        const id = Math.random().toString(36).substring(2, 9);
        const newEntry = section === 'education'
            ? { id, school: "", degree: "", year: "" }
            : section === 'experience'
                ? { id, company: "", role: "", duration: "", description: "" }
                : { id, name: "", description: "", techStack: [], liveUrl: "", githubUrl: "" };

        setResumeData((prev: ResumeData) => ({
            ...prev,
            [section]: [...(prev[section] as any[]), newEntry]
        }));
        if (section === 'projects') setExpandedProject(id);
    };

    const removeEntry = (section: 'education' | 'experience' | 'projects', id: string) => {
        setResumeData((prev: ResumeData) => ({
            ...prev,
            [section]: (prev[section] as any[]).filter((e: any) => e.id !== id)
        }));
    };

    const updateEntry = (section: 'education' | 'experience' | 'projects', id: string, field: string, value: any) => {
        setResumeData((prev: ResumeData) => ({
            ...prev,
            [section]: (prev[section] as any[]).map((e: any) => e.id === id ? { ...e, [field]: value } : e)
        }));
    };

    const BulletGuidance: React.FC<{ content: string }> = ({ content }) => {
        const { needsActionVerb, needsNumbers } = checkBulletGuidance(content);
        if (!needsActionVerb && !needsNumbers) return null;

        return (
            <div className="mt-2 flex flex-wrap gap-2">
                {needsActionVerb && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        <Sparkles className="h-3 w-3" />
                        Start with an action verb (Built, Led, etc.)
                    </span>
                )}
                {needsNumbers && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded border border-indigo-400/20">
                        <Info className="h-3 w-3" />
                        Add measurable impact (numbers)
                    </span>
                )}
            </div>
        );
    };

    const handleSuggestSkills = async () => {
        setSuggesting(true);
        await new Promise(r => setTimeout(r, 1000));

        const suggestedSkills: Skills = {
            technical: ["TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"],
            soft: ["Team Leadership", "Problem Solving"],
            tools: ["Git", "Docker", "AWS"]
        };

        setResumeData(prev => ({
            ...prev,
            skills: {
                technical: Array.from(new Set([...prev.skills.technical, ...suggestedSkills.technical])),
                soft: Array.from(new Set([...prev.skills.soft, ...suggestedSkills.soft])),
                tools: Array.from(new Set([...prev.skills.tools, ...suggestedSkills.tools])),
            }
        }));
        setSuggesting(false);
    };

    const addSkill = (category: keyof Skills, skill: string) => {
        if (!skill.trim()) return;
        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [category]: Array.from(new Set([...prev.skills[category], skill.trim()]))
            }
        }));
    };

    const removeSkill = (category: keyof Skills, skill: string) => {
        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [category]: prev.skills[category].filter(s => s !== skill)
            }
        }));
    };

    const TagInput: React.FC<{
        tags: string[],
        onAdd: (tag: string) => void,
        onRemove: (tag: string) => void,
        placeholder?: string
    }> = ({ tags, onAdd, onRemove, placeholder }) => {
        const [input, setInput] = useState("");

        return (
            <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[11px] font-bold text-slate-300 border border-slate-700">
                            {tag}
                            <button onClick={() => onRemove(tag)} className="hover:text-rose-400">
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
                <input
                    placeholder={placeholder || "Type and press Enter..."}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            onAdd(input);
                            setInput("");
                        }
                    }}
                    className="w-full rounded-md border border-slate-800 bg-slate-950 p-2 text-xs text-slate-200 focus:border-primary focus:outline-none"
                />
            </div>
        );
    };

    // Safely get template with fallback
    const currentTemplate = resumeData.template || 'modern';

    return (
        <div className="flex flex-col md:flex-row h-full overflow-hidden bg-slate-950">
            {/* Left Side: Form (Scrollable) */}
            <div className="flex-1 md:flex-[0.55] overflow-y-auto border-b md:border-b-0 md:border-r border-slate-800 p-6 md:p-10 text-slate-200">
                <div className="mx-auto max-w-2xl space-y-12 pb-20">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-white">Resume Content</h2>
                            <p className="text-xs text-slate-500">Persists automatically to localStorage</p>
                        </div>
                        <button
                            onClick={loadSampleData}
                            className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-all font-outfit"
                        >
                            <Database className="h-3.5 w-3.5" />
                            Load Sample Data
                        </button>
                    </div>

                    {/* Template Switcher */}
                    <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/20 p-6">
                        <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider font-outfit">
                            <Layout className="h-4 w-4 text-primary" />
                            Select Template
                        </div>
                        <div className="flex gap-2">
                            {(['modern', 'classic', 'minimal'] as ResumeTemplate[]).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTemplate(t)}
                                    className={`flex-1 rounded-lg border py-3 text-xs font-bold uppercase tracking-widest transition-all ${currentTemplate === t
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Personal Info */}
                    <section className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 font-outfit">Personal Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                placeholder="Full Name"
                                value={resumeData.personal.name}
                                onChange={(e) => updatePersonal('name', e.target.value)}
                                className="col-span-2 rounded-lg border border-slate-800 bg-slate-900/30 p-3 text-sm text-slate-200 focus:border-primary focus:outline-none transition-colors"
                            />
                            <input
                                placeholder="Email"
                                value={resumeData.personal.email}
                                onChange={(e) => updatePersonal('email', e.target.value)}
                                className="rounded-lg border border-slate-800 bg-slate-900/30 p-3 text-sm text-slate-200 focus:border-primary focus:outline-none transition-colors"
                            />
                            <input
                                placeholder="Phone"
                                value={resumeData.personal.phone}
                                onChange={(e) => updatePersonal('phone', e.target.value)}
                                className="rounded-lg border border-slate-800 bg-slate-900/30 p-3 text-sm text-slate-200 focus:border-primary focus:outline-none transition-colors"
                            />
                            <input
                                placeholder="Location"
                                value={resumeData.personal.location}
                                onChange={(e) => updatePersonal('location', e.target.value)}
                                className="col-span-2 rounded-lg border border-slate-800 bg-slate-900/30 p-3 text-sm text-slate-200 focus:border-primary focus:outline-none transition-colors"
                            />
                        </div>
                    </section>

                    {/* Links */}
                    <section className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 font-outfit">Links</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                placeholder="GitHub Profile URL"
                                value={resumeData.links.github}
                                onChange={(e) => updateLinks('github', e.target.value)}
                                className="rounded-lg border border-slate-800 bg-slate-900/30 p-3 text-sm text-slate-200 focus:border-primary focus:outline-none transition-colors"
                            />
                            <input
                                placeholder="LinkedIn Profile URL"
                                value={resumeData.links.linkedin}
                                onChange={(e) => updateLinks('linkedin', e.target.value)}
                                className="rounded-lg border border-slate-800 bg-slate-900/30 p-3 text-sm text-slate-200 focus:border-primary focus:outline-none transition-colors"
                            />
                        </div>
                    </section>

                    {/* Summary */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 font-outfit">Professional Summary</h3>
                            <button className="text-[10px] font-bold text-primary hover:underline font-outfit">
                                <Wand2 className="inline h-3 w-3 mr-1" />
                                AI Refine
                            </button>
                        </div>
                        <textarea
                            rows={4}
                            placeholder="Briefly describe your background and key achievements..."
                            value={resumeData.summary}
                            onChange={(e) => setResumeData((prev: ResumeData) => ({ ...prev, summary: e.target.value }))}
                            className="w-full resize-none rounded-lg border border-slate-800 bg-slate-900/30 p-3 text-sm text-slate-200 focus:border-primary focus:outline-none transition-colors"
                        />
                    </section>

                    {/* Skills */}
                    <section className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 font-outfit">Skills</h3>
                            <button
                                onClick={handleSuggestSkills}
                                disabled={suggesting}
                                className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold text-emerald-500 hover:bg-emerald-500/20 transition-all font-outfit"
                            >
                                {suggesting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                                {suggesting ? "Analyzing..." : "Suggest Skills"}
                            </button>
                        </div>

                        <div className="space-y-6">
                            {(['technical', 'soft', 'tools'] as const).map(cat => (
                                <div key={cat} className="space-y-3 p-4 rounded-xl border border-slate-800 bg-slate-900/20">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">
                                            {cat === 'technical' ? 'Technical Skills' : cat === 'soft' ? 'Soft Skills' : 'Tools & Technologies'}
                                            <span className="ml-2 text-slate-500">({(resumeData.skills?.[cat] || []).length})</span>
                                        </h4>
                                    </div>
                                    <TagInput
                                        tags={resumeData.skills?.[cat] || []}
                                        onAdd={tag => addSkill(cat, tag)}
                                        onRemove={tag => removeSkill(cat, tag)}
                                        placeholder={`Add a ${cat} skill...`}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Experience */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 font-outfit">Experience</h3>
                            <button
                                onClick={() => addEntry('experience')}
                                className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800 text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {resumeData.experience.map((exp: Experience) => (
                                <div key={exp.id} className="relative rounded-xl border border-slate-800 bg-slate-900/20 p-5 space-y-4 transition-all hover:bg-slate-900/30">
                                    <button
                                        onClick={() => removeEntry('experience', exp.id)}
                                        className="absolute right-4 top-4 text-slate-600 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4 text-slate-200">
                                        <input
                                            placeholder="Company"
                                            value={exp.company}
                                            onChange={(e) => updateEntry('experience', exp.id, 'company', e.target.value)}
                                            className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs focus:border-primary focus:outline-none"
                                        />
                                        <input
                                            placeholder="Role"
                                            value={exp.role}
                                            onChange={(e) => updateEntry('experience', exp.id, 'role', e.target.value)}
                                            className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs focus:border-primary focus:outline-none"
                                        />
                                        <input
                                            placeholder="Duration (e.g., 2021 - Present)"
                                            value={exp.duration}
                                            onChange={(e) => updateEntry('experience', exp.id, 'duration', e.target.value)}
                                            className="col-span-2 rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs focus:border-primary focus:outline-none"
                                        />
                                        <div className="col-span-2">
                                            <textarea
                                                placeholder="Description... (Start with action verb, add numbers)"
                                                value={exp.description}
                                                onChange={(e) => updateEntry('experience', exp.id, 'description', e.target.value)}
                                                className="w-full h-20 resize-none rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs focus:border-primary focus:outline-none"
                                            />
                                            <BulletGuidance content={exp.description} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 font-outfit">Education</h3>
                            <button
                                onClick={() => addEntry('education')}
                                className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800 text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {resumeData.education.map((edu: Education) => (
                                <div key={edu.id} className="relative rounded-xl border border-slate-800 bg-slate-900/20 p-5 space-y-4 transition-all hover:bg-slate-900/30">
                                    <button onClick={() => removeEntry('education', edu.id)} className="absolute right-4 top-4 text-slate-600 hover:text-rose-500 transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            placeholder="School / University"
                                            value={edu.school}
                                            onChange={(e) => updateEntry('education', edu.id, 'school', e.target.value)}
                                            className="col-span-2 rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-slate-200 focus:border-primary focus:outline-none"
                                        />
                                        <input
                                            placeholder="Degree"
                                            value={edu.degree}
                                            onChange={(e) => updateEntry('education', edu.id, 'degree', e.target.value)}
                                            className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-slate-200 focus:border-primary focus:outline-none"
                                        />
                                        <input
                                            placeholder="Year (e.g., 2018)"
                                            value={edu.year}
                                            onChange={(e) => updateEntry('education', edu.id, 'year', e.target.value)}
                                            className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-slate-200 focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Projects Section */}
                    <section className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 font-outfit">Projects</h3>
                            <button
                                onClick={() => addEntry('projects')}
                                className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800 text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {resumeData.projects.map((proj: Project) => (
                                <div
                                    key={proj.id}
                                    className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${expandedProject === proj.id ? 'border-primary bg-slate-900/40 ring-1 ring-primary/20' : 'border-slate-800 bg-slate-900/20 hover:bg-slate-900/30'
                                        }`}
                                >
                                    {/* Header */}
                                    <div
                                        onClick={() => setExpandedProject(expandedProject === proj.id ? null : proj.id)}
                                        className="flex cursor-pointer items-center justify-between p-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-800 text-slate-400">
                                                <Sparkles className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-white uppercase tracking-wider">{proj.name || "Untitled Project"}</p>
                                                <p className="text-[10px] text-slate-500">{(proj.techStack || []).length} tools used</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeEntry('projects', proj.id); }}
                                                className="text-slate-600 hover:text-rose-500 transition-colors"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                            <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${expandedProject === proj.id ? 'rotate-180' : ''}`} />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    {expandedProject === proj.id && (
                                        <div className="space-y-6 border-t border-slate-800 p-5 animate-in slide-in-from-top-2 duration-300">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-2 space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Project Name</label>
                                                    <input
                                                        placeholder="e.g. AI Portfolio Generator"
                                                        value={proj.name}
                                                        onChange={(e) => updateEntry('projects', proj.id, 'name', e.target.value)}
                                                        className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs focus:border-primary focus:outline-none"
                                                    />
                                                </div>

                                                <div className="col-span-2 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description</label>
                                                        <span className={`text-[10px] font-bold ${proj.description.length > 180 ? 'text-rose-400' : 'text-slate-600'}`}>
                                                            {proj.description.length}/200
                                                        </span>
                                                    </div>
                                                    <textarea
                                                        maxLength={200}
                                                        rows={2}
                                                        placeholder="Brief summary of what you built..."
                                                        value={proj.description}
                                                        onChange={(e) => updateEntry('projects', proj.id, 'description', e.target.value)}
                                                        className="w-full resize-none rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs focus:border-primary focus:outline-none"
                                                    />
                                                </div>

                                                <div className="col-span-2 space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tech Stack</label>
                                                    <TagInput
                                                        tags={proj.techStack || []}
                                                        onAdd={tag => updateEntry('projects', proj.id, 'techStack', [...(proj.techStack || []), tag])}
                                                        onRemove={tag => updateEntry('projects', proj.id, 'techStack', (proj.techStack || []).filter(t => t !== tag))}
                                                        placeholder="Press Enter to add tool (React, AWS, etc.)"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                        <Globe className="h-3 w-3" />
                                                        Live URL
                                                    </div>
                                                    <input
                                                        placeholder="https://demo.com"
                                                        value={proj.liveUrl}
                                                        onChange={(e) => updateEntry('projects', proj.id, 'liveUrl', e.target.value)}
                                                        className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs focus:border-primary focus:outline-none"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                        <Github className="h-3 w-3" />
                                                        Source Code
                                                    </div>
                                                    <input
                                                        placeholder="https://github.com/..."
                                                        value={proj.githubUrl}
                                                        onChange={(e) => updateEntry('projects', proj.id, 'githubUrl', e.target.value)}
                                                        className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs focus:border-primary focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Right Side: Preview + Scoring (Sticky) */}
            <div className="flex-1 md:flex-[0.45] bg-slate-900/10 p-4 md:p-8 overflow-y-auto">
                <div className="sticky top-0 space-y-6">
                    {/* ATS Score Meter */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                                <span className="text-sm font-bold text-white uppercase tracking-wider font-outfit">ATS Score</span>
                            </div>
                            <span className="text-2xl font-black transition-colors duration-500" style={{ color }}>
                                {score}%
                            </span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color }}>{label}</p>

                        {/* Progress Bar */}
                        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                            <div
                                className="h-full transition-all duration-700 ease-out"
                                style={{ width: `${score}%`, backgroundColor: color }}
                            />
                        </div>

                        {/* Improvements Panel */}
                        {suggestions.length > 0 && (
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                                    Top Improvements
                                </div>
                                <div className="space-y-3">
                                    {suggestions.map((s, i) => (
                                        <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-3 text-[11px] text-slate-300 border border-slate-800/50">
                                            <ChevronRight className="h-3 w-3 text-emerald-500 shrink-0" />
                                            <span>{s}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Template & Color Picker */}
                    <div className="space-y-6 rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Template</label>
                            <div className="flex gap-4">
                                {([
                                    { id: 'classic', label: 'Classic' },
                                    { id: 'modern', label: 'Modern' },
                                    { id: 'minimal', label: 'Minimal' }
                                ] as const).map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTemplate(t.id)}
                                        className={`group relative flex flex-col items-center gap-2 rounded-lg border-2 p-1.5 transition-all ${currentTemplate === t.id ? 'border-primary ring-1 ring-primary/20' : 'border-slate-800 hover:border-slate-700'
                                            }`}
                                    >
                                        <div className={`h-24 w-16 rounded-sm bg-slate-900 overflow-hidden relative ${currentTemplate === t.id ? 'opacity-100' : 'opacity-40 group-hover:opacity-60'}`}>
                                            {/* Minimal Visual Sketch */}
                                            {t.id === 'classic' && (
                                                <div className="p-1.5 space-y-1">
                                                    <div className="h-1 w-full bg-slate-700 mx-auto" />
                                                    <div className="h-0.5 w-full bg-slate-800" />
                                                    <div className="grid grid-cols-1 gap-1 pt-1">
                                                        <div className="h-0.5 w-full bg-slate-800" />
                                                        <div className="h-0.5 w-full bg-slate-800" />
                                                        <div className="h-0.5 w-full bg-slate-800" />
                                                    </div>
                                                </div>
                                            )}
                                            {t.id === 'modern' && (
                                                <div className="flex h-full">
                                                    <div className="w-1/3 bg-slate-700 h-full p-1 space-y-1">
                                                        <div className="h-2 w-2 rounded-full bg-slate-600 mx-auto" />
                                                        <div className="h-0.5 w-full bg-slate-600" />
                                                        <div className="h-0.5 w-full bg-slate-600" />
                                                    </div>
                                                    <div className="flex-1 p-1.5 space-y-1">
                                                        <div className="h-1 w-2/3 bg-slate-600" />
                                                        <div className="h-0.5 w-full bg-slate-800" />
                                                        <div className="h-0.5 w-full bg-slate-800" />
                                                    </div>
                                                </div>
                                            )}
                                            {t.id === 'minimal' && (
                                                <div className="p-2 space-y-2">
                                                    <div className="h-1 w-1/2 bg-slate-700" />
                                                    <div className="space-y-1">
                                                        <div className="h-0.5 w-full bg-slate-800" />
                                                        <div className="h-0.5 w-full bg-slate-800" />
                                                        <div className="h-0.5 w-full bg-slate-800" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <span className={`text-[9px] font-bold uppercase tracking-wider ${currentTemplate === t.id ? 'text-primary' : 'text-slate-500'}`}>{t.label}</span>
                                        {currentTemplate === t.id && (
                                            <div className="absolute -right-1 -top-1 rounded-full bg-primary p-0.5">
                                                <Check className="h-2 w-2 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-slate-800" />

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Theme Color</label>
                            <div className="flex gap-4">
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
                                        className={`group relative h-6 w-6 rounded-full transition-all hover:scale-110 ${resumeData.themeColor === color.value ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110' : ''}`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    >
                                        {resumeData.themeColor === color.value && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Check className="h-3 w-3 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Live Preview Sheet */}
                    <div className="w-full max-w-[500px] mx-auto overflow-hidden rounded-xl border border-slate-800 bg-white/5 backdrop-blur-md shadow-2xl transition-transform hover:scale-[1.01]">
                        <div className="flex h-10 items-center justify-between border-b border-slate-800 bg-slate-900/50 px-4">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-outfit">
                                    {(resumeData.template || 'modern').toUpperCase()} VERSION
                                </span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-slate-800" />
                                <div className="h-2 w-2 rounded-full bg-slate-800" />
                                <div className="h-2 w-2 rounded-full bg-slate-800" />
                            </div>
                        </div>
                        <div className="aspect-[1/1.414] bg-white p-6 text-black shadow-inner overflow-hidden flex flex-col font-inter">
                            {/* Template: MODERN (2-Column Sidebar) */}
                            {currentTemplate === 'modern' && (
                                <div className="flex h-full gap-4">
                                    <div className="w-[30%] h-full flex flex-col pt-4 pr-4 border-r border-slate-100" style={{ backgroundColor: `${resumeData.themeColor}08` }}>
                                        <div className="space-y-6">
                                            <div className="h-10 w-10 flex items-center justify-center rounded-lg text-white" style={{ backgroundColor: resumeData.themeColor }}>
                                                <span className="text-xl font-black">{resumeData.personal.name ? resumeData.personal.name[0] : 'U'}</span>
                                            </div>

                                            <section className="space-y-2">
                                                <h4 className="text-[7px] font-black uppercase tracking-widest" style={{ color: resumeData.themeColor }}>Contact</h4>
                                                <div className="space-y-1 text-[6.5px] text-slate-600">
                                                    <p className="truncate">{resumeData.personal.email}</p>
                                                    <p>{resumeData.personal.phone}</p>
                                                    <p>{resumeData.personal.location}</p>
                                                </div>
                                            </section>

                                            {resumeData.skills && typeof resumeData.skills === 'object' && Object.values(resumeData.skills).some(s => Array.isArray(s) && s.length > 0) && (
                                                <section className="space-y-4">
                                                    <h4 className="text-[7px] font-black uppercase tracking-widest" style={{ color: resumeData.themeColor }}>Expertise</h4>
                                                    {(Object.entries(resumeData.skills) as [keyof Skills, string[]][]).map(([key, skills]) => Array.isArray(skills) && skills.length > 0 && (
                                                        <div key={key} className="space-y-1.5">
                                                            <p className="text-[6px] font-bold uppercase text-slate-400">{key}</p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {skills.map((s, i) => (
                                                                    <span key={i} className="px-1 py-0.5 text-[5.5px] font-bold rounded border border-slate-200">{s}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </section>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 pt-4 space-y-5">
                                        <header className="space-y-1">
                                            <h1 className="text-sm font-black uppercase tracking-tighter" style={{ color: resumeData.themeColor }}>{resumeData.personal.name || "YOUR NAME"}</h1>
                                            <p className="text-[7.5px] text-slate-500 italic line-clamp-2">{resumeData.summary}</p>
                                        </header>

                                        {resumeData.experience.length > 0 && (
                                            <section className="space-y-3">
                                                <h2 className="text-[8px] font-black uppercase tracking-widest border-b border-slate-100 pb-1" style={{ color: resumeData.themeColor }}>Experience</h2>
                                                <div className="space-y-3">
                                                    {resumeData.experience.map(exp => (
                                                        <div key={exp.id} className="space-y-0.5">
                                                            <div className="flex justify-between font-bold text-[7px]">
                                                                <span className="uppercase">{exp.role}</span>
                                                                <span className="text-slate-400 font-medium">{exp.duration}</span>
                                                            </div>
                                                            <div className="text-[6.5px] font-bold italic text-slate-400">{exp.company}</div>
                                                            <p className="text-[6.5px] text-slate-500 line-clamp-2 mt-1">{exp.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        {resumeData.projects.length > 0 && (
                                            <section className="space-y-3">
                                                <h2 className="text-[8px] font-black uppercase tracking-widest border-b border-slate-100 pb-1" style={{ color: resumeData.themeColor }}>Projects</h2>
                                                <div className="space-y-3">
                                                    {resumeData.projects.map(proj => (
                                                        <div key={proj.id} className="space-y-1">
                                                            <div className="text-[7px] font-bold uppercase">{proj.name}</div>
                                                            <p className="text-[6.5px] text-slate-500 line-clamp-2">{proj.description}</p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {proj.techStack.map((tech, i) => (
                                                                    <span key={i} className="text-[5.5px] font-medium text-slate-400">{tech} •</span>
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

                            {/* Template: CLASSIC (Single Column with Rules) */}
                            {currentTemplate === 'classic' && (
                                <div className="space-y-6 pt-4 font-serif">
                                    <div className="text-center space-y-1">
                                        <h1 className="text-lg font-bold tracking-tight" style={{ color: resumeData.themeColor }}>{resumeData.personal.name || "YOUR NAME"}</h1>
                                        <div className="text-[7.5px] text-slate-600 space-x-2">
                                            <span>{resumeData.personal.email}</span>
                                            <span>|</span>
                                            <span>{resumeData.personal.phone}</span>
                                            <span>|</span>
                                            <span>{resumeData.personal.location}</span>
                                        </div>
                                    </div>

                                    {resumeData.summary && (
                                        <section className="space-y-1.5">
                                            <h2 className="text-[8px] font-bold border-b border-black text-center uppercase tracking-widest">Professional Summary</h2>
                                            <p className="text-[7.5px] leading-relaxed text-slate-800 italic">{resumeData.summary}</p>
                                        </section>
                                    )}

                                    {resumeData.experience.length > 0 && (
                                        <section className="space-y-2">
                                            <h2 className="text-[8px] font-bold border-b border-black uppercase tracking-widest">Experience</h2>
                                            <div className="space-y-3">
                                                {resumeData.experience.map(exp => (
                                                    <div key={exp.id} className="space-y-0.5">
                                                        <div className="flex justify-between font-bold text-[7.5px]">
                                                            <span>{exp.role.toUpperCase()}</span>
                                                            <span className="font-normal">{exp.duration}</span>
                                                        </div>
                                                        <div className="text-[7px] font-bold italic" style={{ color: resumeData.themeColor }}>{exp.company}</div>
                                                        <p className="text-[7px] text-slate-800 leading-tight line-clamp-2">{exp.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {resumeData.skills && (
                                        <section className="space-y-1.5">
                                            <h2 className="text-[8px] font-bold border-b border-black uppercase tracking-widest">Core Skills</h2>
                                            <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                                                {[...resumeData.skills.technical, ...resumeData.skills.soft].map((s, i) => (
                                                    <span key={i} className="text-[7px] text-slate-800">• {s}</span>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </div>
                            )}

                            {/* Template: MINIMAL (Modern/Clean) */}
                            {currentTemplate === 'minimal' && (
                                <div className="space-y-8 pt-6">
                                    <header className="space-y-1">
                                        <h1 className="text-2xl font-light tracking-tighter lowercase" style={{ color: resumeData.themeColor }}>{resumeData.personal.name || "name"}</h1>
                                        <div className="text-[7px] text-slate-400 flex gap-3 lowercase tracking-widest">
                                            <span>{resumeData.personal.email}</span>
                                            <span>{resumeData.personal.location}</span>
                                        </div>
                                    </header>

                                    <div className="space-y-8">
                                        {resumeData.summary && (
                                            <p className="text-[8px] leading-[1.8] text-slate-600 font-light max-w-[90%]">{resumeData.summary}</p>
                                        )}

                                        <div className="grid grid-cols-10 gap-x-8 gap-y-12">
                                            <div className="col-span-12 space-y-6">
                                                {resumeData.experience.map(exp => (
                                                    <div key={exp.id} className="space-y-1">
                                                        <div className="flex justify-between items-baseline">
                                                            <h3 className="text-[8px] font-bold">{exp.role} <span className="font-light text-slate-400">at</span> {exp.company}</h3>
                                                            <span className="text-[6.5px] uppercase tracking-widest text-slate-300">{exp.duration}</span>
                                                        </div>
                                                        <p className="text-[7.5px] text-slate-500 leading-relaxed font-light">{exp.description}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="col-span-12 space-y-3">
                                                <h4 className="text-[6.5px] font-black uppercase text-slate-300 tracking-[0.4em]">expert_in</h4>
                                                <div className="flex flex-wrap gap-x-4 gap-y-2">
                                                    {resumeData.skills.technical.map((s, i) => (
                                                        <span key={i} className="text-[7.5px] text-slate-500 lowercase font-medium" style={{ borderBottom: `1px solid ${resumeData.themeColor}20` }}>{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto pt-4 text-center border-t border-slate-50">
                                <p className="text-[5.5px] font-bold uppercase tracking-[0.2em] text-slate-300">
                                    rendered using the {currentTemplate} layout
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
