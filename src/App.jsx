import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout.jsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";
import PipelinePage from "./pages/Pipeline/PipelinePage.jsx";
import JobsPage from "./pages/Jobs/JobPage.jsx";
import JobDetailPage from "./pages/JobDetail/JobDetailPage.jsx";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:jobId" element={<JobDetailPage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
