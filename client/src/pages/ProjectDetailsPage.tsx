import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ExternalLink, Github, Calendar, Users, TrendingUp, Code, Globe, Cpu, Wrench, Sparkles } from "lucide-react";
import type { App, Pod } from "@shared/schema";

interface ProjectDetailsPageProps {
  projectId: string;
}

const categoryIcons: Record<string, any> = {
  "AI Agent": Sparkles,
  "Web App": Globe,
  Tool: Wrench,
  Service: Cpu,
};

const statusColors = {
  Live: "bg-green-500",
  Beta: "bg-blue-500",
  Prototype: "bg-yellow-500",
  "In Development": "bg-purple-500",
};

export function ProjectDetailsPage({ projectId }: ProjectDetailsPageProps) {
  const [, setLocation] = useLocation();

  // Fetch project details
  const { data: project, isLoading: projectLoading, error: projectError } = useQuery<App>({
    queryKey: [`/api/apps/${projectId}`],
  });

  // Fetch all pods to find the one associated with this project
  const { data: pods } = useQuery<Pod[]>({
    queryKey: ["/api/pods"],
  });

  const associatedPod = pods?.find(pod => pod.id === project?.podId);

  if (projectLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chart-2 mx-auto"></div>
          <p className="text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold">Project Not Found</h2>
          <p className="text-muted-foreground">The project you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation("/")} variant="default">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const Icon = categoryIcons[project.category] || Code;

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-chart-1 to-chart-3">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl">{project.name}</CardTitle>
                      <p className="text-muted-foreground mt-1">{project.category}</p>
                    </div>
                  </div>
                  <Badge className={`${statusColors[project.status as keyof typeof statusColors]} text-white`}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">{project.description}</p>
              </CardContent>
            </Card>

            {/* Technologies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Technologies Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Links */}
            {(project.demoUrl || project.githubUrl) && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border rounded-lg hover-elevate transition-colors"
                    >
                      <ExternalLink className="h-5 w-5 text-chart-2" />
                      <div>
                        <div className="font-medium">Live Demo</div>
                        <div className="text-sm text-muted-foreground">{project.demoUrl}</div>
                      </div>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border rounded-lg hover-elevate transition-colors"
                    >
                      <Github className="h-5 w-5 text-chart-2" />
                      <div>
                        <div className="font-medium">Source Code</div>
                        <div className="text-sm text-muted-foreground">{project.githubUrl}</div>
                      </div>
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Associated Pod */}
            {associatedPod && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Development Pod
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">{associatedPod.name}</h4>
                    <p className="text-sm text-muted-foreground">{associatedPod.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-mono">{associatedPod.progress}%</span>
                    </div>
                    <Progress value={associatedPod.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{associatedPod.teamSize} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(associatedPod.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {associatedPod.technologies && associatedPod.technologies.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Pod Technologies</div>
                      <div className="flex flex-wrap gap-1">
                        {associatedPod.technologies.map((tech, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Project Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Project Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{project.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">{project.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Technologies</span>
                  <span className="font-medium">{project.technologies.length}</span>
                </div>
                {associatedPod && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Team Size</span>
                    <span className="font-medium">{associatedPod.teamSize}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {project.demoUrl && (
                  <Button asChild className="w-full">
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Live Demo
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button asChild variant="outline" className="w-full">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      View Source Code
                    </a>
                  </Button>
                )}
                <Button variant="ghost" className="w-full" onClick={() => setLocation("/")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Projects
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
