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
          ? "backdrop-blur-xl bg-background/80 border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
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
            <span className="text-foreground" style={{ fontFamily: 'Orbitron', fontWeight: 600, fontSize: '25px', lineHeight: '100%', letterSpacing: '0%' }}>Funding Lab</span>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => link.id ? scrollToSection(link.id) : handleNavigation(link.path)}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors hover-elevate px-3 py-2 rounded-md"
                data-testid={`link-nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </button>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border hover:bg-muted"
                >
                  Apps
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
            <ThemeToggle />
            <Button
              size="sm"
              variant="default"
              onClick={() => handleNavigation("/join-team")}
              className="bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 text-white border-0"
              data-testid="button-join-team"
            >
              Join Team
            </Button>
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
          <div className="md:hidden backdrop-blur-xl bg-background/98 border-b border-border shadow-lg z-50 relative">
            <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => link.id ? scrollToSection(link.id) : handleNavigation(link.path)}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-foreground/80 hover:text-foreground hover-elevate rounded-md transition-colors"
                data-testid={`link-mobile-${link.label.toLowerCase()}`}
              >
                {link.label}
              </button>
            ))}
            <div className="px-4 py-2">
              <div className="text-sm font-medium text-muted-foreground mb-2">Apps</div>
              <div className="space-y-1">
                {appLinks.map((app) => (
                  <button
                    key={app.url}
                    onClick={() => window.open(app.url, '_blank')}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {app.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2">
              <span className="text-sm text-muted-foreground">Theme:</span>
              <ThemeToggle />
            </div>
            <Button
              variant="default"
              onClick={() => handleNavigation("/join-team")}
              className="w-full bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 text-white border-0"
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