import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Search, Lightbulb, Calendar, User, Filter } from "lucide-react";

export default function ViewAllIdeasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "AI & ML", "Web Development", "Mobile Apps", "IoT", "Other"];
  
  const ideas = [
    {
      id: 1,
      title: "AI-Powered Code Review Assistant",
      description: "An intelligent system that automatically reviews code for bugs, security vulnerabilities, and best practices.",
      category: "AI & ML",
      status: "Under Review",
      submittedBy: "John Doe",
      submittedAt: "2024-01-15",
      votes: 24,
      tags: ["AI", "Code Review", "Automation"]
    },
    {
      id: 2,
      title: "Real-time Collaboration Platform",
      description: "A web-based platform for real-time collaborative development with live code sharing and video calls.",
      category: "Web Development",
      status: "In Development",
      submittedBy: "Jane Smith",
      submittedAt: "2024-01-10",
      votes: 18,
      tags: ["Collaboration", "WebRTC", "Real-time"]
    },
    {
      id: 3,
      title: "Smart Home IoT Dashboard",
      description: "A comprehensive dashboard for managing all smart home devices with AI-powered automation suggestions.",
      category: "IoT",
      status: "Planning",
      submittedBy: "Mike Johnson",
      submittedAt: "2024-01-05",
      votes: 31,
      tags: ["IoT", "Smart Home", "Dashboard"]
    },
    {
      id: 4,
      title: "Mobile Learning App",
      description: "An educational mobile app that uses gamification and AI to personalize learning experiences.",
      category: "Mobile Apps",
      status: "Under Review",
      submittedBy: "Sarah Wilson",
      submittedAt: "2023-12-28",
      votes: 15,
      tags: ["Education", "Mobile", "Gamification"]
    }
  ];

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || idea.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under Review": return "bg-yellow-100 text-yellow-800";
      case "In Development": return "bg-blue-100 text-blue-800";
      case "Planning": return "bg-purple-100 text-purple-800";
      case "Completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Community Ideas
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore innovative ideas submitted by our community and vote for your favorites
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Search ideas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                        className="capitalize"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ideas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredIdeas.map((idea) => (
              <Card key={idea.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{idea.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">{idea.description}</p>
                    </div>
                    <Badge className={getStatusColor(idea.status)}>
                      {idea.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{idea.submittedBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(idea.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {idea.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{idea.votes} votes</span>
                      </div>
                      <Button size="sm" variant="outline">
                        Vote
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredIdeas.length === 0 && (
            <div className="text-center py-12">
              <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No ideas found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}