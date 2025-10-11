import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Award, Milestone, Handshake } from "lucide-react";
import type { TimelineMilestone } from "@shared/schema";

interface TimelineProps {
  milestones: TimelineMilestone[];
}

const milestoneIcons = {
  launch: Rocket,
  achievement: Award,
  milestone: Milestone,
  partnership: Handshake,
};

const milestoneColors = {
  launch: "from-chart-1 to-chart-2",
  achievement: "from-chart-2 to-chart-3",
  milestone: "from-chart-3 to-chart-4",
  partnership: "from-chart-4 to-chart-5",
};

export function Timeline({ milestones }: TimelineProps) {
  return (
    <section id="journey" className="py-20 md:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Journey</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Milestones and achievements since our inception in June 2025
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-chart-1 via-chart-2 to-chart-3" />

          <div className="space-y-12">
            {milestones.map((milestone, index) => {
              const Icon = milestoneIcons[milestone.type];
              const gradientColor = milestoneColors[milestone.type];
              const isEven = index % 2 === 0;

              return (
                <div
                  key={milestone.id}
                  className={`relative flex items-center ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-8`}
                  data-testid={`milestone-${milestone.id}`}
                >
                  <div className="hidden md:block flex-1" />

                  <div className="absolute left-4 md:left-1/2 -ml-3 md:-ml-4 w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-chart-1 to-chart-3 border-4 border-background flex items-center justify-center z-10">
                    <Icon className="h-3 w-3 md:h-4 md:w-4 text-white" />
                  </div>

                  <Card className="flex-1 ml-12 md:ml-0 backdrop-blur-sm bg-background/80 border-border hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${gradientColor} flex-shrink-0`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-lg font-semibold">{milestone.title}</h3>
                            <time className="text-sm text-muted-foreground whitespace-nowrap font-mono">
                              {new Date(milestone.date).toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric',
                              })}
                            </time>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

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
