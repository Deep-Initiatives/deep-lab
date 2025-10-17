import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Search, Calendar, User, Clock, ArrowRight, Mail } from "lucide-react";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Technology", "AI", "Development", "Innovation"];
  
  const blogPosts = [
    {
      id: 1,
      title: "The Future of AI Development",
      excerpt: "Exploring the latest trends and technologies shaping the future of artificial intelligence development.",
      content: "Full article content here...",
      author: "Deep Lab Team",
      publishedAt: "2024-01-15",
      readTime: 5,
      category: "AI",
      tags: ["AI", "Machine Learning", "Future Tech"],
      imageUrl: "/api/placeholder/400/250",
      featured: true
    },
    {
      id: 2,
      title: "Building Scalable Web Applications",
      excerpt: "Best practices and patterns for creating web applications that can handle millions of users.",
      content: "Full article content here...",
      author: "Tech Team",
      publishedAt: "2024-01-10",
      readTime: 8,
      category: "Development",
      tags: ["Web Development", "Scalability", "Architecture"],
      imageUrl: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 3,
      title: "Innovation in Startup Culture",
      excerpt: "How modern startups are leveraging technology to disrupt traditional industries.",
      content: "Full article content here...",
      author: "Innovation Team",
      publishedAt: "2024-01-05",
      readTime: 6,
      category: "Innovation",
      tags: ["Startups", "Innovation", "Business"],
      imageUrl: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 4,
      title: "The Rise of Edge Computing",
      excerpt: "Understanding how edge computing is revolutionizing data processing and application performance.",
      content: "Full article content here...",
      author: "Tech Team",
      publishedAt: "2023-12-28",
      readTime: 7,
      category: "Technology",
      tags: ["Edge Computing", "Cloud", "Performance"],
      imageUrl: "/api/placeholder/400/250",
      featured: false
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-chart-1 via-chart-2 to-chart-3">
        <div className="container mx-auto px-4 pt-24 pb-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Deep Lab Blog
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Insights, tutorials, and thoughts on AI, development, and innovation
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-12">
            <Card className="backdrop-blur-sm bg-background/80 border-border shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="Search blog posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-background border-border"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                        className={selectedCategory === category ? "bg-gradient-to-r from-chart-1 to-chart-2 text-white border-0 capitalize" : "border-border hover:bg-muted capitalize"}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Featured Post</h2>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow backdrop-blur-sm bg-background/80 border-border shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-gradient-to-r from-chart-1 to-chart-2 text-white">Featured</Badge>
                      <Badge variant="outline" className="border-border">{featuredPost.category}</Badge>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      {featuredPost.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(featuredPost.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{featuredPost.readTime} min read</span>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-chart-1 to-chart-2 text-white border-0 hover:opacity-90">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                  <div className="bg-muted flex items-center justify-center">
                    <div className="w-full h-64 bg-gradient-to-br from-chart-1/20 to-chart-2/20 flex items-center justify-center">
                      <span className="text-muted-foreground">Featured Image</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Blog Posts Grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">All Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow backdrop-blur-sm bg-background/80 border-border shadow-xl">
                  <div className="bg-muted h-48 flex items-center justify-center">
                    <span className="text-muted-foreground">Post Image</span>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{post.category}</Badge>
                      {post.featured && (
                        <Badge className="bg-gradient-to-r from-chart-1 to-chart-2 text-white">Featured</Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime} min</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <Card className="bg-gradient-to-r from-chart-1 to-chart-2 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                Get the latest insights on AI, development, and innovation delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                />
                <Button className="bg-white text-chart-1 hover:bg-white/90">
                  <Mail className="h-4 w-4 mr-2" />
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}