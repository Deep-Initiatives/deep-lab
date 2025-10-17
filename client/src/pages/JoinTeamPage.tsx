import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Users, Code, Lightbulb, CheckCircle, ArrowRight, User, Mail, Briefcase, CheckSquare } from "lucide-react";

export default function JoinTeamPage() {
  const [formData, setFormData] = useState({
    name: "",
    mattermostHandle: "",
    email: "",
    specialty: "",
    otherSpecialty: "",
    isPartOfDFCircle: "",
    circles: [] as string[],
    meetsRequirements: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Application submitted:", formData);
    setIsSubmitted(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCircleChange = (circle: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      circles: checked 
        ? [...prev.circles, circle]
        : prev.circles.filter(c => c !== circle)
    }));
  };

  const specialties = [
    "Product Manager",
    "Full Stack Developer", 
    "Data Specialist",
    "Quality Assurance Specialist",
    "AI Specialist",
    "AI / ML Specialist",
    "Blockchain Specialist",
    "UI / UX Designer",
    "Other"
  ];

  const circles = [
    "Data Analytics Circle",
    "Dev Outreach Circle", 
    "Events Circle",
    "Focus Circle",
    "IT Circle",
    "Marketing Circle",
    "Onboarding Circle",
    "Operations Circle",
    "Review Circle"
  ];

  const roles = [
    {
      title: "Product Manager",
      description: "Lead product strategy and development for AI applications",
      icon: Lightbulb,
      requirements: ["Product Strategy", "User Research", "Agile", "AI/ML Knowledge"]
    },
    {
      title: "Full Stack Developer",
      description: "Develop end-to-end web applications and AI integrations",
      icon: Code,
      requirements: ["React", "Node.js", "Database Design", "API Development"]
    },
    {
      title: "AI Specialist",
      description: "Build and deploy AI models and applications",
      icon: Code,
      requirements: ["Python", "Machine Learning", "TensorFlow/PyTorch", "NLP"]
    },
    {
      title: "Data Specialist",
      description: "Analyze data and create insights for AI applications",
      icon: Users,
      requirements: ["Data Analysis", "Statistics", "Python", "SQL"]
    }
  ];

  const benefits = [
    "Competitive salary and equity",
    "Flexible remote work",
    "Learning and development budget",
    "Cutting-edge technology stack",
    "Collaborative team environment",
    "Opportunity to shape the future of AI"
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-chart-1 via-chart-2 to-chart-3">
        <div className="container mx-auto px-4 pt-24 pb-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Deep Funding LABS Program
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Join our innovative team and be part of the future of AI-driven solutions. 
              Help us build cutting-edge applications that make a real impact.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Application Form */}
            <div>
              <Card className="backdrop-blur-sm bg-background/80 border-border shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Application Form</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Complete the form below to apply for the Deep Funding LABS Program
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold text-foreground mb-2">
                        Application Submitted!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for your interest. We'll review your application and get back to you soon.
                      </p>
                      <Button 
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                      >
                        Submit Another Application
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Section 1: Personal Information */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                          <User className="h-4 w-4 text-chart-2" />
                          <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name" className="text-sm font-medium">
                              Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => handleInputChange("name", e.target.value)}
                              placeholder="Your full name"
                              required
                              className="mt-1 bg-background border-border"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email" className="text-sm font-medium">
                              Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              placeholder="your.email@example.com"
                              required
                              className="mt-1 bg-background border-border"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="mattermostHandle" className="text-sm font-medium">
                            Mattermost Handle
                          </Label>
                          <Input
                            id="mattermostHandle"
                            value={formData.mattermostHandle}
                            onChange={(e) => handleInputChange("mattermostHandle", e.target.value)}
                            placeholder="@yourhandle"
                            className="mt-1 bg-background border-border"
                          />
                        </div>
                      </div>

                      {/* Section 2: Specialty */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Briefcase className="h-4 w-4 text-chart-2" />
                          <h3 className="text-lg font-semibold text-foreground">Specialty</h3>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">
                            Specialty <span className="text-red-500">*</span>
                          </Label>
                          <RadioGroup
                            value={formData.specialty}
                            onValueChange={(value) => handleInputChange("specialty", value)}
                            className="mt-3 space-y-2"
                          >
                            {specialties.map((specialty) => (
                              <div key={specialty} className="flex items-center space-x-2">
                                <RadioGroupItem value={specialty} id={specialty} />
                                <Label htmlFor={specialty} className="text-sm">
                                  {specialty}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                          
                          {formData.specialty === "Other" && (
                            <div className="mt-3">
                              <Label htmlFor="otherSpecialty" className="text-sm font-medium">
                                Please specify:
                              </Label>
                              <Input
                                id="otherSpecialty"
                                value={formData.otherSpecialty}
                                onChange={(e) => handleInputChange("otherSpecialty", e.target.value)}
                                placeholder="Your specialty"
                                className="mt-1 bg-background border-border"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Section 3: DF Circle Membership */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="h-4 w-4 text-chart-2" />
                          <h3 className="text-lg font-semibold text-foreground">DeepFunding Circle Membership</h3>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">
                            Are you currently part of any DF circle? <span className="text-red-500">*</span>
                          </Label>
                          <RadioGroup
                            value={formData.isPartOfDFCircle}
                            onValueChange={(value) => handleInputChange("isPartOfDFCircle", value)}
                            className="mt-3 space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="yes" />
                              <Label htmlFor="yes" className="text-sm">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="no" />
                              <Label htmlFor="no" className="text-sm">No</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {formData.isPartOfDFCircle === "yes" && (
                          <div>
                            <Label className="text-sm font-medium">
                              Which Circle(s) are you a member of? <span className="text-red-500">*</span>
                            </Label>
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                              {circles.map((circle) => (
                                <div key={circle} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={circle}
                                    checked={formData.circles.includes(circle)}
                                    onCheckedChange={(checked) => handleCircleChange(circle, checked as boolean)}
                                  />
                                  <Label htmlFor={circle} className="text-sm">
                                    {circle}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Section 4: Requirements */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckSquare className="h-4 w-4 text-chart-2" />
                          <h3 className="text-lg font-semibold text-foreground">Requirements</h3>
                        </div>
                        
                        <div className="bg-muted/30 p-4 rounded-lg border border-border">
                          <h4 className="font-medium text-foreground mb-3">Do you meet the requirements below?</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                            <li>• <strong>Available time (minimum of 10 hours):</strong> To consistently contribute to projects and discussions.</li>
                            <li>• <strong>Willingness to engage:</strong> To actively participate in collaborative problem-solving.</li>
                            <li>• <strong>Passion to drive AI-driven solutions:</strong> A genuine enthusiasm for applying artificial intelligence to real-world challenges within our platform.</li>
                          </ul>
                          
                          <RadioGroup
                            value={formData.meetsRequirements}
                            onValueChange={(value) => handleInputChange("meetsRequirements", value)}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="meets-yes" />
                              <Label htmlFor="meets-yes" className="text-sm">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="meets-no" />
                              <Label htmlFor="meets-no" className="text-sm">No</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 text-white border-0 hover:opacity-90"
                        size="lg"
                      >
                        Submit Application
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Job Openings and Benefits */}
            <div className="space-y-8">
              {/* Open Positions */}
              <Card className="backdrop-blur-sm bg-background/80 border-border shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Open Positions</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Current opportunities at Deep Lab
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {roles.map((role, index) => {
                      const Icon = role.icon;
                      return (
                        <div key={index} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow bg-background/50">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-gradient-to-br from-chart-1 to-chart-2 rounded-lg">
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{role.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{role.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {role.requirements.map((req, reqIndex) => (
                                  <span key={reqIndex} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                                    {req}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card className="backdrop-blur-sm bg-background/80 border-border shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Why Join Us?</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    What we offer to our team members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-chart-2 flex-shrink-0" />
                        <span className="text-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Team Stats */}
              <Card className="backdrop-blur-sm bg-background/80 border-border shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Our Team</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Join a diverse and talented group of innovators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-chart-1 mb-2">40+</div>
                      <div className="text-sm text-muted-foreground">Team Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-chart-2 mb-2">15+</div>
                      <div className="text-sm text-muted-foreground">Countries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-chart-3 mb-2">50%</div>
                      <div className="text-sm text-muted-foreground">Remote Work</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-chart-4 mb-2">4.8</div>
                      <div className="text-sm text-muted-foreground">Team Rating</div>
                    </div>
                  </div>
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