import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import {
  ExternalLink, Sparkles, Cpu, Wrench, Globe, Calendar, Code,
  Search, Loader2, Filter, X, SlidersHorizontal, ImageIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { App, AppCategory, ProjectCategory, Industry } from "@shared/schema";
import {
  getProjectCategory,
  getIndustryColor,
  getCategoryGradient,
  filterProjects,
  getAllTechnologies,
  getAllIndustries,
  sortProjects,
  formatStatus
} from "@/lib/projectUtils";

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
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "All">("All");
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "newest" | "oldest">("newest");
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [, setLocation] = useLocation();

  // Fetch all apps from the database
  const { data: apps, isLoading, error } = useQuery<App[]>({
    queryKey: ["/api/apps"],
  });

  // Get all unique technologies and industries
  const allTechnologies = useMemo(() => {
    return apps ? getAllTechnologies(apps) : [];
  }, [apps]);

  const allIndustries = useMemo(() => {
    return apps ? getAllIndustries(apps) : [];
  }, [apps]);

  // Filter and sort projects
  const filteredAndSortedApps = useMemo(() => {
    if (!apps) return [];

    const filtered = filterProjects(
      apps,
      {
        category: selectedCategory,
        technologies: selectedTechnologies,
        industries: selectedIndustries,
        searchTerm,
      },
      "app"
    );

    return sortProjects(filtered, sortBy);
  }, [apps, selectedCategory, selectedTechnologies, selectedIndustries, searchTerm, sortBy]);

  // Group projects by category
  const projectsByCategory = useMemo(() => {
    const grouped: Record<ProjectCategory, App[]> = {
      "Lined Up": [],
      "In Progress": [],
      "Completed": [],
    };

    filteredAndSortedApps.forEach(app => {
      const category = getProjectCategory(app.status, "app");
      grouped[category].push(app);
    });

    return grouped;
  }, [filteredAndSortedApps]);

  const toggleTechnology = (tech: string) => {
    setSelectedTechnologies(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
    );
  };

  const clearAllFilters = () => {
    setSelectedTechnologies([]);
    setSelectedIndustries([]);
    setSearchTerm("");
    setSelectedCategory("All");
  };

  const activeFilterCount = selectedTechnologies.length + selectedIndustries.length + (selectedCategory !== "All" ? 1 : 0);

  const renderProjectCard = (app: App) => {
    const Icon = categoryIcons[app.category as AppCategory];
    const gradientColor = categoryColors[app.category as AppCategory];
    const projectCategory = getProjectCategory(app.status, "app");
    const categoryGradient = getCategoryGradient(projectCategory);

    return (
      <Card
        key={app.id}
        className="group h-full flex flex-col backdrop-blur-md bg-background border-none shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden"
        data-testid={`card-app-${app.id}`}
      >
        {/* Image Area */}
        <div className="p-4 pb-0 bg-background">
          <div className="h-48 w-full rounded-2xl bg-muted/30 relative overflow-hidden flex items-center justify-center border border-border/50">
            {app.imageUrl ? (
              <img
                src={app.imageUrl}
                alt={app.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-10`} />
                <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
              </>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col p-6 pt-4">
          {/* Header Row: Icon + Status */}
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradientColor} shadow-sm`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col gap-1 items-end">
              <Badge variant="secondary" className="text-xs font-medium px-2.5 py-1 bg-muted text-muted-foreground hover:bg-muted/80">
                {formatStatus(app.status)}
              </Badge>
              {app.industry && (
                <Badge className={`text-xs border ${getIndustryColor(app.industry)}`}>
                  {app.industry}
                </Badge>
              )}
            </div>
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

          {/* Tags - Pill Style */}
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
        <CardFooter className="p-4 pt-0 bg-background">
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
                <DialogTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${gradientColor}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{app.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{formatStatus(app.status)}</Badge>
                      <Badge variant="outline">{app.category}</Badge>
                      {app.industry && (
                        <Badge className={`border ${getIndustryColor(app.industry)}`}>
                          {app.industry}
                        </Badge>
                      )}
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
      </Card >
    );
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 pt-24 pb-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 text-transparent bg-clip-text mb-6">
              Our Innovation Portfolio
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our projects organized by development stage: Lined up, In Progress, and Completed
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="Search projects by name, description, or technology..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="oldest">Oldest First</SelectItem>
                          <SelectItem value="name">Name (A-Z)</SelectItem>
                        </SelectContent>
                      </Select>
                      <Popover open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant={activeFilterCount > 0 ? "default" : "outline"}
                            className="relative"
                          >
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            Filters
                            {activeFilterCount > 0 && (
                              <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-chart-1">
                                {activeFilterCount}
                              </Badge>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[500px] p-0" align="end" side="bottom">
                          <div className="max-h-[600px] overflow-hidden flex flex-col">
                            <div className="p-6 border-b">
                              <h3 className="text-xl font-bold">Filters</h3>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                              {/* Tags Search */}
                              <div>
                                <Label className="text-sm font-medium mb-2 block">TAGS</Label>
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="Search for tags. Ex: SingularityNET RFP"
                                    value={tagSearch}
                                    onChange={(e) => setTagSearch(e.target.value)}
                                    className="pl-10"
                                  />
                                </div>
                              </div>

                              {/* Technology Filters */}
                              <div>
                                <Label className="text-sm font-medium mb-3 block">Technology</Label>
                                <div className="flex flex-wrap gap-2">
                                  {allTechnologies
                                    .filter(tech =>
                                      tagSearch === "" ||
                                      tech.toLowerCase().includes(tagSearch.toLowerCase())
                                    )
                                    .map((tech) => (
                                      <Button
                                        key={tech}
                                        variant={selectedTechnologies.includes(tech) ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => toggleTechnology(tech)}
                                        className="rounded-full"
                                      >
                                        {tech}
                                      </Button>
                                    ))}
                                  {allTechnologies.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No technologies available</p>
                                  )}
                                </div>
                              </div>

                              {/* Industry Filters */}
                              <div>
                                <Label className="text-sm font-medium mb-3 block">Industry</Label>
                                <div className="flex flex-wrap gap-2">
                                  {allIndustries
                                    .filter(industry =>
                                      tagSearch === "" ||
                                      industry.toLowerCase().includes(tagSearch.toLowerCase())
                                    )
                                    .map((industry) => (
                                      <Button
                                        key={industry}
                                        variant={selectedIndustries.includes(industry) ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => toggleIndustry(industry)}
                                        className="rounded-full"
                                      >
                                        {industry}
                                      </Button>
                                    ))}
                                  {allIndustries.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No industries tagged yet</p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Apply Filters Button */}
                            <div className="p-6 border-t">
                              <Button
                                onClick={() => setIsFilterModalOpen(false)}
                                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                                size="lg"
                              >
                                Apply Filters
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === "All" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory("All")}
                      className="rounded-full"
                    >
                      All Projects
                    </Button>
                    <Button
                      variant={selectedCategory === "Lined Up" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory("Lined Up")}
                      className="rounded-full"
                    >
                      Lined Up
                    </Button>
                    <Button
                      variant={selectedCategory === "In Progress" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory("In Progress")}
                      className="rounded-full"
                    >
                      In Progress
                    </Button>
                    <Button
                      variant={selectedCategory === "Completed" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory("Completed")}
                      className="rounded-full"
                    >
                      Completed
                    </Button>
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredAndSortedApps.map(renderProjectCard)}
              </div>

              {filteredAndSortedApps.length === 0 && (
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
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
