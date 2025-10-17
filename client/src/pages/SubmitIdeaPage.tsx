import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Lightbulb, Send, CheckCircle, ArrowRight } from "lucide-react";

export default function SubmitIdeaPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    impact: "",
    feasibility: "",
    contact: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Idea submitted:", formData);
    setIsSubmitted(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Submit Your Idea
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have an innovative idea? We'd love to hear about it and potentially bring it to life.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Share Your Innovation</CardTitle>
                <CardDescription>
                  Tell us about your idea and how it could make an impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      Idea Submitted!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for sharing your idea. We'll review it and get back to you soon.
                    </p>
                    <Button 
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                    >
                      Submit Another Idea
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="title">Idea Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="Brief title for your idea"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Detailed Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Describe your idea in detail..."
                        rows={6}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleInputChange("category", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ai">AI & Machine Learning</SelectItem>
                            <SelectItem value="web">Web Development</SelectItem>
                            <SelectItem value="mobile">Mobile Apps</SelectItem>
                            <SelectItem value="iot">IoT & Hardware</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="impact">Potential Impact</Label>
                        <Select
                          value={formData.impact}
                          onValueChange={(value) => handleInputChange("impact", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select impact level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low Impact</SelectItem>
                            <SelectItem value="medium">Medium Impact</SelectItem>
                            <SelectItem value="high">High Impact</SelectItem>
                            <SelectItem value="revolutionary">Revolutionary</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="feasibility">Feasibility Assessment</Label>
                      <Textarea
                        id="feasibility"
                        value={formData.feasibility}
                        onChange={(e) => handleInputChange("feasibility", e.target.value)}
                        placeholder="How feasible is this idea? What resources would be needed?"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contact">Contact Information</Label>
                      <Input
                        id="contact"
                        value={formData.contact}
                        onChange={(e) => handleInputChange("contact", e.target.value)}
                        placeholder="Email or phone number"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      Submit Idea
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}