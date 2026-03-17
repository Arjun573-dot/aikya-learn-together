import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import GroupsPage from "./pages/GroupsPage";
import ChatPage from "./pages/ChatPage";
import NotesPage from "./pages/NotesPage";
import AiChatPage from "./pages/AiChatPage";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { isDarkMode } from "./lib/store";

const queryClient = new QueryClient();

function DashboardRoute({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

const App = () => {
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardRoute><DashboardPage /></DashboardRoute>} />
            <Route path="/dashboard/groups" element={<DashboardRoute><GroupsPage /></DashboardRoute>} />
            <Route path="/dashboard/chat" element={<DashboardRoute><ChatPage /></DashboardRoute>} />
            <Route path="/dashboard/notes" element={<DashboardRoute><NotesPage /></DashboardRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
