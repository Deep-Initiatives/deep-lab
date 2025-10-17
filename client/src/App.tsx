import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import { ProjectDetailsPage } from "@/pages/ProjectDetailsPage";
import BlogPage from "@/pages/BlogPage";
import ContactPage from "@/pages/ContactPage";
import ViewAllIdeasPage from "@/pages/ViewAllIdeasPage";
import SubmitIdeaPage from "@/pages/SubmitIdeaPage";
import JoinTeamPage from "@/pages/JoinTeamPage";
import WorkflowOverviewPage from "@/pages/WorkflowOverviewPage";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/project/:id" component={({ params }) => <ProjectDetailsPage projectId={params.id} />} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/ideas" component={ViewAllIdeasPage} />
      <Route path="/submit-idea" component={SubmitIdeaPage} />
      <Route path="/join-team" component={JoinTeamPage} />
      <Route path="/workflow" component={WorkflowOverviewPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin" component={ProtectedAdminRoute} />
      <Route path="/admin/*" component={ProtectedAdminRoute} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
