import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowRight, Lightbulb, Users, Laptop, Database, Brain, CheckCircle, Clock, Rocket, Target, Sparkles, TrendingUp, Zap, Award, GitBranch, MessageSquare, Trophy, Blocks } from "lucide-react";

export default function WorkflowOverviewPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        
        {/* Hero Header with Animated Gradient */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-chart-1/10 via-chart-2/10 to-chart-3/10 animate-gradient"></div>
          <div className="container mx-auto px-4 pt-32 pb-20 relative">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-6 text-lg px-6 py-2 bg-gradient-to-r from-chart-1 to-chart-2 text-white border-0">
                <Sparkles className="h-4 w-4 mr-2" />
                Rapid Prototyping Initiative
              </Badge>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
                <span className="bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 text-transparent bg-clip-text">
                  Deep Funding LABS
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                Transforming Bold Ideas into AI-Driven Solutions Through 
                <span className="font-semibold text-foreground"> Agile Innovation</span>
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-16">
          
          {/* Launching Stats - Enhanced Design */}
          <div className="mb-20 mt-16">
            <Card className="border-2 border-muted shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-chart-1/5 via-chart-2/5 to-chart-3/5 p-8 md:p-12">
                <div className="text-center mb-12">
                  <div className="inline-block p-3 bg-background rounded-full mb-4 shadow-lg">
                    <Rocket className="h-8 w-8 text-chart-1" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Launching with a 
                    <span className="bg-gradient-to-r from-chart-1 to-chart-2 text-transparent bg-clip-text"> Focused & Agile </span>
                    Structure
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    Deep Labs is a <span className="font-semibold text-foreground">lean, powerful initiative</span> designed for rapid innovation. 
                    Built around small, dedicated teams called <span className="font-semibold text-chart-1">pods</span>, ensuring agility and laser focus 
                    on building next-generation AI solutions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                  <div className="group relative py-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-chart-1 to-chart-2 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative bg-background rounded-2xl p-10 text-center border-2 border-muted hover:border-chart-1 transition-all hover:scale-105 hover:shadow-2xl min-h-[280px] flex flex-col justify-center">
                      <div className="inline-block p-4 bg-chart-1/10 rounded-full mb-6 mx-auto">
                        <Blocks className="h-8 w-8 text-chart-1" />
                      </div>
                      <div className="text-6xl font-extrabold bg-gradient-to-br from-chart-1 to-chart-2 text-transparent bg-clip-text mb-4">4</div>
                      <div className="text-lg font-bold mb-2">Prototyping Pods</div>
                      <p className="text-sm text-muted-foreground">Self-contained innovation units</p>
                    </div>
                  </div>

                  <div className="group relative py-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-chart-2 to-chart-3 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative bg-background rounded-2xl p-10 text-center border-2 border-muted hover:border-chart-2 transition-all hover:scale-105 hover:shadow-2xl min-h-[280px] flex flex-col justify-center">
                      <div className="inline-block p-4 bg-chart-2/10 rounded-full mb-6 mx-auto">
                        <Users className="h-8 w-8 text-chart-2" />
                      </div>
                      <div className="text-6xl font-extrabold bg-gradient-to-br from-chart-2 to-chart-3 text-transparent bg-clip-text mb-4">12</div>
                      <div className="text-lg font-bold mb-2">Dedicated Specialists</div>
                      <p className="text-sm text-muted-foreground">Expert builders per pod</p>
                    </div>
                  </div>

                  <div className="group relative py-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-chart-3 to-chart-1 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative bg-background rounded-2xl p-10 text-center border-2 border-muted hover:border-chart-3 transition-all hover:scale-105 hover:shadow-2xl min-h-[280px] flex flex-col justify-center">
                      <div className="inline-block p-4 bg-chart-3/10 rounded-full mb-6 mx-auto">
                        <Sparkles className="h-8 w-8 text-chart-3" />
                      </div>
                      <div className="text-6xl font-extrabold bg-gradient-to-br from-chart-3 to-chart-1 text-transparent bg-clip-text mb-4">4</div>
                      <div className="text-lg font-bold mb-2">Shared Experts</div>
                      <p className="text-sm text-muted-foreground">Cross-pod support team</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Program Structure with Enhanced Visuals */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-chart-2/10 text-chart-2 border-chart-2">
                <Target className="h-4 w-4 mr-2" />
                Pod Architecture
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Program Structure & 
                <span className="bg-gradient-to-r from-chart-2 to-chart-3 text-transparent bg-clip-text"> Resources</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our strength lies in the <span className="font-semibold text-foreground">pod-based architecture</span>, 
                combining dedicated specialists with shared expertise for maximum efficiency.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Pod Composition - 3 columns */}
              <div className="lg:col-span-3">
                <Card className="h-full border-2 hover:border-chart-1 transition-all shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-chart-1/10 rounded-lg">
                        <GitBranch className="h-6 w-6 text-chart-1" />
                      </div>
                      <h3 className="text-2xl font-bold">Pod Composition</h3>
                    </div>
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                      Each pod is a <span className="font-semibold text-foreground">self-contained unit of builders</span>, 
                      equipped with essential skills to take ideas from concept to reality.
                    </p>

                    <div className="space-y-5">
                      <div className="group relative overflow-hidden rounded-xl border-2 border-muted hover:border-chart-1 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-r from-chart-1/0 to-chart-1/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                        <div className="relative flex items-start gap-4 p-5">
                          <div className="p-3 bg-chart-1/10 rounded-xl group-hover:scale-110 transition-transform">
                            <Laptop className="h-6 w-6 text-chart-1" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-lg text-chart-1">1 Developer</span>
                              <Badge variant="outline" className="text-xs">Core</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Builds the core application infrastructure and implements features.</p>
                          </div>
                        </div>
                      </div>

                      <div className="group relative overflow-hidden rounded-xl border-2 border-muted hover:border-chart-2 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-r from-chart-2/0 to-chart-2/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                        <div className="relative flex items-start gap-4 p-5">
                          <div className="p-3 bg-chart-2/10 rounded-xl group-hover:scale-110 transition-transform">
                            <Database className="h-6 w-6 text-chart-2" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-lg text-chart-2">1 Data Analyst/Engineer</span>
                              <Badge variant="outline" className="text-xs">Data</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Manages data pipelines, analytics, and extracts actionable insights.</p>
                          </div>
                        </div>
                      </div>

                      <div className="group relative overflow-hidden rounded-xl border-2 border-muted hover:border-chart-3 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-r from-chart-3/0 to-chart-3/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                        <div className="relative flex items-start gap-4 p-5">
                          <div className="p-3 bg-chart-3/10 rounded-xl group-hover:scale-110 transition-transform">
                            <Brain className="h-6 w-6 text-chart-3" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-lg text-chart-3">1 ML/AI Specialist</span>
                              <Badge variant="outline" className="text-xs">AI</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Implements machine learning models and AI-driven algorithms.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resource Distribution - 2 columns */}
              <div className="lg:col-span-2">
                <Card className="h-full border-2 hover:border-chart-2 transition-all shadow-xl">
                  <CardContent className="p-8 flex flex-col items-center justify-center h-full">
                    <h3 className="text-xl font-bold mb-6 text-center">Resource Distribution</h3>
                    
                    {/* Enhanced Donut Chart */}
                    <div className="relative w-56 h-56 mb-6">
                      <svg viewBox="0 0 100 100" className="transform -rotate-90">
                        {/* Dedicated Specialists (75%) - Enhanced with gradient */}
                        <defs>
                          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: 'hsl(var(--chart-1))', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: 'hsl(var(--chart-2))', stopOpacity: 1 }} />
                          </linearGradient>
                          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: 'hsl(var(--chart-2))', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: 'hsl(var(--chart-3))', stopOpacity: 1 }} />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="url(#grad1)"
                          strokeWidth="22"
                          strokeDasharray="188.5 251.3"
                          className="drop-shadow-lg"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="url(#grad2)"
                          strokeWidth="22"
                          strokeDasharray="62.8 251.3"
                          strokeDashoffset="-188.5"
                          className="drop-shadow-lg"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-chart-1">75%</div>
                          <div className="text-xs text-muted-foreground">Dedicated</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 w-full">
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-chart-1 to-chart-2"></div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold">Dedicated Specialists</div>
                          <div className="text-xs text-muted-foreground">12 pod members</div>
                        </div>
                        <div className="text-lg font-bold text-chart-1">75%</div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-chart-2 to-chart-3"></div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold">Shared Experts</div>
                          <div className="text-xs text-muted-foreground">PM & QA support</div>
                        </div>
                        <div className="text-lg font-bold text-chart-2">25%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Rapid Prototyping Lifecycle - More Dynamic */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-chart-3/10 text-chart-3 border-chart-3">
                <Zap className="h-4 w-4 mr-2" />
                Innovation Pipeline
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                The 
                <span className="bg-gradient-to-r from-chart-3 via-chart-1 to-chart-2 text-transparent bg-clip-text"> Rapid Prototyping </span>
                Lifecycle
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                From <span className="font-semibold text-foreground">concept to MVP</span> in a structured, 
                time-boxed framework designed for speed and effectiveness.
              </p>
            </div>

            <div className="relative max-w-6xl mx-auto">
              {/* Connection Line for Desktop */}
              <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 opacity-20"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    number: 1,
                    title: "Idea Intake",
                    description: "Ideas sourced from Design Workshops and continuous community submissions.",
                    icon: Lightbulb,
                    color: "chart-1",
                    details: ["Community submissions", "Design workshops", "Stakeholder input"]
                  },
                  {
                    number: 2,
                    title: "Prioritization",
                    description: "Product & Operations teams evaluate and select the most promising concepts.",
                    icon: TrendingUp,
                    color: "chart-2",
                    details: ["Impact assessment", "Feasibility review", "Strategic alignment"]
                  },
                  {
                    number: 3,
                    title: "Pod Selection",
                    description: "Each pod chooses a prioritized idea to rapidly prototype and develop.",
                    icon: Target,
                    color: "chart-3",
                    details: ["Pod selection", "Resource allocation", "Timeline planning"]
                  }
                ].map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="relative group">
                      <div className={`absolute inset-0 bg-gradient-to-br from-${step.color} to-${step.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity`}></div>
                      <Card className="relative border-2 border-muted hover:border-chart-1 transition-all hover:scale-105 shadow-xl h-full">
                        <CardContent className="p-8">
                          {/* Step Number Badge */}
                          <div className="flex items-center justify-between mb-6">
                            <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br from-${step.color} to-${step.color} flex items-center justify-center shadow-lg`}>
                              <span className="text-2xl font-bold text-white">{step.number}</span>
                            </div>
                            <div className={`p-3 bg-${step.color}/10 rounded-xl`}>
                              <Icon className={`h-6 w-6 text-${step.color}`} />
                            </div>
                          </div>

                          <h3 className={`text-2xl font-bold mb-3 text-${step.color}`}>
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {step.description}
                          </p>

                          <div className="space-y-2">
                            {step.details.map((detail, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <div className={`w-1.5 h-1.5 rounded-full bg-${step.color}`}></div>
                                <span className="text-muted-foreground">{detail}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Time-boxed Development - Visual Timeline */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-chart-1/10 text-chart-1 border-chart-1">
                <Clock className="h-4 w-4 mr-2" />
                Development Timeline
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-chart-1 to-chart-2 text-transparent bg-clip-text">Time-boxed</span>
                {" "}for Success
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Two-phased approach ensuring resources are invested wisely with clear milestones.
              </p>
            </div>

            <Card className="border-2 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-br from-muted/30 to-background p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Timeline Visualization */}
                  <div className="space-y-8">
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center text-white font-bold shadow-lg">
                            1
                          </div>
                          <span className="text-lg font-bold">MVP Phase</span>
                        </div>
                        <Badge className="bg-chart-1 text-white">50 Hours</Badge>
                      </div>
                      <div className="relative h-20 bg-gradient-to-r from-chart-1 via-chart-2 to-chart-1 rounded-xl shadow-lg overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white font-bold text-lg drop-shadow-lg">Core Development</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-chart-1" />
                        <span>Build functional prototype</span>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-chart-2 to-chart-3 flex items-center justify-center text-white font-bold shadow-lg">
                            2
                          </div>
                          <span className="text-lg font-bold">Extended Phase</span>
                        </div>
                        <Badge className="bg-chart-2 text-white">+50 Hours</Badge>
                      </div>
                      <div className="relative h-20 bg-gradient-to-r from-chart-2 via-chart-3 to-chart-2 rounded-xl shadow-lg overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white font-bold text-lg drop-shadow-lg">Enhanced Prototype</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <Rocket className="h-4 w-4 text-chart-2" />
                        <span>Awarded to successful MVPs</span>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg border-2 border-dashed border-muted">
                      <div className="text-sm text-muted-foreground text-center">
                        <strong className="text-foreground">Total Investment:</strong> Up to 100 hours per prototype
                      </div>
                    </div>
                  </div>

                  {/* Phase Details */}
                  <div className="space-y-6">
                    <div className="group relative overflow-hidden rounded-xl border-2 border-muted hover:border-green-500 transition-all">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                      <div className="relative p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-green-500/10 rounded-xl group-hover:scale-110 transition-transform">
                            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">Phase 1: MVP Development</h3>
                            <p className="text-muted-foreground mb-4">
                              Initial sprint to build a core, functional prototype and demonstrate viability.
                            </p>
                            <div className="space-y-2">
                              {["Proof of concept", "Core features", "Demo ready"].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-xl border-2 border-muted hover:border-purple-500 transition-all">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                      <div className="relative p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-purple-500/10 rounded-xl group-hover:scale-110 transition-transform">
                            <Rocket className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">Phase 2: Extended Prototype</h3>
                            <p className="text-muted-foreground mb-4">
                              Awarded to successful MVPs with completion bonus for enhanced development.
                            </p>
                            <div className="space-y-2">
                              {["Enhanced features", "User testing", "Production ready"].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Weekly Cadence - Interactive Cards */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-chart-2/10 text-chart-2 border-chart-2">
                <MessageSquare className="h-4 w-4 mr-2" />
                Communication Rhythm
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Weekly 
                <span className="bg-gradient-to-r from-chart-2 to-chart-3 text-transparent bg-clip-text"> Collaboration </span>
                Cadence
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Structured meetings keep pods <span className="font-semibold text-foreground">aligned, unblocked, and motivated</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <Card className="relative border-2 border-blue-500/30 hover:border-blue-500 transition-all hover:scale-105 shadow-xl h-full">
                  <CardContent className="p-8 text-center">
                    <div className="inline-block p-4 bg-blue-500/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <Users className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Pod Meeting</div>
                    <div className="text-6xl font-extrabold text-blue-600 dark:text-blue-400 mb-3">1</div>
                    <div className="text-sm text-muted-foreground font-medium mb-4">hour weekly</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Deep dives, planning, and technical problem-solving within each pod.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <Card className="relative border-2 border-red-500/30 hover:border-red-500 transition-all hover:scale-105 shadow-xl h-full">
                  <CardContent className="p-8 text-center">
                    <div className="inline-block p-4 bg-red-500/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <Zap className="h-10 w-10 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Blocker Stand-up</div>
                    <div className="text-6xl font-extrabold text-red-600 dark:text-red-400 mb-3">30</div>
                    <div className="text-sm text-muted-foreground font-medium mb-4">minutes weekly</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Focused exclusively on identifying and resolving impediments quickly.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <Card className="relative border-2 border-green-500/30 hover:border-green-500 transition-all hover:scale-105 shadow-xl h-full">
                  <CardContent className="p-8 text-center">
                    <div className="inline-block p-4 bg-green-500/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <Trophy className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">Wins Stand-up</div>
                    <div className="text-6xl font-extrabold text-green-600 dark:text-green-400 mb-3">30</div>
                    <div className="text-sm text-muted-foreground font-medium mb-4">minutes weekly</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Celebrate achievements, share successes, and boost team morale.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Ecosystem Connection - Enhanced Visualization */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-chart-3/10 text-chart-3 border-chart-3">
                <GitBranch className="h-4 w-4 mr-2" />
                Collaboration Network
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Connecting the 
                <span className="bg-gradient-to-r from-chart-3 via-chart-1 to-chart-2 text-transparent bg-clip-text"> Ecosystem</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                A <span className="font-semibold text-foreground">central hub</span> connecting key Deep Funding clusters, 
                bridging ideas and execution.
              </p>
            </div>

            <Card className="border-2 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-muted/30 to-background p-6 md:p-12 lg:p-16">
                <div className="relative max-w-4xl mx-auto">
                  {/* Connection Lines - Hidden on mobile */}
                  <div className="hidden lg:block absolute inset-0">
                    <svg className="w-full h-full" style={{ position: 'absolute' }}>
                      <line x1="50%" y1="50%" x2="25%" y2="15%" stroke="hsl(var(--chart-1))" strokeWidth="2" opacity="0.3" strokeDasharray="5,5" />
                      <line x1="50%" y1="50%" x2="75%" y2="15%" stroke="hsl(var(--chart-2))" strokeWidth="2" opacity="0.3" strokeDasharray="5,5" />
                      <line x1="50%" y1="50%" x2="25%" y2="85%" stroke="hsl(var(--chart-3))" strokeWidth="2" opacity="0.3" strokeDasharray="5,5" />
                      <line x1="50%" y1="50%" x2="75%" y2="85%" stroke="hsl(var(--chart-1))" strokeWidth="2" opacity="0.3" strokeDasharray="5,5" />
                    </svg>
                  </div>

                  {/* Center Hub */}
                  <div className="relative flex items-center justify-center mb-8 md:mb-12 lg:mb-16">
                    <div className="absolute w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-chart-1/20 via-chart-2/20 to-chart-3/20 rounded-full blur-3xl"></div>
                    <div className="relative w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full bg-gradient-to-br from-chart-1 via-chart-2 to-chart-3 flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
                      <div className="text-center">
                        <Sparkles className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-white mx-auto mb-2" />
                        <span className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white tracking-wider">DF LABS</span>
                      </div>
                    </div>
                  </div>

                  {/* Connected Clusters */}
                  <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
                    {[
                      { name: "Product & BizDev", icon: Target, color: "chart-1" },
                      { name: "Governance", icon: Users, color: "chart-2" },
                      { name: "Operations & Review", icon: CheckCircle, color: "chart-3" },
                      { name: "Community & Outreach", icon: MessageSquare, color: "chart-1" }
                    ].map((cluster, idx) => {
                      const Icon = cluster.icon;
                      return (
                        <div key={idx} className="group relative">
                          <div className={`absolute inset-0 bg-gradient-to-br from-${cluster.color} to-${cluster.color} rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity`}></div>
                          <div className={`relative p-6 bg-background rounded-xl border-2 border-muted hover:border-${cluster.color} transition-all shadow-lg group-hover:scale-105`}>
                            <div className="flex items-center gap-3">
                              <div className={`p-2 bg-${cluster.color}/10 rounded-lg`}>
                                <Icon className={`h-5 w-5 text-${cluster.color}`} />
                              </div>
                              <div className="font-bold text-sm">{cluster.name}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Final CTA - Premium Design */}
          <Card className="relative overflow-hidden border-0 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-chart-1 via-chart-2 to-chart-3"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <CardContent className="relative p-12 md:p-16 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="inline-block p-4 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
                  <Award className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                  Ready to Build the Future?
                </h2>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  Join our passionate community of builders driving AI-driven solutions that shape tomorrow.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-white text-chart-1 hover:bg-white/90 font-bold text-lg px-8 py-6 shadow-xl hover:scale-105 transition-transform"
                    onClick={() => window.location.href = '/join-team'}
                  >
                    Join the Deep Labs Circle
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20 font-bold text-lg px-8 py-6 backdrop-blur-sm hover:scale-105 transition-transform"
                    onClick={() => window.location.href = '/submit-idea'}
                  >
                    Submit Your Idea
                    <Lightbulb className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
      `}</style>
    </>
  );
}
