import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ExternalLink, Sparkles, Cpu, Wrench, Globe, Calendar, Code, ArrowRight, Search, Loader2, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from "@/components/ui/select";
import type { App, AppCategory } from "@shared/schema";

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

export default function ProjectsPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [, setLocation] = useLocation();

  const categories: (AppCategory | "All")[] = ["All", "AI Agent", "Web App", "Tool", "Service"];
  const statusFilters = ["in development", "prototype", "beta testing"];

  // Fetch all apps from the database
  const { data: apps, isLoading, error } = useQuery<App[]>({
    queryKey: ["/api/apps"],
  });

  const filteredApps = (apps || []).filter((app) => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.technologies?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Handle combined filter (category or status)
    if (selectedFilter === "All") {
      return matchesSearch;
    }
    
    // Check if it's a category filter
    const isCategory = categories.includes(selectedFilter as AppCategory | "All");
    if (isCategory) {
      return matchesSearch && app.category === selectedFilter;
    }
    
    // Otherwise it's a status filter
    const appStatusLower = app.status.toLowerCase();
    const selectedStatusLower = selectedFilter.toLowerCase();
    
    // Handle status matching with variations
    if (selectedStatusLower === "in development") {
      return matchesSearch && appStatusLower.includes("development");
    }
    if (selectedStatusLower === "prototype") {
      return matchesSearch && appStatusLower.includes("prototype");
    }
    if (selectedStatusLower === "beta testing") {
      return matchesSearch && appStatusLower.includes("beta");
    }
    
    return matchesSearch;
  });

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 text-transparent bg-clip-text mb-6">
              Our Innovation Portfolio
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our growing collection of AI-powered applications, tools, and services
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-64">
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger className="w-full">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <SelectValue placeholder="Filter by category or status" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Projects</SelectItem>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel>Category</SelectLabel>
                          {categories.filter(cat => cat !== "All").map((category) => {
                            const Icon = categoryIcons[category as AppCategory];
                            return (
                              <SelectItem key={category} value={category}>
                                <div className="flex items-center gap-2">
                                  {Icon && <Icon className="h-4 w-4" />}
                                  {category}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          {statusFilters.map((status) => {
                            const formatStatus = (s: string) => {
                              return s.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                            };
                            return (
                              <SelectItem key={status} value={status}>
                                {formatStatus(status)}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-chart-1" />
              <span className="ml-2 text-muted-foreground">Loading projects...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400">Failed to load projects. Please try again later.</p>
            </div>
          )}

          {/* Projects Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredApps.map((app) => {
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
          )}

          {!isLoading && !error && filteredApps.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground">
                {apps && apps.length === 0 
                  ? "No projects have been added yet. Check back soon!"
                  : "Try adjusting your search or filter criteria"}
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

