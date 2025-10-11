import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp } from "lucide-react";
import type { Pod } from "@shared/schema";

interface PodsSectionProps {
  pods: Pod[];
}

const statusColors = {
  Active: "bg-chart-4",
  Planning: "bg-chart-5",
  Completed: "bg-chart-3",
  "On Hold": "bg-muted",
};

export function PodsSection({ pods }: PodsSectionProps) {
  return (
    <section id="pods" className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Active Innovation Pods</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our dedicated teams working on cutting-edge prototypes and MVPs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {pods.map((pod) => (
            <Card
              key={pod.id}
              className="backdrop-blur-sm bg-card/50 border-card-border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              data-testid={`card-pod-${pod.id}`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold flex-1">{pod.name}</h3>
                  <Badge className={`${statusColors[pod.status]} text-white border-0`}>
                    {pod.status === "Active" && (
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-glow" />
                        {pod.status}
                      </span>
                    )}
                    {pod.status !== "Active" && pod.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {pod.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-mono font-semibold">{pod.progress}%</span>
                  </div>
                  <Progress
                    value={pod.progress}
                    className="h-2"
                    data-testid={`progress-${pod.id}`}
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{pod.teamSize} members</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>Since {new Date(pod.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>

                {pod.technologies && pod.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {pod.technologies.slice(0, 3).map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
