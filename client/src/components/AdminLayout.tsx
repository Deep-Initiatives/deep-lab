import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, LogOut, Home, Users, Code, BookOpen, FileText, Lightbulb, Mail, Settings, User, ChevronDown } from "lucide-react";
import logoImage from "@assets/logo.svg";

interface AdminLayoutProps {
  children: React.ReactNode;
  userRole?: string;
}

const navigationItems = [
  { id: "home", label: "Dashboard", href: "/admin", icon: Home },
  { id: "pods", label: "Pods", href: "/admin/pods", icon: Users },
  { id: "apps", label: "Apps", href: "/admin/apps", icon: Code },
  { id: "blogs", label: "Blogs", href: "/admin/blogs", icon: BookOpen },
  { id: "applications", label: "Applications", href: "/admin/applications", icon: FileText },
  { id: "ideas", label: "Ideas", href: "/admin/ideas", icon: Lightbulb },
  { id: "contacts", label: "Contacts", href: "/admin/contacts", icon: Mail },
];

export function AdminLayout({ children, userRole }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { logout, user } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  // Filter navigation items based on user role
  const getFilteredNavigationItems = () => {
    if (userRole === "blog-admin") {
      return navigationItems.filter(item => 
        item.id === "home" || item.id === "blogs"
      );
    }
    return navigationItems;
  };

  const handleNavigation = (href: string) => {
    setLocation(href);
    setIsSidebarOpen(false);
    setIsUserDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  const handleUserDropdownToggle = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleSettingsClick = () => {
    setLocation("/admin/settings");
    setIsSidebarOpen(false);
    setIsUserDropdownOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location === "/admin";
    }
    return location.startsWith(href);
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
                className="h-16 object-contain"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {getFilteredNavigationItems().map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full justify-start gap-3 h-10 transition-all duration-200 relative ${
                    active
                      ? "bg-gradient-to-r from-chart-1/20 to-chart-2/20 text-chart-1 border border-chart-1/30 shadow-sm font-medium border-l-4 border-l-chart-1"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
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
          <div className="p-4 space-y-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Theme:</span>
              <ThemeToggle />
            </div>
            
            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                className="w-full justify-between gap-3 h-auto p-3 hover:bg-muted transition-all duration-200"
                onClick={handleUserDropdownToggle}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-chart-1 to-chart-2 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground">{user?.username}</span>
                    <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
                  </div>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </Button>
              
              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-background border border-border rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-10 px-3 text-foreground hover:bg-muted transition-all duration-200"
                      onClick={handleSettingsClick}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-10 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </div>
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