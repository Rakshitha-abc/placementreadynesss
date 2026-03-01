import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { ResumeData } from "../types/resume";
import { INITIAL_RESUME_DATA } from "../types/resume";

const STORAGE_KEY = "resumeBuilderData";

interface ResumeContextType {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
    loadSampleData: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [resumeData, setResumeData] = useState<ResumeData>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                // Deep merge or specific field validation to handle schema evolution
                const merged = { ...INITIAL_RESUME_DATA, ...parsed };

                // Handle Skills migration (string -> object)
                if (typeof merged.skills === 'string') {
                    merged.skills = {
                        technical: merged.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
                        soft: [],
                        tools: []
                    };
                } else if (merged.skills) {
                    merged.skills = {
                        technical: merged.skills.technical || [],
                        soft: merged.skills.soft || [],
                        tools: merged.skills.tools || []
                    };
                }

                // Handle Projects migration (ensure new fields exist)
                if (Array.isArray(merged.projects)) {
                    merged.projects = merged.projects.map((p: any) => ({
                        ...p,
                        techStack: Array.isArray(p.techStack) ? p.techStack : [],
                        liveUrl: p.liveUrl || p.link || "",
                        githubUrl: p.githubUrl || ""
                    }));
                }

                // Ensure personal, links, and styling fields are properly initialized
                merged.personal = { ...INITIAL_RESUME_DATA.personal, ...parsed.personal };
                merged.links = { ...INITIAL_RESUME_DATA.links, ...parsed.links };
                merged.themeColor = parsed.themeColor || INITIAL_RESUME_DATA.themeColor;

                return merged as ResumeData;
            } catch (e) {
                console.error("Failed to load resume data", e);
                return INITIAL_RESUME_DATA;
            }
        }
        return INITIAL_RESUME_DATA;
    });

    // Auto-save whenever data changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    }, [resumeData]);

    const loadSampleData = () => {
        import("../types/resume").then((mod) => {
            setResumeData(mod.SAMPLE_RESUME_DATA);
        });
    };

    return (
        <ResumeContext.Provider value={{ resumeData, setResumeData, loadSampleData }}>
            {children}
        </ResumeContext.Provider>
    );
};

export const useResume = () => {
    const context = useContext(ResumeContext);
    if (!context) {
        throw new Error("useResume must be used within a ResumeProvider");
    }
    return context;
};
