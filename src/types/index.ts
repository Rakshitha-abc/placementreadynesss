export interface BuildStep {
    id: string;
    title: string;
    path: string;
    stepNumber: number;
}

export const BUILD_STEPS: BuildStep[] = [
    { id: "problem", title: "Problem Statement", path: "/rb/01-problem", stepNumber: 1 },
    { id: "market", title: "Market Analysis", path: "/rb/02-market", stepNumber: 2 },
    { id: "architecture", title: "Architecture", path: "/rb/03-architecture", stepNumber: 3 },
    { id: "hld", title: "High Level Design", path: "/rb/04-hld", stepNumber: 4 },
    { id: "lld", title: "Low Level Design", path: "/rb/05-lld", stepNumber: 5 },
    { id: "build", title: "Build", path: "/rb/06-build", stepNumber: 6 },
    { id: "test", title: "Testing", path: "/rb/07-test", stepNumber: 7 },
    { id: "ship", title: "Shipment", path: "/rb/08-ship", stepNumber: 8 },
];
