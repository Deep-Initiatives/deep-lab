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
import { Eye, Trash2, Mail, User, Briefcase, Calendar, CheckCircle, XCircle, Clock, Filter } from "lucide-react";
import type { Application } from "@shared/schema";
import { formatDistance } from "date-fns";

export function AdminApplicationsPage() {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusUpdateData, setStatusUpdateData] = useState({ status: "", notes: "" });
  
  const queryClient = useQueryClient();

  // Fetch applications
  const { data: applications, isLoading } = useQuery<Application[]>({
    queryKey: ["/api/admin/applications"],
    queryFn: async () => {
      const response = await authenticatedFetch("/api/admin/applications");
      if (!response.ok) throw new Error("Failed to fetch applications");
      return response.json();
    },
  });

  // Update application status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const response = await authenticatedFetch(`/api/admin/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, notes }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      setIsViewDialogOpen(false);
      setSelectedApplication(null);
      setStatusUpdateData({ status: "", notes: "" });
    },
  });

  // Delete application mutation
  const deleteApplicationMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await authenticatedFetch(`/api/admin/applications/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete application");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
    },
  });

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setStatusUpdateData({ status: application.status, notes: application.notes || "" });
    setIsViewDialogOpen(true);
  };

  const handleUpdateStatus = () => {
    if (selectedApplication) {
      updateStatusMutation.mutate({
        id: selectedApplication.id,
        status: statusUpdateData.status,
        notes: statusUpdateData.notes,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: any }> = {
      pending: { variant: "outline", icon: Clock },
      reviewed: { variant: "secondary", icon: Eye },
      accepted: { variant: "default", icon: CheckCircle },
      rejected: { variant: "destructive", icon: XCircle },
    };
    
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredApplications = applications?.filter(app => 
    statusFilter === "all" || app.status === statusFilter
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Applications</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage team applications
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {applications?.filter(a => a.status === "pending").length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {applications?.filter(a => a.status === "reviewed").length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {applications?.filter(a => a.status === "accepted").length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Applications</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredApplications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No applications found
              </div>
            ) : (
              filteredApplications.map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <h3 className="font-semibold text-lg">{application.fullName}</h3>
                              {getStatusBadge(application.status)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3" />
                                {application.email}
                              </div>
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-3 w-3" />
                                {application.role}
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                Applied {formatDistance(new Date(application.createdAt), new Date(), { addSuffix: true })}
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3" />
                                {application.availability}
                              </div>
                            </div>

                            {application.skills && application.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {application.skills.slice(0, 5).map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {application.skills.length > 5 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{application.skills.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewApplication(application)}
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
                              <AlertDialogTitle>Delete Application</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this application from {application.fullName}? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteApplicationMutation.mutate(application.id)}
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

      {/* View Application Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="font-medium">{selectedApplication.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Role</Label>
                    <p className="font-medium">{selectedApplication.role}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Experience</Label>
                    <p className="font-medium">{selectedApplication.experience}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Availability</Label>
                    <p className="font-medium">{selectedApplication.availability}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Applied</Label>
                    <p className="font-medium">
                      {new Date(selectedApplication.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Links */}
              {(selectedApplication.linkedin || selectedApplication.github || selectedApplication.portfolio) && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Professional Links</h3>
                  <div className="space-y-2 text-sm">
                    {selectedApplication.linkedin && (
                      <div>
                        <Label className="text-muted-foreground">LinkedIn</Label>
                        <a href={selectedApplication.linkedin} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:underline block">
                          {selectedApplication.linkedin}
                        </a>
                      </div>
                    )}
                    {selectedApplication.github && (
                      <div>
                        <Label className="text-muted-foreground">GitHub</Label>
                        <a href={selectedApplication.github} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:underline block">
                          {selectedApplication.github}
                        </a>
                      </div>
                    )}
                    {selectedApplication.portfolio && (
                      <div>
                        <Label className="text-muted-foreground">Portfolio</Label>
                        <a href={selectedApplication.portfolio} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:underline block">
                          {selectedApplication.portfolio}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Skills */}
              {selectedApplication.skills && selectedApplication.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Motivation */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Motivation</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedApplication.motivation}
                </p>
              </div>

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
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={statusUpdateData.notes}
                      onChange={(e) => setStatusUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Add notes about this application..."
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

