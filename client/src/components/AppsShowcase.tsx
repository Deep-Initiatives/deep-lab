import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, Sparkles, Cpu, Wrench, Globe, Calendar, Users, Code, ArrowRight, TrendingUp, ImageIcon } from "lucide-react";
import type { App, AppCategory } from "@shared/schema";
import { formatStatus } from "@/lib/projectUtils";
import { Progress } from "@/components/ui/progress";

interface AppsShowcaseProps {
  apps: App[];
}

const categoryIcons: Record<AppCategory, any> = {
  "AI Agent": Sparkles,
  "Web App": Globe,
  Tool: Wrench,
  Service: Cpu,
};

const categoryColors: Record<AppCategory, string> = {
  "AI Agent": "from-chart-1 to-chart-2",
  "Web App": "from-chart-2 to-chart-3",
  Tool: "from-chart-3 to-chart-4",
  Service: "from-chart-4 to-chart-5",
};

export function AppsShowcase({ apps }: AppsShowcaseProps) {
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [, setLocation] = useLocation();

  // Priority projects to show at the top
  const priorityProjects = [
    "AI Avatar",
    "AI Assisted Proposal Refinement",
    "BGI Events App",
    "BGI Avatar (Nexus Chat)",
    "Community Hub Portal",
    "Internal NewsFeed/Newsletter"

  ];

  // Image mapping for specific projects
  const projectImages: Record<string, string> = {
    "AI Avatar": "/avatar.png",
    "AI Assisted Proposal Refinement": "/aiproposal.png",
    "Internal NewsFeed/Newsletter": "/newsflash.png",
    "BGI Events App": "/bgi-summit.png",
    // "Community Hub Portal": "/bginexus.png",
    "BGI Avatar (Nexus Chat)": "/bginexus.png"
  };

  const sortedApps = [...apps].sort((a, b) => {
    const aIndex = priorityProjects.indexOf(a.name);
    const bIndex = priorityProjects.indexOf(b.name);

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });

  // Limit to top 6 projects
  const displayApps = sortedApps.slice(0, 6);

  return (
    <section id="projects" className="py-20 md:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our Innovation Portfolio
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our growing collection of AI-powered applications, tools, and services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayApps.map((app) => {
            const Icon = categoryIcons[app.category as AppCategory];
            const gradientColor = categoryColors[app.category as AppCategory];
            const projectImage = projectImages[app.name];

            return (
              <div key={app.id}>
                <Card
                  className="group h-full flex flex-col backdrop-blur-md bg-background border-none shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden"
                  data-testid={`card-app-${app.id}`}
                >
                  {/* Image Placeholder - Distinct Area */}
                  <div className="p-4 pb-0 bg-background">
                    <div className={`h-48 w-full rounded-2xl bg-muted/30 relative overflow-hidden flex items-center justify-center border border-border/50`}>
                      {projectImage ? (
                        <img
                          src={projectImage}
                          alt={app.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/10" />
                          <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Apps Content Area */}
                  <div className="flex-1 flex flex-col p-6 pt-4">
                    {/* Header Row: Icon + Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradientColor} shadow-sm`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs font-medium px-2.5 py-1 bg-muted text-muted-foreground hover:bg-muted/80">
                        {formatStatus(app.status)}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                      {app.name}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                      {app.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                        <span className="font-medium">Progress</span>
                        <span>{app.progress}%</span>
                      </div>
                      <Progress value={app.progress} className="h-1.5" />
                    </div>

                    {/* Tags - Simplified Pill Style */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {app.technologies?.slice(0, 3).map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-[11px] px-3 py-1 font-normal border-border/50 text-muted-foreground bg-background/50 backdrop-blur-sm rounded-full">
                          {tech}
                        </Badge>
                      ))}
                      {app.technologies && app.technologies.length > 3 && (
                        <Badge variant="outline" className="text-[11px] px-3 py-1 font-normal border-border/50 text-muted-foreground bg-background/50 backdrop-blur-sm rounded-full">
                          +{app.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Footer - Full Width Button */}
                  <div className="p-4 pt-0 bg-background">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          className="w-full text-foreground bg-muted/50 hover:bg-muted font-medium transition-all rounded-xl h-10"
                          onClick={() => setSelectedApp(app)}
                          data-testid={`button-details-${app.id}`}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <div className={`h-32 mb-4 rounded-t-lg -mx-6 -mt-6 bg-gradient-to-br ${gradientColor} opacity-10 relative overflow-hidden flex items-center justify-center`}>
                            {projectImage ? (
                              <img
                                src={projectImage}
                                alt={app.name}
                                className="w-full h-full object-cover opacity-50"
                              />
                            ) : (
                              <>
                                <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px]" />
                                <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
                              </>
                            )}
                          </div>
                          <DialogTitle className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${gradientColor}`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold">{app.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary">{formatStatus(app.status)}</Badge>
                                <Badge variant="outline">{app.category}</Badge>
                              </div>
                            </div>
                          </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold mb-2">Description</h4>
                            <p className="text-muted-foreground leading-relaxed">
                              {app.description}
                            </p>
                          </div>

                          {app.technologies && app.technologies.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Code className="h-4 w-4" />
                                Technologies
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {app.technologies.map((tech, index) => (
                                  <Badge key={index} variant="outline" className="text-sm">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm">
                            <div>
                              <span className="text-muted-foreground block mb-1">Start Date</span>
                              <div className="flex items-center gap-2 font-medium">
                                <Calendar className="h-4 w-4 text-primary" />
                                {new Date(app.startDate).toLocaleDateString()}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground block mb-1">Team Size</span>
                              <div className="flex items-center gap-2 font-medium">
                                <Users className="h-4 w-4 text-primary" />
                                {app.teamSize} Members
                              </div>
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground block mb-1">Progress</span>
                              <div className="flex items-center gap-2 font-medium w-full">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                <div className="flex-1 flex items-center gap-3">
                                  <Progress value={app.progress} className="h-2 flex-1" />
                                  <span>{app.progress}%</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {app.demoUrl && (
                            <div>
                              <h4 className="font-semibold mb-2">Demo</h4>
                              <Button
                                variant="outline"
                                className="w-full"
                                asChild
                              >
                                <a
                                  href={app.demoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-2"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  Visit Demo
                                </a>
                              </Button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {apps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No apps found. Check back soon!
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <Button
            onClick={() => setLocation("/projects")}
            size="lg"
            className="bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 text-white hover:opacity-90 transition-opacity transform hover:scale-105 rounded-full px-8"
          >
            View more
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}