import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Search, Calendar, User, Clock, ArrowRight, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface ExternalBlog {
  id: number;
  title: string;
  content: string;
  author: string;
  circle: string;
  permalink: string;
  featured_image: string;
}

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

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  // Categories are less relevant if not provided by external API, or we can extract from 'circle'
  // const [selectedCategory, setSelectedCategory] = useState("all"); 

  const { data: blogPosts = [], isLoading, error } = useQuery<ExternalBlog[]>({
    queryKey: ["external-blogs"],
    queryFn: async () => {
      const response = await fetch("/api/external-blogs");
      if (!response.ok) throw new Error("Failed to fetch blogs");
      const json = await response.json();
      return json.data || [];
    },
  });

  const getExcerpt = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.slice(0, 150) + (text.length > 150 ? "..." : "");
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getExcerpt(post.content).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Decide if we want a featured post logic (e.g. latest one?)
  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const standardPosts = filteredPosts.length > 0 ? filteredPosts.slice(1) : [];

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

          {/* Search */}
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
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
              {featuredPost && !searchTerm && (
                <div className="mb-16">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Latest Post</h2>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow border-2 hover:border-chart-2 shadow-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      <div className="p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge className="bg-gradient-to-r from-chart-1 to-chart-2 text-white">Latest</Badge>
                          {featuredPost.circle && <Badge variant="outline">{featuredPost.circle}</Badge>}
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-4">
                          {featuredPost.title}
                        </h3>
                        <p className="text-muted-foreground mb-6">{getExcerpt(featuredPost.content)}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{featuredPost.author}</span>
                          </div>
                        </div>
                        <Button
                          asChild
                          className="bg-gradient-to-r from-chart-1 to-chart-2 text-white border-0 hover:opacity-90 w-fit"
                        >
                          <a href={featuredPost.permalink} target="_blank" rel="noopener noreferrer">
                            Read on Deep Communities
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </a>
                        </Button>
                      </div>
                      <div className="bg-muted flex items-center justify-center relative min-h-[300px]">
                        {featuredPost.featured_image ? (
                          <img
                            src={featuredPost.featured_image}
                            alt={featuredPost.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-chart-1/20 to-chart-2/20 flex items-center justify-center">
                            <span className="text-muted-foreground">No Image</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Blog Posts Grid */}
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {searchTerm ? 'Search Results' : 'More Posts'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(searchTerm ? filteredPosts : standardPosts).map((post) => (
                    <Card key={post.id} className="hover:shadow-lg transition-shadow border-2 hover:border-chart-3 shadow-lg flex flex-col">
                      <div className="bg-muted h-48 flex items-center justify-center relative overflow-hidden">
                        {post.featured_image ? (
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                          />
                        ) : (
                          <span className="text-muted-foreground">No Image</span>
                        )}
                      </div>
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          {post.circle && <Badge variant="outline">{post.circle}</Badge>}
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">{getExcerpt(post.content)}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{post.author}</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full mt-auto"
                          asChild
                        >
                          <a href={post.permalink} target="_blank" rel="noopener noreferrer">
                            Read Article
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}

                  {(searchTerm ? filteredPosts : standardPosts).length === 0 && (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                      No posts found.
                    </div>
                  )}
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