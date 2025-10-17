import { useState, useEffect } from "react";
import { Menu, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";
import logoImage from "@assets/logo.png";

// Custom 3x3 grid icon component
const AppsIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="6" cy="6" r="2" fill="currentColor" />
    <circle cx="12" cy="6" r="2" fill="currentColor" />
    <circle cx="18" cy="6" r="2" fill="currentColor" />
    <circle cx="6" cy="12" r="2" fill="currentColor" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <circle cx="18" cy="12" r="2" fill="currentColor" />
    <circle cx="6" cy="18" r="2" fill="currentColor" />
    <circle cx="12" cy="18" r="2" fill="currentColor" />
    <circle cx="18" cy="18" r="2" fill="currentColor" />
  </svg>
);

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (path: string) => {
    setLocation(path);
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", path: "/", id: "hero" },
    { label: "Projects", path: "/", id: "projects" },
    { label: "Pods", path: "/", id: "pods" },
    { label: "Blog", path: "/blog" },
    { label: "Journey", path: "/", id: "journey" },
  ];

  const appLinks = [
    { label: "DF Website", url: "https://deepfunding.ai/" },
    { label: "DF Community", url: "https://community.deepfunding.ai/" },
    { label: "AI4 Peace", url: "https://ai4p.ai" },
    { label: "DF Manual", url: "https://df-manual.github.io" },
    { label: "OpenProject", url: "https://task.deepfunding.ai" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-xl bg-gradient-to-r from-chart-1 to-chart-2/80 border-b border-border"
          : "bg-gradient-to-r from-chart-1 to-chart-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center h-16 md:h-20">
          <button
            onClick={() => handleNavigation("/")}
            className="flex items-center space-x-3 group"
            data-testid="button-logo"
          >
            <img
              src={logoImage}
              alt="Deep Lab"
              className="h-10 md:h-12 transition-transform duration-300 group-hover:scale-105"
            />
          </button>

          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => link.id ? scrollToSection(link.id) : handleNavigation(link.path)}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors hover-elevate px-3 py-2 rounded-md"
                data-testid={`link-nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button
              size="sm"
              variant="default"
              onClick={() => handleNavigation("/join-team")}
              className="bg-white text-chart-1 hover:bg-white/90 border-0"
              data-testid="button-join-team"
            >
              Join Team
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20 p-3"
                >
                  <AppsIcon className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {appLinks.map((app) => (
                  <DropdownMenuItem
                    key={app.url}
                    onClick={() => window.open(app.url, '_blank')}
                    className="cursor-pointer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {app.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="md:hidden flex"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Mobile menu */}
          <div className="md:hidden backdrop-blur-xl bg-gradient-to-r from-chart-1 to-chart-2 border-b border-border shadow-lg z-50 relative">
            <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => link.id ? scrollToSection(link.id) : handleNavigation(link.path)}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover-elevate rounded-md transition-colors"
                data-testid={`link-mobile-${link.label.toLowerCase()}`}
              >
                {link.label}
              </button>
            ))}
            <div className="px-4 py-2">
              <div className="text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                <AppsIcon className="h-4 w-4" />
                Apps
              </div>
              <div className="space-y-1">
                {appLinks.map((app) => (
                  <button
                    key={app.url}
                    onClick={() => window.open(app.url, '_blank')}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/20 rounded-md transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {app.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2">
              <span className="text-sm text-white/80">Theme:</span>
              <ThemeToggle />
            </div>
            <Button
              variant="default"
              onClick={() => handleNavigation("/join-team")}
              className="w-full bg-white text-chart-1 hover:bg-white/90 border-0"
              data-testid="button-mobile-join"
            >
              Join Team
            </Button>
          </div>
        </div>
        </>
      )}
    </nav>
  );
}