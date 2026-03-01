import React from 'react';

interface CircularScoreProps {
    score: number;
    label: string;
    color: string;
    size?: number;
}

export const CircularScore: React.FC<CircularScoreProps> = ({ score, label, color, size = 120 }) => {
    const radius = size * 0.4;
    const strokeWidth = size * 0.08;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        className="text-slate-800"
                    />
                    {/* Progress circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                        className="transition-all duration-700 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white">{score}</span>
                    <span className="text-[8px] uppercase font-black text-slate-500 tracking-widest">ATS Readiness</span>
                </div>
            </div>
            <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-current bg-opacity-10" style={{ color, backgroundColor: `${color}10` }}>
                    {label}
                </p>
            </div>
        </div>
    );
};
