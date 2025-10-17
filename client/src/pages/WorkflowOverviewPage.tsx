import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowRight, CheckCircle, Clock, Users, Code, Lightbulb } from "lucide-react";

export default function WorkflowOverviewPage() {
  const workflowSteps = [
    {
      step: 1,
      title: "Idea Generation",
      description: "Brainstorming and conceptualizing innovative solutions",
      icon: Lightbulb,
      duration: "1-2 weeks",
      team: "Product Team",
      status: "completed"
    },
    {
      step: 2,
      title: "Research & Planning",
      description: "Market research, technical feasibility, and project planning",
      icon: Code,
      duration: "2-3 weeks",
      team: "Research Team",
      status: "completed"
    },
    {
      step: 3,
      title: "Prototype Development",
      description: "Building MVP and proof of concept",
      icon: Code,
      duration: "4-6 weeks",
      team: "Development Team",
      status: "in-progress"
    },
    {
      step: 4,
      title: "Testing & Validation",
      description: "User testing, feedback collection, and iteration",
      icon: Users,
      duration: "2-3 weeks",
      team: "QA Team",
      status: "pending"
    },
    {
      step: 5,
      title: "Production Deployment",
      description: "Final deployment and launch preparation",
      icon: ArrowRight,
      duration: "1-2 weeks",
      team: "DevOps Team",
      status: "pending"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in-progress": return <Clock className="h-5 w-5 text-blue-600" />;
      case "pending": return <Clock className="h-5 w-5 text-gray-400" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Development Workflow
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our systematic approach to turning innovative ideas into production-ready solutions
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={step.step} className="relative">
                    <div className="flex items-start gap-6 p-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {step.title}
                            </h3>
                            <p className="text-gray-600">{step.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(step.status)}
                            <Badge className={getStatusColor(step.status)}>
                              {step.status.replace('-', ' ')}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{step.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{step.team}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Connection Line */}
                    {index < workflowSteps.length - 1 && (
                      <div className="absolute left-6 top-20 w-0.5 h-8 bg-gray-300"></div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Process Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-blue-600 mb-2">85%</div>
                  <div className="text-gray-600">Success Rate</div>
                  <p className="text-sm text-gray-500 mt-2">
                    Projects that reach production
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-green-600 mb-2">12</div>
                  <div className="text-gray-600">Weeks Average</div>
                  <p className="text-sm text-gray-500 mt-2">
                    From idea to deployment
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
                  <div className="text-gray-600">Client Satisfaction</div>
                  <p className="text-sm text-gray-500 mt-2">
                    Based on project feedback
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}