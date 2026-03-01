import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BuildLayout } from "./components/Layout/BuildLayout";
import { MainLayout } from "./components/Layout/MainLayout";
import { BuildStepPage } from "./pages/BuildStepPage";
import { ProofPage as StepProofPage } from "./pages/ProofPage";
import { HomePage } from "./pages/HomePage";
import { BuilderPage } from "./pages/BuilderPage";
import { PreviewPage } from "./pages/PreviewPage";
import { ProofPage } from "./pages/ProofPage";
import { ResumeProvider } from "./context/ResumeContext";
import { BUILD_STEPS } from "./types";
import "./index.css";

function App() {
  return (
    <ResumeProvider>
      <Router>
        <Routes>
          {/* Main App Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/builder" element={<BuilderPage />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/proof" element={<ProofPage />} />
          </Route>

          {/* Meta: Build Track Routes */}
          <Route path="/rb" element={<BuildLayout />}>
            {BUILD_STEPS.map((step) => (
              <Route
                key={step.id}
                path={step.path.replace("/rb/", "")}
                element={<BuildStepPage step={step} />}
              />
            ))}
            <Route path="proof" element={<StepProofPage />} />
          </Route>
        </Routes>
      </Router>
    </ResumeProvider>
  );
}

export default App;
