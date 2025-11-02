import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, Sparkles, Cpu, Wrench, Globe, Calendar, Users, Code, ArrowRight } from "lucide-react";
import type { App, AppCategory } from "@shared/schema";

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
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | "All">("All");
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [, setLocation] = useLocation();

  const categories: (AppCategory | "All")[] = ["All", "AI Agent", "Web App", "Tool", "Service"];

  const filteredApps =
    selectedCategory === "All"
      ? apps
      : apps.filter((app) => app.category === selectedCategory);

  // Show only first 12 projects on homepage
  const displayedApps = filteredApps.slice(0, 12);

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

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            const Icon = category !== "All" ? categoryIcons[category as AppCategory] : null;
            
            // Get category-specific gradient for active state
            const getCategoryGradient = (cat: AppCategory | "All") => {
              if (cat === "All") return "from-chart-1 via-chart-2 to-chart-3";
              return categoryColors[cat as AppCategory];
            };

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${getCategoryGradient(category)} text-white shadow-lg scale-105`
                    : "bg-muted text-muted-foreground hover-elevate"
                }`}
                data-testid={`filter-${category.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {category}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayedApps.map((app) => {
            const Icon = categoryIcons[app.category as AppCategory];
            const gradientColor = categoryColors[app.category as AppCategory];

            return (
              <Card
                key={app.id}
                className="group backdrop-blur-md bg-background/50 border-border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-chart-2/20"
                data-testid={`card-app-${app.id}`}
              >
                <div className={`h-1 bg-gradient-to-r ${gradientColor}`} />
                
                <CardHeader className="space-y-0 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-lg bg-gradient-to-br ${gradientColor}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {app.status}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold group-hover:text-chart-2 transition-colors">
                    {app.name}
                  </h3>
                </CardHeader>

                <CardContent className="pb-4">
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {app.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {app.technologies?.slice(0, 3).map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {app.technologies && app.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{app.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full group/btn"
                        onClick={() => setSelectedApp(app)}
                        data-testid={`button-details-${app.id}`}
                      >
                        View Details
                        <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${gradientColor}`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">{app.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary">{app.status}</Badge>
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

                        <div className="grid grid-cols-1 gap-4 pt-4 border-t">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Created: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {displayedApps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No apps found in this category yet. Check back soon!
            </p>
          </div>
        )}

        {apps.length > 12 && filteredApps.length > 12 && (
          <div className="text-center mt-12">
            <Button
              onClick={() => setLocation("/projects")}
              size="lg"
              className="bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 text-white hover:opacity-90 transition-opacity"
            >
              Show More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}