import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import {
  ExternalLink, Sparkles, Cpu, Wrench, Globe, Calendar, Code,
  Search, Loader2, Filter, X, SlidersHorizontal, ImageIcon,
  CheckCircle, Clock, PlayCircle, Minimize2, ArrowUpDown
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { App, AppCategory, ProjectCategory } from "@shared/schema";
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
  "AI Agent": "from-purple-500 to-indigo-600",
  "Web App": "from-blue-500 to-cyan-400",
  Tool: "from-emerald-400 to-green-600",
  Service: "from-orange-400 to-pink-600",
};

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "All">("All");
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "newest" | "oldest">("newest");
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [, setLocation] = useLocation();

  // Fetch stats separately for the top cards
  const { data: statsData } = useQuery({
    queryKey: ["/api/apps/stats"],
    queryFn: async () => {
      const res = await fetch("/api/apps/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    }
  });

  // Fetch apps with server-side filtering for category
  const { data: apps, isLoading, error } = useQuery<App[]>({
    queryKey: ["/api/apps", selectedCategory],
    queryFn: async () => {
      const url = selectedCategory === "All"
        ? "/api/apps"
        : `/api/apps?status=${encodeURIComponent(selectedCategory)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch apps");
      return res.json();
    }
  });

  // Derived state
  const allTechnologies = useMemo(() => apps ? getAllTechnologies(apps) : [], [apps]);

  // Use server stats if available, otherwise fallback (though server stats should be robust)
  const stats = useMemo(() => {
    if (statsData) return statsData;
    return { linedUp: 0, inProgress: 0, completed: 0 };
  }, [statsData]);

  const filteredAndSortedApps = useMemo(() => {
    if (!apps) return [];

    // Client-side filtering for Tech, Industry, Search 
    // (Category is already handled by server query, so passed as "All" or ignored in filter helper if we pass "All" effectively)
    // Actually `filterProjects` expects `selectedCategory`.
    // If we already filtered by category on server, `apps` only contains matches.
    // So we can pass "All" to filterProjects to skip re-checking category, OR pass actual category (redundant but safe).
    // Passing "All" is safer if server returned subset.

    const filtered = filterProjects(
      apps,
      {
        category: "All", // Already filtered by server
        technologies: selectedTechnologies,
        industries: selectedIndustries,
        searchTerm,
      },
      "app"
    );

    return sortProjects(filtered, sortBy);
  }, [apps, selectedTechnologies, selectedIndustries, searchTerm, sortBy]);

  const toggleTechnology = (tech: string) => {
    setSelectedTechnologies(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const FiltersContent = () => (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card border-border shadow-sm"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-bold text-foreground mb-3 block">Sort By</h3>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-full bg-card border-border shadow-sm text-foreground">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Category */}
      <div>
        <h3 className="font-bold text-foreground mb-3 px-2">Status</h3>
        <div className="space-y-1">
          {[
            { id: "All", label: "All Projects", count: apps?.length || 0 },
            { id: "Lined Up", label: "Lined Up", count: stats.linedUp },
            { id: "In Progress", label: "In Progress", count: stats.inProgress },
            { id: "Paused", label: "Paused", count: stats.paused || 0 },
            { id: "Completed", label: "Completed", count: stats.completed },
            { id: "Cancelled", label: "Cancelled", count: stats.cancelled || 0 },
          ].map((cat) => (
            <Button
              key={cat.id}
              variant="ghost"
              className={`w-full justify-between hover:bg-accent rounded-lg ${selectedCategory === cat.id ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground'}`}
              onClick={() => setSelectedCategory(cat.id as any)}
            >
              {cat.label}
              <span className={`py-0.5 px-2 rounded-md text-xs ${selectedCategory === cat.id ? 'bg-background text-primary shadow-sm' : 'bg-muted text-muted-foreground'}`}>
                {cat.count}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Technologies */}
      {allTechnologies.length > 0 && (
        <div>
          <h3 className="font-bold text-foreground mb-3 px-2">Technologies</h3>
          <div className="flex flex-wrap gap-2 px-1">
            {allTechnologies.slice(0, 10).map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className={`cursor-pointer px-3 py-1 font-normal ${selectedTechnologies.includes(tech) ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground border border-border hover:bg-accent'}`}
                onClick={() => toggleTechnology(tech)}
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />

      {/* Hero Section */}
      <div className="relative bg-[#1a0b2e] overflow-hidden pb-32 pt-24 md:pt-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a1b4e] via-[#1a0b2e] to-[#11051e] opacity-100" />
        <div className="absolute top-0 left-0 right-0 h-full bg-[url('/grid-pattern.svg')] opacity-5" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight"
          >
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9a9e] to-[#a18cd1]">Innovation Portfolio</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto font-medium"
          >
            Explore our projects organized by development stage: Lined up, In Progress, and Completed
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-20 -mt-24 mb-20">
        {/* Stats Cards - Overlapping Hero and Body */}
        {/* Mobile: 2 columns, Desktop: 3 columns. Matches Ideas Page density. */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12">
          {[
            { label: "Lined Up", count: stats.linedUp, icon: Minimize2, color: "text-purple-500 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/20", decoration: "bg-purple-500/10", border: "border-purple-500/20" },
            { label: "In Progress", count: stats.inProgress, icon: Loader2, color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/20", decoration: "bg-amber-500/10", border: "border-amber-500/20" },
            { label: "Completed", count: stats.completed, icon: CheckCircle, color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/20", decoration: "bg-blue-500/10", border: "border-blue-500/20" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={i === 2 ? "col-span-2 lg:col-span-1" : ""}
            >
              <Card className="border-0 shadow-lg dark:shadow-none dark:bg-card/50 dark:border-white/5 bg-white overflow-hidden relative h-32 md:h-40 group hover:shadow-xl transition-all duration-300">
                {/* Top Right Corner Decoration - Quarter Circle */}
                <div className={`absolute -top-4 -right-4 md:-top-6 md:-right-6 w-16 h-16 md:w-24 md:h-24 rounded-full ${stat.decoration} opacity-100`} />

                <CardContent className="p-4 md:p-6 h-full flex flex-col justify-between relative z-10">
                  {/* Icon */}
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                    <stat.icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.color}`} />
                  </div>

                  <div>
                    <p className="text-muted-foreground font-medium text-xs md:text-sm mb-1">{stat.label}</p>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">{stat.count}</h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Detailed Sidebar Filter (Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:block w-72 shrink-0 space-y-8"
          >
            <FiltersContent />
          </motion.div>

          {/* Mobile Filter Sheet */}
          <div className="lg:hidden mb-6 w-full">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2 h-12 bg-card">
                  <Filter className="h-4 w-4" />
                  Filters & Search
                  {(selectedTechnologies.length > 0 || selectedIndustries.length > 0 || selectedCategory !== "All") && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                      !
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader className="mb-6">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <FiltersContent />
              </SheetContent>
            </Sheet>
          </div>

          {/* Main Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                {filteredAndSortedApps.length} Result{filteredAndSortedApps.length !== 1 ? 's' : ''} Found
              </h2>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredAndSortedApps.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-sm">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No projects found</h3>
                <p className="text-muted-foreground">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAndSortedApps.map((app) => (
                  <ProjectCard
                    key={app.id}
                    app={app}
                    onClick={() => setSelectedApp(app)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
          {selectedApp && <AppDetailsContent app={selectedApp} />}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

// Subcomponents
function ProjectCard({ app, onClick }: { app: App; onClick: () => void }) {
  const Icon = categoryIcons[app.category as AppCategory] || Sparkles;
  const gradientColor = categoryColors[app.category as AppCategory] || "from-slate-500 to-slate-700";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative flex flex-col bg-card border border-border/50 shadow-lg rounded-[28px] overflow-hidden hover:shadow-2xl transition-all duration-300 h-full"
    >
      {/* Cover Image Area (Top ~45%) */}
      <div className="h-48 w-full relative bg-[#1a0b2e] overflow-hidden">
        {app.imageUrl ? (
          <img
            src={app.imageUrl}
            alt={app.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientColor} opacity-20 flex items-center justify-center`}>
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        {/* Status Badge Overlapping */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-background/90 backdrop-blur-sm text-foreground hover:bg-background shadow-sm font-semibold uppercase tracking-wider text-[10px] px-2 py-1">
            {formatStatus(app.status)}
          </Badge>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 pt-0 flex flex-col relative">
        {/* Icon Overlapping */}
        <div className="-mt-8 mb-3 inline-flex p-2 rounded-xl bg-card shadow-md w-fit z-10 mx-0 border border-border/50">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${gradientColor}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {app.name}
        </h3>

        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
          {app.description}
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {app.technologies?.slice(0, 3).map((tech, i) => (
            <Badge key={i} variant="secondary" className="text-[11px] font-medium px-2.5 bg-muted/50 text-muted-foreground hover:bg-muted">
              {tech}
            </Badge>
          ))}
          {app.technologies && app.technologies.length > 3 && (
            <span className="text-[10px] text-muted-foreground flex items-center px-1 font-medium">
              +{app.technologies.length - 3}
            </span>
          )}
        </div>

        <Button
          variant="outline"
          className="w-full mt-auto bg-card border-border text-foreground hover:bg-accent font-medium rounded-xl h-11"
          onClick={onClick}
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
}

function AppDetailsContent({ app }: { app: App }) {
  const Icon = categoryIcons[app.category as AppCategory] || Sparkles;
  const gradientColor = categoryColors[app.category as AppCategory] || "from-slate-500 to-slate-700";

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-4 text-2xl">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientColor}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            {app.name}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">{formatStatus(app.status)}</Badge>
              <Badge variant="outline">{app.category}</Badge>
            </div>
          </div>
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-base leading-relaxed">
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

        <div className="grid grid-cols-2 gap-4">
          {app.demoUrl && (
            <Button asChild className="w-full">
              <a href={app.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Live Demo
              </a>
            </Button>
          )}
          {/* Placeholder for future links */}
        </div>
      </div>
    </div>
  )
}

function activeFilterCount(techs: string[], industries: string[], category: string) {
  return techs.length + industries.length + (category !== "All" ? 1 : 0);
}
