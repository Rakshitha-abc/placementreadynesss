export interface Experience {
    id: string;
    company: string;
    role: string;
    duration: string;
    description: string;
}

export interface Education {
    id: string;
    school: string;
    degree: string;
    year: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    techStack: string[];
    liveUrl: string;
    githubUrl: string;
}

export type ResumeTemplate = 'classic' | 'modern' | 'minimal';

export interface Skills {
    technical: string[];
    soft: string[];
    tools: string[];
}

export interface ResumeData {
    personal: {
        name: string;
        email: string;
        phone: string;
        location: string;
    };
    links: {
        github: string;
        linkedin: string;
    };
    summary: string;
    education: Education[];
    experience: Experience[];
    projects: Project[];
    skills: Skills;
    template: ResumeTemplate;
    themeColor: string;
}

export const INITIAL_RESUME_DATA: ResumeData = {
    personal: { name: "", email: "", phone: "", location: "" },
    links: { github: "", linkedin: "" },
    summary: "",
    education: [],
    experience: [],
    projects: [],
    skills: {
        technical: [],
        soft: [],
        tools: [],
    },
    template: 'modern',
    themeColor: 'hsl(168, 60%, 40%)', // Default Teal
};

export const SAMPLE_RESUME_DATA: ResumeData = {
    personal: {
        name: "Alex Rivera",
        email: "alex.rivera@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
    },
    links: {
        github: "github.com/arivera",
        linkedin: "linkedin.com/in/arivera",
    },
    summary: "Results-driven Software Engineer with 5+ years of experience in building scalable web applications. Expert in React, Node.js, and cloud architecture.",
    education: [
        { id: "1", school: "Stanford University", degree: "B.S. Computer Science", year: "2018" }
    ],
    experience: [
        {
            id: "1",
            company: "TechFlow Inc.",
            role: "Senior Frontend Engineer",
            duration: "2021 - Present",
            description: "Led the migration of a legacy monolithic app to a modular micro-frontend architecture using React and Tailwind CSS."
        },
        {
            id: "2",
            company: "DataSync Systems",
            role: "Full Stack Developer",
            duration: "2018 - 2021",
            description: "Designed and implemented RESTful APIs that handled over 1M requests per day with 99.9% uptime."
        }
    ],
    projects: [
        {
            id: "1",
            name: "AI Query engine",
            description: "A natural language interface for SQL databases using OpenAI's GPT-4.",
            techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "OpenAI"],
            liveUrl: "https://ai-query.demo",
            githubUrl: "https://github.com/arivera/ai-query",
        }
    ],
    skills: {
        technical: ["React", "TypeScript", "Node.js", "PostgreSQL", "GraphQL"],
        soft: ["Team Leadership", "Problem Solving"],
        tools: ["Git", "Docker", "AWS"],
    },
    template: 'modern',
    themeColor: 'hsl(168, 60%, 40%)',
};
