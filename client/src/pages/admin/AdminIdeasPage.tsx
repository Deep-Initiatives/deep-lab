import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Trash2, User, Lightbulb, Calendar, CheckCircle, XCircle, Clock, Filter, Sparkles, Target } from "lucide-react";
import type { IdeaSubmission } from "@shared/schema";
import { formatDistance } from "date-fns";

export function AdminIdeasPage() {
  const [selectedIdea, setSelectedIdea] = useState<IdeaSubmission | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusUpdateData, setStatusUpdateData] = useState({ status: "", notes: "" });
  
  const queryClient = useQueryClient();

  // Fetch idea submissions
  const { data: ideas, isLoading } = useQuery<IdeaSubmission[]>({
    queryKey: ["/api/admin/ideas"],
    queryFn: async () => {
      const response = await authenticatedFetch("/api/admin/ideas");
      if (!response.ok) throw new Error("Failed to fetch idea submissions");
      return response.json();
    },
  });

  // Update idea status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const response = await authenticatedFetch(`/api/admin/ideas/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, notes }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ideas"] });
      setIsViewDialogOpen(false);
      setSelectedIdea(null);
      setStatusUpdateData({ status: "", notes: "" });
    },
  });

  // Delete idea mutation
  const deleteIdeaMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await authenticatedFetch(`/api/admin/ideas/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete idea");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ideas"] });
    },
  });

  const handleViewIdea = (idea: IdeaSubmission) => {
    setSelectedIdea(idea);
    setStatusUpdateData({ status: idea.status, notes: idea.notes || "" });
    setIsViewDialogOpen(true);
  };

  const handleUpdateStatus = () => {
    if (selectedIdea) {
      updateStatusMutation.mutate({
        id: selectedIdea.id,
        status: statusUpdateData.status,
        notes: statusUpdateData.notes,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: any, color: string }> = {
      pending: { variant: "outline", icon: Clock, color: "text-yellow-600" },
      under_review: { variant: "secondary", icon: Eye, color: "text-blue-600" },
      approved: { variant: "default", icon: CheckCircle, color: "text-green-600" },
      rejected: { variant: "destructive", icon: XCircle, color: "text-red-600" },
      in_development: { variant: "default", icon: Sparkles, color: "text-purple-600" },
    };
    
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </Badge>
    );
  };

  const filteredIdeas = ideas?.filter(idea => 
    statusFilter === "all" || idea.status === statusFilter
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading idea submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Idea Submissions</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage submitted ideas for prototyping
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ideas?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {ideas?.filter(i => i.status === "pending").length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {ideas?.filter(i => i.status === "under_review").length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {ideas?.filter(i => i.status === "approved").length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Development</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {ideas?.filter(i => i.status === "in_development").length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ideas</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="in_development">In Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredIdeas.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No idea submissions found
              </div>
            ) : (
              filteredIdeas.map((idea) => (
                <Card key={idea.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-gradient-to-br from-chart-1/10 to-chart-2/10 rounded-lg">
                            <Lightbulb className="h-6 w-6 text-chart-1" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{idea.title}</h3>
                              {getStatusBadge(idea.status)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-2">
                                <User className="h-3 w-3" />
                                {idea.submitterName}
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                Submitted {formatDistance(new Date(idea.createdAt), new Date(), { addSuffix: true })}
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {idea.problemStatement}
                            </p>

                            {idea.requiredExpertise && idea.requiredExpertise.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {idea.requiredExpertise.map((expertise, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {expertise}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewIdea(idea)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Idea Submission</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{idea.title}"? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteIdeaMutation.mutate(idea.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Idea Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Idea Submission Details</DialogTitle>
          </DialogHeader>
          {selectedIdea && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-chart-1" />
                  {selectedIdea.title}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Submitted By</Label>
                    <p className="font-medium">{selectedIdea.submitterName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Submitted On</Label>
                    <p className="font-medium">
                      {new Date(selectedIdea.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Problem Statement */}
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Target className="h-5 w-5 text-chart-2" />
                  Problem Statement
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedIdea.problemStatement}
                </p>
              </div>

              {/* Proposed Solution */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Proposed AI-Driven Solution</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedIdea.proposedSolution}
                </p>
              </div>

              {/* Target Audience */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Target Audience / Beneficiary</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedIdea.targetAudience}
                </p>
              </div>

              {/* Expected Impact */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Expected Impact / Benefits</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedIdea.expectedImpact}
                </p>
              </div>

              {/* Required Expertise */}
              {selectedIdea.requiredExpertise && selectedIdea.requiredExpertise.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Required Expertise</h3>
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
                  <h3 className="font-semibold text-lg mb-2">Potential MVP Success Metrics</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedIdea.successMetrics}
                  </p>
                </div>
              )}

              {/* Dependencies */}
              {selectedIdea.dependencies && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Dependencies / Prerequisites</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedIdea.dependencies}
                  </p>
                </div>
              )}

              {/* Status Update */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-lg mb-3">Update Status</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Status</Label>
                    <Select 
                      value={statusUpdateData.status} 
                      onValueChange={(value) => setStatusUpdateData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="in_development">In Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={statusUpdateData.notes}
                      onChange={(e) => setStatusUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Add notes about this idea submission..."
                      rows={3}
                    />
                  </div>
                  <Button 
                    onClick={handleUpdateStatus}
                    disabled={updateStatusMutation.isPending}
                    className="w-full"
                  >
                    {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

