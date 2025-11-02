import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Search, Lightbulb, Calendar, User, Filter, Loader2, Target, Zap, CheckCircle, TrendingUp, Users as UsersIcon, Code } from "lucide-react";
import type { IdeaSubmission } from "@shared/schema";

export default function ViewAllIdeasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedIdea, setSelectedIdea] = useState<IdeaSubmission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const statusFilters = ["all", "pending", "under_review", "approved", "in_development"];
  
  // Fetch ideas from the database
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20";
      case "under_review": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20";
      case "approved": return "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20";
      case "in_development": return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20";
      case "rejected": return "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20";
      default: return "bg-muted text-muted-foreground border";
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 text-transparent bg-clip-text mb-6">
              Community Ideas
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore innovative ideas submitted by our community and vote for your favorites
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
                        placeholder="Search ideas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {statusFilters.map((status) => (
                      <Button
                        key={status}
                        variant={selectedStatus === status ? "default" : "outline"}
                        onClick={() => setSelectedStatus(status)}
                        className="capitalize"
                      >
                        {status === "all" ? "All" : formatStatus(status)}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-chart-1" />
              <span className="ml-2 text-muted-foreground">Loading ideas...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400">Failed to load ideas. Please try again later.</p>
            </div>
          )}

          {/* Ideas Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredIdeas.map((idea) => (
                <Card 
                  key={idea.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedIdea(idea);
                    setIsDialogOpen(true);
                  }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{idea.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{idea.problemStatement}</p>
                      </div>
                      <Badge className={getStatusColor(idea.status)}>
                        {formatStatus(idea.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span className="line-clamp-1">{idea.submitterName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{idea.createdAt ? new Date(idea.createdAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>

                      {idea.requiredExpertise && idea.requiredExpertise.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {idea.requiredExpertise.slice(0, 3).map((expertise, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {expertise}
                            </Badge>
                          ))}
                          {idea.requiredExpertise.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{idea.requiredExpertise.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          <span className="font-medium">Solution:</span> {idea.proposedSolution}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Idea Details Modal */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              {selectedIdea && (
                <>
                  <DialogHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <DialogTitle className="text-2xl md:text-3xl font-bold mb-2">
                          {selectedIdea.title}
                        </DialogTitle>
                        <DialogDescription className="flex items-center gap-4 mt-2">
                          <Badge className={getStatusColor(selectedIdea.status)}>
                            {formatStatus(selectedIdea.status)}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>{selectedIdea.submitterName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{selectedIdea.createdAt ? new Date(selectedIdea.createdAt).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>
                  
                  <div className="space-y-6 mt-4">
                    {/* Problem Statement */}
                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <Target className="h-5 w-5 text-chart-1" />
                        Problem Statement
                      </h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {selectedIdea.problemStatement}
                      </p>
                    </div>

                    {/* Proposed Solution */}
                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-chart-2" />
                        Proposed Solution
                      </h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {selectedIdea.proposedSolution}
                      </p>
                    </div>

                    {/* Target Audience */}
                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <UsersIcon className="h-5 w-5 text-chart-3" />
                        Target Audience
                      </h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {selectedIdea.targetAudience}
                      </p>
                    </div>

                    {/* Expected Impact */}
                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-chart-4" />
                        Expected Impact
                      </h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {selectedIdea.expectedImpact}
                      </p>
                    </div>

                    {/* Required Expertise */}
                    {selectedIdea.requiredExpertise && selectedIdea.requiredExpertise.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <Code className="h-5 w-5 text-chart-5" />
                          Required Expertise
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedIdea.requiredExpertise.map((expertise, index) => (
                            <Badge key={index} variant="secondary" className="text-sm">
                              {expertise}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Success Metrics */}
                    {selectedIdea.successMetrics && (
                      <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          Success Metrics
                        </h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {selectedIdea.successMetrics}
                        </p>
                      </div>
                    )}

                    {/* Dependencies */}
                    {selectedIdea.dependencies && (
                      <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                          <Filter className="h-5 w-5 text-orange-500" />
                          Dependencies
                        </h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {selectedIdea.dependencies}
                        </p>
                      </div>
                    )}

                    {/* Notes (if any) */}
                    {selectedIdea.notes && (
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Notes</h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {selectedIdea.notes}
                        </p>
                      </div>
                    )}

                    {/* Timestamps */}
                    <div className="pt-4 border-t text-sm text-muted-foreground space-y-1">
                      {selectedIdea.createdAt && (
                        <p>Submitted: {new Date(selectedIdea.createdAt).toLocaleString()}</p>
                      )}
                      {selectedIdea.updatedAt && selectedIdea.updatedAt !== selectedIdea.createdAt && (
                        <p>Last Updated: {new Date(selectedIdea.updatedAt).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          {!isLoading && !error && filteredIdeas.length === 0 && (
            <div className="text-center py-12">
              <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No ideas found</h3>
              <p className="text-muted-foreground">
                {ideas && ideas.length === 0 
                  ? "No ideas have been submitted yet. Be the first to submit an idea!"
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