import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Code, BookOpen, TrendingUp } from "lucide-react";
import { authenticatedFetch } from "@/lib/api";

export default function AdminDashboardHome() {
  const { data: pods } = useQuery({
    queryKey: ["/api/pods"],
    queryFn: async () => {
      const response = await fetch("/api/pods");
      return response.json();
    },
  });

  const { data: apps } = useQuery({
    queryKey: ["/api/apps"],
    queryFn: async () => {
      const response = await fetch("/api/apps");
      return response.json();
    },
  });

  const { data: blogs } = useQuery({
    queryKey: ["/api/blogs"],
    queryFn: async () => {
      const response = await fetch("/api/blogs");
      return response.json();
    },
  });

  const stats = [
    {
      title: "Active Pods",
      value: pods?.length || 0,
      description: "Currently running pods",
      icon: Users,
      color: "text-chart-1",
      bgColor: "bg-gradient-to-br from-chart-1/20 to-chart-1/10",
    },
    {
      title: "Total Apps",
      value: apps?.length || 0,
      description: "Applications in portfolio",
      icon: Code,
      color: "text-chart-2",
      bgColor: "bg-gradient-to-br from-chart-2/20 to-chart-2/10",
    },
    {
      title: "Blog Posts",
      value: blogs?.length || 0,
      description: "Published articles",
      icon: BookOpen,
      color: "text-chart-3",
      bgColor: "bg-gradient-to-br from-chart-3/20 to-chart-3/10",
    },
    {
      title: "Growth Rate",
      value: "12%",
      description: "Monthly growth",
      icon: TrendingUp,
      color: "text-chart-4",
      bgColor: "bg-gradient-to-br from-chart-4/20 to-chart-4/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Deep Lab admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="backdrop-blur-sm bg-background/80 border-border shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="backdrop-blur-sm bg-background/80 border-border shadow-xl">
        <CardHeader>
          <CardTitle className="text-foreground">Quick Actions</CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your content and monitor your lab's progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 border-border hover:bg-muted"
              onClick={() => window.location.href = "/admin/pods"}
            >
              <Users className="h-6 w-6" />
              <span>Manage Pods</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 border-border hover:bg-muted"
              onClick={() => window.location.href = "/admin/apps"}
            >
              <Code className="h-6 w-6" />
              <span>Manage Apps</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 border-border hover:bg-muted"
              onClick={() => window.location.href = "/admin/blogs"}
            >
              <BookOpen className="h-6 w-6" />
              <span>Manage Blogs</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}