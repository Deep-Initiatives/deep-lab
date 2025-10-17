import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Award, Milestone, Handshake, Clock, Code } from "lucide-react";
import type { TimelineMilestone } from "@shared/schema";

interface TimelineProps {
  milestones: TimelineMilestone[];
}

const milestoneIcons = {
  launch: Rocket,
  achievement: Award,
  milestone: Milestone,
  partnership: Handshake,
  registration: Clock,
  hackathon: Code,
};

const milestoneColors = {
  launch: "from-chart-1 to-chart-2",
  achievement: "from-chart-2 to-chart-3",
  milestone: "from-chart-3 to-chart-4",
  partnership: "from-chart-4 to-chart-5",
  registration: "from-chart-1 to-chart-3",
  hackathon: "from-chart-2 to-chart-4",
};

export function Timeline({ milestones }: TimelineProps) {
  return (
    <section id="journey" className="py-20 md:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Journey</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Your roadmap from inception to innovation
          </p>
          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-chart-1 to-chart-3" />
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 transform -translate-x-1/2 bg-gradient-to-b from-chart-1 via-chart-2 to-chart-3" />

          <div className="space-y-16">
            {milestones.map((milestone, index) => {
              const Icon = milestoneIcons[milestone.type as keyof typeof milestoneIcons] || Rocket;
              const gradientColor = milestoneColors[milestone.type as keyof typeof milestoneColors] || milestoneColors.launch;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={milestone.id}
                  className={`relative flex items-center ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-8`}
                  data-testid={`milestone-${milestone.id}`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center z-10 bg-gradient-to-br from-chart-1 to-chart-3 border-4 border-background">
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 ${isEven ? 'md:pr-16' : 'md:pl-16'} ml-12 md:ml-0`}>
                    <Card className="backdrop-blur-sm bg-background/80 border-border hover:scale-105 transition-all duration-300">
                      <CardContent className="p-6">
                        {/* Date */}
                        <div className="text-sm font-medium mb-2 text-chart-2">
                          {new Date(milestone.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>

                        {/* Title with Icon */}
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold">{milestone.title}</h3>
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${gradientColor}`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}