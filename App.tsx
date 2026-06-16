import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoutes";
import { Toaster } from "react-hot-toast";

import { Home } from "./pages/Home";
import { Scan } from "./pages/Scan";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ScanHistory } from "./pages/ScanHistory";
import Malware from "./pages/Maleware";
import DataLeak from "./pages/DataLeak";
import { Otp } from "./pages/Otp";
import { ScanReport } from "./pages/ScanReport";
import { ChatbotPage } from "./pages/ChatBotPage";
import { ScanReports } from "./pages/ScanReports";

const AppContent: React.FC = () => {
  const location = useLocation();

  const isScanPage =
    location.pathname === "/scan" ||
    location.pathname === "/scan/history"

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-slate-300 font-sans selection:bg-cyan-400 selection:text-black">
      {/* نفس الـ background بتاعك سيبه زي ما هو */}

      <div className="relative z-10 flex min-h-screen flex-col">
        {!isScanPage && <Navbar />}

        <main className={`flex-1 ${!isScanPage ? "pt-24" : ""}`}>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp" element={<Otp />} />

            <Route
              path="/scan/:scanId/reports"
              element={
                <ProtectedRoute>
                  <ScanReports />
                </ProtectedRoute>
              }
            />

            <Route
              path="/scan"
              element={
                <ProtectedRoute>
                  <Scan />
                </ProtectedRoute>
              }
            />

            <Route path="/malware" element={<Malware />} />
            <Route path="/data-leak" element={<DataLeak />} />

            <Route
              path="/scan/history"
              element={
                <ProtectedRoute>
                  <ScanHistory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/scan/:scanId/report"
              element={
                <ProtectedRoute>
                  <ScanReport />
                </ProtectedRoute>
              }
            />

            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <ChatbotPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={12}
        containerStyle={{
          top: 25,
        }}
        toastOptions={{
          duration: 5000,
          className: "animate-[toastEnter_1.2s_cubic-bezier(0.16,1,0.3,1)]",
          style: {
            background: "#07111f",
            color: "#fff",
            borderRadius: "18px",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(34,211,238,.3)",
            boxShadow:
              "0 0 25px rgba(34,211,238,.2),0 0 60px rgba(34,211,238,.08)",
            padding: "16px",
            fontWeight: "700",
          },
          success: {
            iconTheme: {
              primary: "#22d3ee",
              secondary: "#07111f",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#07111f",
            },
          },
        }}
      />

      <AppContent />
    </Router>
  );
};

export default App;