import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Users, Calendar, TrendingUp } from "lucide-react";
import type { Pod, InsertPod } from "@shared/schema";

interface AdminDashboardProps {
  isAdmin: boolean;
}

export function AdminDashboard({ isAdmin }: AdminDashboardProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPod, setSelectedPod] = useState<Pod | null>(null);
  const [formData, setFormData] = useState<Partial<InsertPod>>({
    name: "",
    description: "",
    status: "Planning",
    progress: 0,
    teamSize: 1,
    startDate: new Date().toISOString().split('T')[0],
    technologies: [],
  });

  const queryClient = useQueryClient();

  // Fetch pods
  const { data: pods, isLoading } = useQuery<Pod[]>({
    queryKey: ["/api/pods"],
  });

  // Create pod mutation
  const createPodMutation = useMutation({
    mutationFn: async (podData: InsertPod) => {
      const response = await fetch("/api/admin/pods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(podData),
      });
      if (!response.ok) throw new Error("Failed to create pod");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pods"] });
      setIsCreateDialogOpen(false);
      resetForm();
    },
  });

  // Update pod mutation
  const updatePodMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertPod> }) => {
      const response = await fetch(`/api/admin/pods/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update pod");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pods"] });
      setIsEditDialogOpen(false);
      resetForm();
    },
  });

  // Delete pod mutation
  const deletePodMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/pods/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete pod");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pods"] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "Planning",
      progress: 0,
      teamSize: 1,
      startDate: new Date().toISOString().split('T')[0],
      technologies: [],
    });
  };

  const handleCreate = () => {
    createPodMutation.mutate(formData as InsertPod);
  };

  const handleEdit = (pod: Pod) => {
    setSelectedPod(pod);
    setFormData({
      name: pod.name,
      description: pod.description,
      status: pod.status,
      progress: pod.progress,
      teamSize: pod.teamSize,
      startDate: new Date(pod.startDate).toISOString().split('T')[0],
      endDate: pod.endDate ? new Date(pod.endDate).toISOString().split('T')[0] : undefined,
      technologies: pod.technologies || [],
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (selectedPod) {
      updatePodMutation.mutate({ id: selectedPod.id, data: formData });
    }
  };

  const handleDelete = (id: string) => {
    deletePodMutation.mutate(id);
  };

  const statusColors = {
    Active: "bg-green-500",
    Planning: "bg-blue-500",
    Completed: "bg-purple-500",
    "On Hold": "bg-gray-500",
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-muted-foreground">You need admin privileges to access this dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage pods, apps, and milestones</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Pod
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Pod</DialogTitle>
            </DialogHeader>
            <PodForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreate}
              isLoading={createPodMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading pods...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pods?.map((pod) => (
            <Card key={pod.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-3">
                  <CardTitle className="text-lg">{pod.name}</CardTitle>
                  <Badge className={`${statusColors[pod.status as keyof typeof statusColors]} text-white`}>
                    {pod.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {pod.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-mono">{pod.progress}%</span>
                  </div>
                  <Progress value={pod.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{pod.teamSize} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(pod.startDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {pod.technologies && pod.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {pod.technologies.slice(0, 3).map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {pod.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{pod.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(pod)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Pod</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{pod.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(pod.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Pod</DialogTitle>
          </DialogHeader>
          <PodForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdate}
            isLoading={updatePodMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface PodFormProps {
  formData: Partial<InsertPod>;
  setFormData: (data: Partial<InsertPod>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

function PodForm({ formData, setFormData, onSubmit, isLoading }: PodFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Pod Name</Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter pod name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Planning">Planning</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter pod description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="progress">Progress (%)</Label>
          <Input
            id="progress"
            type="number"
            min="0"
            max="100"
            value={formData.progress || 0}
            onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="teamSize">Team Size</Label>
          <Input
            id="teamSize"
            type="number"
            min="1"
            value={formData.teamSize || 1}
            onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 1 })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate || ""}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">End Date (Optional)</Label>
        <Input
          id="endDate"
          type="date"
          value={formData.endDate || ""}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setFormData({})}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Pod"}
        </Button>
      </div>
    </div>
  );
}
