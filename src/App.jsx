// src/App.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
} from "@clerk/clerk-react";

import MainLayout from "./layout/MainLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import JobsPage from "./pages/Jobs/JobsPage";
import PipelinePage from "./pages/Pipeline/PipelinePage";

const ProtectedRoute = ({ children }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
);

// Layout wrapper for all protected app routes
const ProtectedLayout = () => (
  <ProtectedRoute>
    <MainLayout>
      <Outlet />
    </MainLayout>
  </ProtectedRoute>
);

const App = () => {
  return (
    <Routes>
      {/* Public auth route */}
      <Route
        path="/sign-in"
        element={<SignIn routing="path" path="/sign-in" />}
      />

      {/* All other routes are protected */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/jobs" element={<JobsPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
