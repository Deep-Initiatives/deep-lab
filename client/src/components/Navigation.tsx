import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import logoImage from "@assets/Lab Primary PNG Version_1760199760733.png";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", id: "hero" },
    { label: "Projects", id: "projects" },
    { label: "Pods", id: "pods" },
    { label: "Journey", id: "journey" },
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
            onClick={() => scrollToSection("hero")}
            className="flex items-center space-x-3 group"
            data-testid="button-logo"
          >
            <img
              src={logoImage}
              alt="Deep Lab"
              className="h-8 md:h-10 transition-transform duration-300 group-hover:scale-105"
            />
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors hover-elevate px-3 py-2 rounded-md"
                data-testid={`link-nav-${link.id}`}
              >
                {link.label}
              </button>
            ))}
            <ThemeToggle />
            <Button
              size="sm"
              variant="default"
              onClick={() => scrollToSection("join")}
              className="bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 text-white border-0"
              data-testid="button-join-team"
            >
              Join Team
            </Button>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden backdrop-blur-xl bg-background/95 border-b border-border">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-foreground/80 hover:text-foreground hover-elevate rounded-md transition-colors"
                data-testid={`link-mobile-${link.id}`}
              >
                {link.label}
              </button>
            ))}
            <div className="flex items-center gap-2 px-4 py-2">
              <span className="text-sm text-muted-foreground">Theme:</span>
              <ThemeToggle />
            </div>
            <Button
              variant="default"
              onClick={() => scrollToSection("join")}
              className="w-full bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 text-white border-0"
              data-testid="button-mobile-join"
            >
              Join Team
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
