import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Introduction } from "@/components/Introduction";
import { AppsShowcase } from "@/components/AppsShowcase";
import { PodsSection } from "@/components/PodsSection";
import { Timeline } from "@/components/Timeline";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import type { App, Pod, TimelineMilestone, LabStats } from "@shared/schema";

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-chart-2 mx-auto" />
        <p className="text-muted-foreground">Loading Deep Lab...</p>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-muted-foreground">{message}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="default"
          className="bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 text-white border-0"
          data-testid="button-reload-page"
        >
          Reload Page
        </Button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery<LabStats>({
    queryKey: ["/api/stats"],
  });

  const { data: apps, isLoading: appsLoading, error: appsError } = useQuery<App[]>({
    queryKey: ["/api/apps"],
  });

  const { data: pods, isLoading: podsLoading, error: podsError } = useQuery<Pod[]>({
    queryKey: ["/api/pods"],
  });

  const { data: milestones, isLoading: milestonesLoading, error: milestonesError } = useQuery<TimelineMilestone[]>({
    queryKey: ["/api/milestones"],
  });

  const isLoading = statsLoading || appsLoading || podsLoading || milestonesLoading;
  const error = statsError || appsError || podsError || milestonesError;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState message="Failed to load Deep Lab data. Please try again." />;
  }

  if (!stats || !apps || !pods || !milestones) {
    return <ErrorState message="No data available." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero stats={stats} />
      <Introduction />
      <AppsShowcase apps={apps} />
      <PodsSection pods={pods} />
      <Timeline milestones={milestones} />
      <CTASection />
      <Footer />
    </div>
  );
}
