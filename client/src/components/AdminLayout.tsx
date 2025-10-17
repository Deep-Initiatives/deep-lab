import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, LogOut, Home, Users, Code, BookOpen } from "lucide-react";
import logoImage from "@assets/logo.png";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { id: "home", label: "Dashboard", href: "/admin", icon: Home },
  { id: "pods", label: "Pods", href: "/admin/pods", icon: Users },
  { id: "apps", label: "Apps", href: "/admin/apps", icon: Code },
  { id: "blogs", label: "Blogs", href: "/admin/blogs", icon: BookOpen },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { logout } = useAuth();

  const handleNavigation = (href: string) => {
    setLocation(href);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b bg-background border-border">
        <h1 className="text-lg font-semibold text-foreground">Admin Dashboard</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`
            fixed inset-y-0 left-0 z-50 w-64 border-r bg-background border-border transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            lg:flex lg:flex-col lg:h-screen
          `}
        >
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-chart-1/10 via-chart-2/10 to-chart-3/10 border-border">
            <div className="flex items-center gap-3">
              <img
                src={logoImage}
                alt="Deep Lab"
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-foreground" style={{ fontFamily: 'Orbitron', fontWeight: 600, fontSize: '25px', lineHeight: '100%', letterSpacing: '0%' }}>Funding Lab</h1>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start gap-3 h-10 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                  onClick={() => handleNavigation(item.href)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          <Separator />

          {/* Sidebar footer */}
          <div className="p-4 space-y-6 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Theme:</span>
              <ThemeToggle />
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:ml-64">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}