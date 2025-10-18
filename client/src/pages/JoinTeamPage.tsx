import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Users, Code, Lightbulb, CheckCircle, ArrowRight, User, Mail, Briefcase, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function JoinTeamPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    experience: "",
    skills: [] as string[],
    linkedin: "",
    github: "",
    portfolio: "",
    motivation: "",
    availability: "",
  });
  const [customRole, setCustomRole] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use custom role if "Other" is selected
      const submissionData = {
        ...formData,
        role: formData.role === "Other" ? customRole : formData.role,
      };

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      setIsSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest. We'll review your application and get back to you soon.",
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillToggle = (skill: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      skills: checked 
        ? [...prev.skills, skill]
        : prev.skills.filter(s => s !== skill)
    }));
  };

  const roleOptions = [
    "Product Manager",
    "Full Stack Developer", 
    "Frontend Developer",
    "Backend Developer",
    "Data Specialist",
    "Quality Assurance Specialist",
    "AI/ML Specialist",
    "Blockchain Specialist",
    "UI/UX Designer",
    "DevOps Engineer",
    "Other"
  ];

  const availableSkills = [
    "React", "Node.js", "Python", "TypeScript", "JavaScript",
    "AI/ML", "Data Analysis", "UI/UX Design", "Product Management",
    "Agile", "SQL", "NoSQL", "Docker", "Kubernetes", "AWS", "Git",
    "TensorFlow", "PyTorch", "Blockchain", "Solidity", "Rust"
  ];

  const roleDescriptions = [
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
    "Work on cutting-edge AI projects",
    "Flexible remote work environment",
    "Learning and development opportunities",
    "Collaborative team culture",
    "Contribute to open-source projects",
    "Shape the future of decentralized AI"
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 pt-24 pb-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 text-transparent bg-clip-text mb-6">
              Join Deep Lab
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Be part of our innovative team building the future of AI-driven solutions. 
              Help us create cutting-edge applications that make a real impact.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Application Form */}
            <div>
              <Card className="border-border shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Application Form</CardTitle>
                  <CardDescription>
                    Tell us about yourself and why you'd like to join our team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold mb-2">
                        Application Submitted!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for your interest. We'll review your application and get back to you soon.
                      </p>
                      <Button 
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({
                            fullName: "",
                            email: "",
                            role: "",
                            experience: "",
                            skills: [],
                            linkedin: "",
                            github: "",
                            portfolio: "",
                            motivation: "",
                            availability: "",
                          });
                          setCustomRole("");
                        }}
                        variant="outline"
                      >
                        Submit Another Application
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-chart-2" />
                          <h3 className="text-lg font-semibold">Personal Information</h3>
                        </div>
                        
                        <div>
                          <Label htmlFor="fullName">
                            Full Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                            placeholder="Your full name"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="email">
                            Email <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>

                      {/* Role and Experience */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-chart-2" />
                          <h3 className="text-lg font-semibold">Role & Experience</h3>
                        </div>

                        <div>
                          <Label htmlFor="role">
                            Desired Role <span className="text-red-500">*</span>
                          </Label>
                          <Select 
                            value={formData.role} 
                            onValueChange={(value) => handleInputChange("role", value)}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roleOptions.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {formData.role === "Other" && (
                          <div>
                            <Label htmlFor="customRole">
                              Please specify your role <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="customRole"
                              value={customRole}
                              onChange={(e) => setCustomRole(e.target.value)}
                              placeholder="Enter your role"
                              required
                            />
                          </div>
                        )}

                        <div>
                          <Label htmlFor="experience">
                            Years of Experience <span className="text-red-500">*</span>
                          </Label>
                          <Select 
                            value={formData.experience} 
                            onValueChange={(value) => handleInputChange("experience", value)}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0-1">0-1 years</SelectItem>
                              <SelectItem value="1-3">1-3 years</SelectItem>
                              <SelectItem value="3-5">3-5 years</SelectItem>
                              <SelectItem value="5-10">5-10 years</SelectItem>
                              <SelectItem value="10+">10+ years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>
                            Skills <span className="text-red-500">*</span>
                          </Label>
                          <p className="text-sm text-muted-foreground mb-2">Select all that apply</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                            {availableSkills.map((skill) => (
                              <div key={skill} className="flex items-center space-x-2">
                                <Checkbox
                                  id={skill}
                                  checked={formData.skills.includes(skill)}
                                  onCheckedChange={(checked) => handleSkillToggle(skill, checked as boolean)}
                                />
                                <Label htmlFor={skill} className="text-sm font-normal">
                                  {skill}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Links */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4 text-chart-2" />
                          <h3 className="text-lg font-semibold">Professional Links</h3>
                        </div>

                        <div>
                          <Label htmlFor="linkedin">LinkedIn Profile</Label>
                          <Input
                            id="linkedin"
                            value={formData.linkedin}
                            onChange={(e) => handleInputChange("linkedin", e.target.value)}
                            placeholder="https://linkedin.com/in/yourprofile"
                          />
                        </div>

                        <div>
                          <Label htmlFor="github">GitHub Profile</Label>
                          <Input
                            id="github"
                            value={formData.github}
                            onChange={(e) => handleInputChange("github", e.target.value)}
                            placeholder="https://github.com/yourusername"
                          />
                        </div>

                        <div>
                          <Label htmlFor="portfolio">Portfolio/Website</Label>
                          <Input
                            id="portfolio"
                            value={formData.portfolio}
                            onChange={(e) => handleInputChange("portfolio", e.target.value)}
                            placeholder="https://yourportfolio.com"
                          />
                        </div>
                      </div>

                      {/* Motivation and Availability */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="motivation">
                            Why do you want to join Deep Lab? <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="motivation"
                            value={formData.motivation}
                            onChange={(e) => handleInputChange("motivation", e.target.value)}
                            placeholder="Tell us what excites you about joining our team..."
                            rows={4}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="availability">
                            Availability <span className="text-red-500">*</span>
                          </Label>
                          <Select 
                            value={formData.availability} 
                            onValueChange={(value) => handleInputChange("availability", value)}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your availability" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="full-time">Full-time</SelectItem>
                              <SelectItem value="part-time">Part-time</SelectItem>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="flexible">Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                        {!isSubmitting && <ArrowRight className="h-5 w-5 ml-2" />}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Job Openings and Benefits */}
            <div className="space-y-8">
              {/* Open Positions */}
              <Card className="border-border shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Open Positions</CardTitle>
                  <CardDescription>
                    Current opportunities at Deep Lab
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {roleDescriptions.map((role, index) => {
                      const Icon = role.icon;
                      return (
                        <div key={index} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-gradient-to-br from-chart-1 to-chart-2 rounded-lg">
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{role.title}</h3>
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
              <Card className="border-border shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Why Join Us?</CardTitle>
                  <CardDescription>
                    What we offer to our team members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-chart-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Team Stats */}
              <Card className="border-border shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Our Team</CardTitle>
                  <CardDescription>
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
                      <div className="text-3xl font-bold text-chart-3 mb-2">100%</div>
                      <div className="text-sm text-muted-foreground">Remote Work</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-chart-4 mb-2">5+</div>
                      <div className="text-sm text-muted-foreground">Active Projects</div>
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
