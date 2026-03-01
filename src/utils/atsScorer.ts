import type { ResumeData } from "../types/resume";

export interface ScoreBreakdown {
    score: number;
    suggestions: string[];
    label: string;
    color: string;
}

export const ACTION_VERBS = [
    'built', 'led', 'designed', 'improved', 'developed', 'implemented',
    'created', 'optimized', 'automated', 'managed', 'coordinated',
    'delivered', 'increased', 'decreased', 'saved', 'fixed', 'mentored',
    'launched', 'researched'
];

export const calculateATSScore = (data: ResumeData): ScoreBreakdown => {
    let score = 0;
    const suggestions: string[] = [];

    // 1. Name (+10)
    if (data.personal.name.trim()) {
        score += 10;
    } else {
        suggestions.push("Add your full name (+10 pts)");
    }

    // 2. Email (+10)
    if (data.personal.email.trim()) {
        score += 10;
    } else {
        suggestions.push("Add a professional email (+10 pts)");
    }

    // 3. Summary > 50 chars (+10)
    if (data.summary.trim().length > 50) {
        score += 10;
    } else {
        suggestions.push("Write a summary (>50 chars) (+10 pts)");
    }

    // 4. Experience (+15)
    // Check if at least one experience has a description
    if (data.experience.length > 0 && data.experience.some(exp => exp.description.trim().length > 10)) {
        score += 15;
    } else {
        suggestions.push("Add work experience with bullets (+15 pts)");
    }

    // 5. Education (+10)
    if (data.education.length > 0) {
        score += 10;
    } else {
        suggestions.push("Add your education (+10 pts)");
    }

    // 6. Skills >= 5 (+10)
    const skills = data.skills || { technical: [], soft: [], tools: [] };
    const totalSkills = (skills.technical?.length || 0) + (skills.soft?.length || 0) + (skills.tools?.length || 0);
    if (totalSkills >= 5) {
        score += 10;
    } else {
        suggestions.push("Add at least 5 skills (+10 pts)");
    }

    // 7. Project (+10)
    if (data.projects.length > 0) {
        score += 10;
    } else {
        suggestions.push("Add at least one project (+10 pts)");
    }

    // 8. Phone (+5)
    if (data.personal.phone.trim()) {
        score += 5;
    } else {
        suggestions.push("Add your phone number (+5 pts)");
    }

    // 9. LinkedIn (+5)
    if (data.links.linkedin.trim()) {
        score += 5;
    } else {
        suggestions.push("Add your LinkedIn profile (+5 pts)");
    }

    // 10. GitHub (+5)
    if (data.links.github.trim()) {
        score += 5;
    } else {
        suggestions.push("Add your GitHub profile (+5 pts)");
    }

    // 11. Action Verbs in Summary (+10)
    const summaryLower = data.summary.toLowerCase();
    const hasActionVerb = ACTION_VERBS.some(verb => summaryLower.includes(verb));
    if (hasActionVerb) {
        score += 10;
    } else {
        suggestions.push("Use action verbs in summary (+10 pts)");
    }

    // Status Labels
    let label = "Needs Work";
    let color = "#ef4444"; // Red

    if (score > 70) {
        label = "Strong Resume";
        color = "#22c55e"; // Green
    } else if (score > 40) {
        label = "Getting There";
        color = "#f59e0b"; // Amber
    }

    return {
        score: Math.min(score, 100),
        suggestions: suggestions.slice(0, 3),
        label,
        color
    };
};

export const checkBulletGuidance = (bullet: string) => {
    const actionVerbs = ['Built', 'Developed', 'Designed', 'Implemented', 'Led', 'Improved', 'Created', 'Optimized', 'Automated'];
    const startsWithActionVerb = actionVerbs.some(verb => bullet.trim().startsWith(verb));
    const hasNumericIndicator = /[\d%]|(\b\d+[KkMmBb]\b)/.test(bullet);

    return {
        needsActionVerb: !startsWithActionVerb && bullet.length > 0,
        needsNumbers: !hasNumericIndicator && bullet.length > 0
    };
};
