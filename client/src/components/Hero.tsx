import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroProps {
  stats: {
    totalApps: number;
    activePods: number;
    teamMembers: number;
    monthsSinceInception: number;
  };
}

export function Hero({ stats }: HeroProps) {
  const [displayStats, setDisplayStats] = useState({
    totalApps: 0,
    activePods: 0,
    teamMembers: 0,
    monthsSinceInception: 0,
  });

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setDisplayStats({
        totalApps: Math.floor(stats.totalApps * progress),
        activePods: Math.floor(stats.activePods * progress),
        teamMembers: Math.floor(stats.teamMembers * progress),
        monthsSinceInception: Math.floor(stats.monthsSinceInception * progress),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setDisplayStats(stats);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [stats]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20"
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-chart-1 via-chart-2 to-chart-3 animate-gradient-flow bg-300%"
        style={{ opacity: 0.9 }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in-up">
          <Sparkles className="h-4 w-4 text-white" />
          <span className="text-sm font-medium text-white">
            15+ Apps Prototyped Since June 2025
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
          Where Innovation
          <br />
          <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            Takes Flight
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up">
          Deep Lab is an AI and development lab pushing the boundaries of innovation.
          We prototype, MVP, and deploy cutting-edge AI agents, web applications, and
          services at lightning speed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up">
          <Button
            size="lg"
            onClick={() => scrollToSection("projects")}
            className="bg-white text-chart-2 hover:bg-white/90 font-semibold px-8 border-0"
            data-testid="button-view-projects"
          >
            View Projects
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollToSection("join")}
            className="backdrop-blur-md bg-white/10 text-white border-white/30 hover:bg-white/20 font-semibold px-8"
            data-testid="button-join-us"
          >
            Join Our Team
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto animate-fade-in-up">
          {[
            { label: "Apps Built", value: displayStats.totalApps, suffix: "+" },
            { label: "Active Pods", value: displayStats.activePods, suffix: "" },
            { label: "Team Members", value: displayStats.teamMembers, suffix: "+" },
            { label: "Months Running", value: displayStats.monthsSinceInception, suffix: "" },
          ].map((stat, index) => (
            <div
              key={index}
              className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-6 animate-count-up"
              data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="text-3xl md:text-4xl font-bold text-white font-mono mb-2">
                {stat.value}
                {stat.suffix}
              </div>
              <div className="text-sm text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
