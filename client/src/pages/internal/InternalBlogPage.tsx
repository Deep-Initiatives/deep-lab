import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Search, Calendar, User, Clock, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Blog } from "@shared/schema";

// Custom tablet writing icon
const TabletWritingIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 4C3 2.89543 3.89543 2 5 2H19C20.1046 2 21 2.89543 21 4V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 8H17M7 12H17M7 16H13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 18L17 20L21 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function InternalBlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [, setLocation] = useLocation();

  const { data: blogPosts = [], isLoading, error } = useQuery<Blog[]>({
    queryKey: ["/api/blogs"],
    queryFn: async () => {
      const response = await fetch("/api/blogs");
      if (!response.ok) throw new Error("Failed to fetch blogs");
      return response.json();
    },
  });

  const categories = ["all", "Technology", "AI", "Development", "Innovation"];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);

  const handleReadMore = (blogId: string) => {
    setLocation(`/internal-blogs/${blogId}`);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 pt-24 pb-16">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="mb-6 text-lg px-6 py-2 bg-gradient-to-r from-chart-1 to-chart-2 text-white border-0">
              <TabletWritingIcon className="h-4 w-4 mr-2" />
              Blog
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 text-transparent bg-clip-text">
                Deep Lab Blog
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Insights, tutorials, and thoughts on AI, development, and innovation
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-12">
            <Card className="border-2 hover:border-chart-1 transition-all shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="Search blog posts..."
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
                        className={selectedCategory === category ? "bg-gradient-to-r from-chart-1 to-chart-2 text-white border-0 capitalize" : "capitalize"}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chart-1 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading blog posts...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Failed to load blog posts. Please try again later.</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          )}

          {/* Content - only show when not loading and not error */}
          {!isLoading && !error && (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <div className="mb-16">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Featured Post</h2>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow border-2 hover:border-chart-2 shadow-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      <div className="p-8">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge className="bg-gradient-to-r from-chart-1 to-chart-2 text-white">Featured</Badge>
                          <Badge variant="outline">{featuredPost.category}</Badge>
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
                        <Button
                          onClick={() => handleReadMore(featuredPost.id)}
                          className="bg-gradient-to-r from-chart-1 to-chart-2 text-white border-0 hover:opacity-90"
                        >
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
                    <Card key={post.id} className="hover:shadow-lg transition-shadow border-2 hover:border-chart-3 shadow-lg">
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
                          {post.tags?.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleReadMore(post.id)}
                        >
                          Read More
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

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
                  <TabletWritingIcon className="h-4 w-4 mr-2" />
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