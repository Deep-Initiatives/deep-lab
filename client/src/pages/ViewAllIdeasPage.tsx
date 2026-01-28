import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Search, Loader2, User, Calendar, Filter, Clock, CheckCircle, Monitor, PlayCircle, Target, Zap, Users as UsersIcon, TrendingUp, Code, ArrowRight } from "lucide-react";
import type { IdeaSubmission } from "@shared/schema";

export default function ViewAllIdeasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedIdea, setSelectedIdea] = useState<IdeaSubmission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: ideas, isLoading, error } = useQuery<IdeaSubmission[]>({
    queryKey: ["/api/ideas"],
    queryFn: async () => {
      const response = await fetch("/api/ideas");
      if (!response.ok) throw new Error("Failed to fetch ideas");
      return response.json();
    },
  });

  const filteredIdeas = ideas?.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.problemStatement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.proposedSolution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || idea.status === selectedStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  // Calculate stats
  const stats = {
    pending: ideas?.filter(i => i.status === "pending").length || 0,
    under_review: ideas?.filter(i => i.status === "under_review").length || 0,
    in_development: ideas?.filter(i => i.status === "in_development").length || 0,
    completed: ideas?.filter(i => i.status === "completed" || i.status === "approved").length || 0,
  };

  const statusCategories = [
    { id: "pending", label: "Pending", count: stats.pending, icon: Clock, color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20" },
    { id: "under_review", label: "Under Review", count: stats.under_review, icon: Monitor, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { id: "in_development", label: "In Development", count: stats.in_development, icon: Code, color: "text-lime-500", bg: "bg-lime-500/10", border: "border-lime-500/20" },
    { id: "completed", label: "Completed", count: stats.completed, icon: CheckCircle, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-pink-500/20 text-pink-300 border-pink-500/30";
      case "under_review": return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "approved":
      case "completed": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "in_development": return "bg-lime-500/20 text-lime-300 border-lime-500/30";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const FilterContent = () => (
    <div className="space-y-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search ideas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-card border-border"
        />
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4 px-2">Status</h3>
        <div className="space-y-1">
          <Button
            variant="ghost"
            className={`w-full justify-between hover:bg-accent ${selectedStatus === 'all' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
            onClick={() => setSelectedStatus('all')}
          >
            All Ideas
            <span className="bg-muted text-muted-foreground py-0.5 px-2 rounded-full text-xs">
              {ideas?.length || 0}
            </span>
          </Button>
          {statusCategories.map((cat) => (
            <Button
              key={cat.id}
              variant="ghost"
              className={`w-full justify-between hover:bg-accent ${selectedStatus === cat.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
              onClick={() => setSelectedStatus(cat.id)}
            >
              {cat.label}
              <span className="bg-muted text-muted-foreground py-0.5 px-2 rounded-full text-xs">
                {cat.count}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />

      {/* Hero Section */}
      <div className="relative bg-[#1a1b2e] overflow-hidden pb-32 pt-24 md:pt-32">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-slate-900/40" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6"
          >
            Lab <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Ideas</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto px-4"
          >
            Explore innovative ideas submitted by our community and vote for your favorites
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-20 -mt-20 mb-20">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-16">
          {statusCategories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-card overflow-hidden relative">
                <div className={`absolute top-0 right-0 w-16 md:w-24 h-16 md:h-24 -mr-6 md:-mr-8 -mt-6 md:-mt-8 rounded-full ${cat.bg}`} />
                <CardContent className="p-4 md:p-6">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${cat.bg} flex items-center justify-center mb-3 md:mb-4`}>
                    <cat.icon className={`h-4 w-4 md:h-5 md:w-5 ${cat.color}`} />
                  </div>
                  <p className="text-muted-foreground text-xs md:text-sm font-medium mb-1">{cat.label}</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-card-foreground">{cat.count}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="hidden lg:block w-72 shrink-0"
          >
            <FilterContent />
          </motion.div>

          {/* Mobile Filter Sheet */}
          <div className="lg:hidden mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters & Search
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader className="mb-6">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <FilterContent />
              </SheetContent>
            </Sheet>
          </div>

          {/* Main Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {filteredIdeas.length} Result{filteredIdeas.length !== 1 ? 's' : ''} Found
              </h2>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredIdeas.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-2xl border border-border">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No ideas found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {filteredIdeas.map((idea) => (
                    <motion.div
                      key={idea.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => {
                        setSelectedIdea(idea);
                        setIsDialogOpen(true);
                      }}
                      className="group cursor-pointer relative overflow-hidden rounded-[32px] aspect-[4/3] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                    >
                      {/* Background Image/Gradient - mimicking the abstract wave design */}
                      <div className="absolute inset-0 bg-[#1a0b2e]">
                        {/* Background Image (User Provided) */}
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{ backgroundImage: "url('/idea-card-bg.jpg')" }}
                        />

                        {/* Dark Gradient Overlay for Text Readability - slightly lighter to show off the image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      </div>

                      {/* Status Badge - Top Right */}
                      <div className="absolute top-6 right-6 z-10">
                        <Badge className="bg-white/10 backdrop-blur-md border-white/10 text-white hover:bg-white/20 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase">
                          {getStatusLabel(idea.status)}
                        </Badge>
                      </div>

                      {/* Content - Bottom Aligned */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2 leading-tight">
                          {idea.title}
                        </h3>

                        <p className="text-gray-300 text-sm line-clamp-2 mb-6 leading-relaxed">
                          {idea.problemStatement}
                        </p>

                        <div className="flex items-center justify-between">
                          {/* Author */}
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-600/50 backdrop-blur-sm flex items-center justify-center border border-white/20">
                              <User className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-white text-sm font-medium">
                              {idea.submitterName.split(' ')[0]}
                            </span>
                          </div>

                          {/* Date */}
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-600/50 backdrop-blur-sm flex items-center justify-center border border-white/20">
                              <Calendar className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-white text-sm font-medium">
                              {new Date(idea.createdAt!).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Idea Detail Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card p-0 gap-0 border-0">
          {selectedIdea && (
            <div className="flex flex-col md:flex-row h-full">
              {/* Left Sidebar of Modal */}
              <div className="w-full md:w-1/3 bg-muted/30 p-6 border-r border-border">
                <div className="space-y-6">
                  <div>
                    <Badge className={`${getStatusColor(selectedIdea.status)} mb-4`}>
                      {getStatusLabel(selectedIdea.status)}
                    </Badge>
                    <h2 className="text-2xl font-bold text-foreground">{selectedIdea.title}</h2>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {selectedIdea.submitterName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{selectedIdea.submitterName}</p>
                      <p className="text-xs text-muted-foreground">Submitter</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-foreground font-medium">Submitted</p>
                        <p className="text-muted-foreground">{new Date(selectedIdea.createdAt!).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {selectedIdea.requiredExpertise && selectedIdea.requiredExpertise.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2">Required Expertise</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedIdea.requiredExpertise.map((exp, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {exp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content of Modal */}
              <div className="flex-1 p-6 md:p-8 space-y-8 bg-card">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-foreground mb-3">
                    <Target className="h-5 w-5 text-purple-600" />
                    Problem Statement
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedIdea.problemStatement}
                  </p>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-foreground mb-3">
                    <Zap className="h-5 w-5 text-amber-500" />
                    Proposed Solution
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedIdea.proposedSolution}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-foreground mb-3">
                      <UsersIcon className="h-5 w-5 text-blue-500" />
                      Target Audience
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {selectedIdea.targetAudience}
                    </p>
                  </div>
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-foreground mb-3">
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                      Expected Impact
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {selectedIdea.expectedImpact}
                    </p>
                  </div>
                </div>

                {selectedIdea.successMetrics && (
                  <div className="bg-muted/30 p-4 rounded-xl border border-border">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Success Metrics
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {selectedIdea.successMetrics}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}