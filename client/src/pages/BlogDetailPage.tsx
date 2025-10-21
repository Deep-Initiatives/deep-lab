import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Calendar, User, Clock, Tag, ExternalLink } from "lucide-react";
import type { Blog } from "@shared/schema";

export default function BlogDetailPage() {
  const [, setLocation] = useLocation();
  
  // Get blog ID from URL
  const pathParts = window.location.pathname.split('/');
  const blogId = pathParts[pathParts.length - 1];

  const { data: blog, isLoading, error } = useQuery<Blog>({
    queryKey: [`/api/blogs/${blogId}`],
    queryFn: async () => {
      const response = await fetch(`/api/blogs/${blogId}`);
      if (!response.ok) throw new Error("Failed to fetch blog post");
      return response.json();
    },
    enabled: !!blogId,
  });

  const handleBackToBlogs = () => {
    setLocation("/blog");
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container mx-auto px-4 pt-24 pb-16">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chart-1 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading blog post...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container mx-auto px-4 pt-24 pb-16">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
              <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
              <Button onClick={handleBackToBlogs} className="bg-gradient-to-r from-chart-1 to-chart-2 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 pt-24 pb-16">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={handleBackToBlogs}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </div>

          {/* Blog Post */}
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 shadow-xl">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-gradient-to-r from-chart-1 to-chart-2 text-white">
                    {blog.category}
                  </Badge>
                  {blog.featured && (
                    <Badge className="bg-gradient-to-r from-chart-1 to-chart-2 text-white">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  {blog.title}
                </CardTitle>
                
                <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                  {blog.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{blog.readTime} min read</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Featured Image */}
                {blog.imageUrl && (
                  <div className="mb-8">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-64 md:h-96 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Blog Content */}
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap leading-relaxed text-foreground">
                    {blog.content}
                  </div>
                </div>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Tags:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* External Link */}
                {blog.externalUrl && (
                  <div className="mt-8 pt-6 border-t border-border">
                    <Button
                      asChild
                      className="bg-gradient-to-r from-chart-1 to-chart-2 text-white hover:opacity-90"
                    >
                      <a
                        href={blog.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Read Original Article
                      </a>
                    </Button>
                  </div>
                )}

                {/* Back to Blog Button */}
                <div className="mt-8 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={handleBackToBlogs}
                    className="w-full md:w-auto"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to All Posts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
