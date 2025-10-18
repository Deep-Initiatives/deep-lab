import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Lightbulb, Send, CheckCircle, ArrowRight, Users, Target, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SubmitIdeaPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    submitterName: "",
    problemStatement: "",
    proposedSolution: "",
    targetAudience: "",
    expectedImpact: "",
    requiredExpertise: [] as string[],
    successMetrics: "",
    dependencies: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit idea");
      }

      setIsSubmitted(true);
      toast({
        title: "Idea Submitted!",
        description: "Thank you for your submission. We'll review your idea and get back to you soon.",
      });
    } catch (error) {
      console.error("Error submitting idea:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExpertiseToggle = (expertise: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      requiredExpertise: checked 
        ? [...prev.requiredExpertise, expertise]
        : prev.requiredExpertise.filter(e => e !== expertise)
    }));
  };

  const expertiseOptions = [
    "Developer",
    "Data Analyst/Engineer",
    "ML/AI Specialist",
    "Product Manager",
    "QA Specialist"
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 pt-24 pb-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-chart-1 to-chart-2 rounded-2xl">
                <Lightbulb className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 text-transparent bg-clip-text mb-6">
              Deep Labs Idea Submission
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Share your innovative AI-driven concepts for rapid prototyping.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-border shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Share Your Innovation</CardTitle>
                <CardDescription>
                  Tell us about your AI-driven idea and how it can benefit the Deep Funding or SNET ecosystem
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-2">
                      Idea Submitted Successfully!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for sharing your innovative idea. Our team will review it and get back to you soon.
                    </p>
                    <Button 
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          title: "",
                          submitterName: "",
                          problemStatement: "",
                          proposedSolution: "",
                          targetAudience: "",
                          expectedImpact: "",
                          requiredExpertise: [],
                          successMetrics: "",
                          dependencies: "",
                        });
                      }}
                      variant="outline"
                    >
                      Submit Another Idea
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Idea Title */}
                    <div>
                      <Label htmlFor="title">
                        Idea Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="Enter a concise title for your idea"
                        required
                      />
                    </div>

                    {/* Submitter Name */}
                    <div>
                      <Label htmlFor="submitterName">
                        Your Name / Team Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="submitterName"
                        value={formData.submitterName}
                        onChange={(e) => handleInputChange("submitterName", e.target.value)}
                        placeholder="Enter your name or team name"
                        required
                      />
                    </div>

                    {/* Problem Statement */}
                    <div>
                      <Label htmlFor="problemStatement">
                        Problem Statement <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        What specific challenge or need does this idea address for Deep Funding or the SNET ecosystem?
                      </p>
                      <Textarea
                        id="problemStatement"
                        value={formData.problemStatement}
                        onChange={(e) => handleInputChange("problemStatement", e.target.value)}
                        placeholder="Describe the problem or challenge your idea solves..."
                        rows={4}
                        required
                      />
                    </div>

                    {/* Proposed Solution */}
                    <div>
                      <Label htmlFor="proposedSolution">
                        Proposed AI-Driven Solution <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Outline the core functionality of your proposed prototype.
                      </p>
                      <Textarea
                        id="proposedSolution"
                        value={formData.proposedSolution}
                        onChange={(e) => handleInputChange("proposedSolution", e.target.value)}
                        placeholder="Describe your AI-driven solution and its key features..."
                        rows={5}
                        required
                      />
                    </div>

                    {/* Target Audience */}
                    <div>
                      <Label htmlFor="targetAudience">
                        Target Audience / Beneficiary <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Who will primarily benefit from this solution?
                      </p>
                      <Textarea
                        id="targetAudience"
                        value={formData.targetAudience}
                        onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                        placeholder="Describe who will use and benefit from your solution..."
                        rows={3}
                        required
                      />
                    </div>

                    {/* Expected Impact */}
                    <div>
                      <Label htmlFor="expectedImpact">
                        Expected Impact / Benefits <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        How will this idea contribute to Deep Funding's goals or the SNET ecosystem?
                      </p>
                      <Textarea
                        id="expectedImpact"
                        value={formData.expectedImpact}
                        onChange={(e) => handleInputChange("expectedImpact", e.target.value)}
                        placeholder="Explain the expected impact and benefits..."
                        rows={4}
                        required
                      />
                    </div>

                    {/* Required Expertise */}
                    <div>
                      <Label>
                        Required Deep Labs Expertise <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Select the primary roles required for your idea's prototyping.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border rounded-md p-4">
                        {expertiseOptions.map((expertise) => (
                          <div key={expertise} className="flex items-center space-x-2">
                            <Checkbox
                              id={expertise}
                              checked={formData.requiredExpertise.includes(expertise)}
                              onCheckedChange={(checked) => handleExpertiseToggle(expertise, checked as boolean)}
                            />
                            <Label htmlFor={expertise} className="text-sm font-normal">
                              {expertise}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Success Metrics */}
                    <div>
                      <Label htmlFor="successMetrics">
                        Potential MVP Success Metrics
                      </Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        How would you measure if your prototype is successful?
                      </p>
                      <Textarea
                        id="successMetrics"
                        value={formData.successMetrics}
                        onChange={(e) => handleInputChange("successMetrics", e.target.value)}
                        placeholder="Describe how you would measure success (optional)..."
                        rows={3}
                      />
                    </div>

                    {/* Dependencies */}
                    <div>
                      <Label htmlFor="dependencies">
                        Dependencies / Prerequisites
                      </Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Are there any external data, tools, or other prerequisites for this idea?
                      </p>
                      <Textarea
                        id="dependencies"
                        value={formData.dependencies}
                        onChange={(e) => handleInputChange("dependencies", e.target.value)}
                        placeholder="List any dependencies or prerequisites (optional)..."
                        rows={3}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Idea"}
                      {!isSubmitting && <Send className="h-5 w-5 ml-2" />}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Info Cards */}
            {!isSubmitted && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Card className="border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-chart-1/10 rounded-lg">
                        <Lightbulb className="h-5 w-5 text-chart-1" />
                      </div>
                      <h3 className="font-semibold">Innovation First</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We value creative AI-driven solutions that push boundaries
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-chart-2/10 rounded-lg">
                        <Users className="h-5 w-5 text-chart-2" />
                      </div>
                      <h3 className="font-semibold">Collaborative</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Work with our expert team to bring your idea to life
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-chart-3/10 rounded-lg">
                        <Zap className="h-5 w-5 text-chart-3" />
                      </div>
                      <h3 className="font-semibold">Rapid Prototyping</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Fast-track your concept from idea to working prototype
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
