import { useState, useEffect } from "react";
import { Menu, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";
import logoImage from "@assets/logo.svg";
import logoDark from "@assets/logo-dark.svg";
import logoLab from "@assets/logo-lab.svg";
import logoInitiatives from "@assets/logo-initiatives.svg";
import logoFunding from "@assets/logo-funding.svg";
import logoCommunity from "@assets/logo-community.svg";
import logoIdeation from "@assets/logo-ideation.svg";

// Custom 3x3 grid icon component - Large circular dots
const AppsIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 3x3 Grid of circles - extremely tight spacing */}
    <circle cx="35" cy="35" r="6" fill="currentColor" />
    <circle cx="50" cy="35" r="6" fill="currentColor" />
    <circle cx="65" cy="35" r="6" fill="currentColor" />
    <circle cx="35" cy="50" r="6" fill="currentColor" />
    <circle cx="50" cy="50" r="6" fill="currentColor" />
    <circle cx="65" cy="50" r="6" fill="currentColor" />
    <circle cx="35" cy="65" r="6" fill="currentColor" />
    <circle cx="50" cy="65" r="6" fill="currentColor" />
    <circle cx="65" cy="65" r="6" fill="currentColor" />
  </svg>
);

// DEEP Logo component for the apps - fills entire square from edge to edge
const DeepLogo = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 5 horizontal bars filling the entire square from edge to edge */}
    <rect x="0" y="0" width="48" height="9" fill="#FF6B6B" />
    <rect x="0" y="9.6" width="48" height="9" fill="#4ECDC4" />
    <rect x="0" y="19.2" width="48" height="9" fill="#45B7D1" />
    <rect x="0" y="28.8" width="48" height="9" fill="#96CEB4" />
    <rect x="0" y="38.4" width="48" height="9.6" fill="#DDA15E" />
  </svg>
);

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAppsDropdownOpen, setIsAppsDropdownOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { theme } = useTheme();

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
    setIsAppsDropdownOpen(false);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
      setIsAppsDropdownOpen(false);
    }
  };

  const navLinks = [
    { label: "Contact", path: "/contact" },
    { label: "Projects", path: "/", id: "projects" },
    { label: "Pods", path: "/", id: "pods" },
    { label: "Blog", path: "/blog" },
    { label: "Journey", path: "/", id: "journey" },
  ];

  const appLinks = [
    { 
      id: "initiatives",
      label: "Initiatives", 
      description: "DEEP Connects Bold Ideas to Real World Change and build a better future together.", 
      url: "https://deepfunding.ai/",
      badge: "Coming Soon"
    },
    { 
      id: "funding",
      label: "Funding", 
      description: "An ecosystem for innovators to secure grants and resources to bring bold ideas to life.", 
      url: "https://deepfunding.ai/",
      badge: "NEW"
    },
    { 
      id: "community",
      label: "Community", 
      description: "A collaborative space where builders, researchers, and supporters connect.", 
      url: "https://community.deepfunding.ai/",
      badge: null
    },
    { 
      id: "lab",
      label: "Lab", 
      description: "The experimental arm of Deep, where new products, technologies, and methods are incubated.", 
      url: "https://lab.deepfunding.ai",
      badge: null
    },
    { 
      id: "ideation",
      label: "Ideation", 
      description: "Discover, share, and shape groundbreaking ideas with a community that values your voice. Explore trending concepts or submit your own to make an impact.", 
      url: "https://ideation.deepfunding.ai",
      badge: "Coming Soon"
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-xl border-b border-[#B620E0]/30"
          : ""
      }`}
      style={{
        background: isScrolled 
          ? (theme === 'dark' 
              ? "linear-gradient(to right, hsl(var(--chart-1)), hsl(var(--chart-2)), hsl(var(--chart-3))) / 95%"
              : "linear-gradient(to right, #E0E7FF, #F3E8FF, #FED7AA) / 95%")
          : (theme === 'dark' 
              ? "linear-gradient(to right, hsl(var(--chart-1)), hsl(var(--chart-2)), hsl(var(--chart-3)))"
              : "linear-gradient(to right, #E0E7FF, #F3E8FF, #FED7AA)")
      }}
    >
      {/* Apps icon at absolute left edge - no container */}
      <div 
        className="absolute left-0 top-0 h-16 md:h-20 w-16 md:w-20 bg-chart-1 hover:bg-chart-1/90 cursor-pointer z-50 group"
        onMouseEnter={() => setIsAppsDropdownOpen(true)}
        onMouseLeave={() => setIsAppsDropdownOpen(false)}
      >
        <div 
          className="h-full w-full flex items-center justify-center md:pointer-events-none"
          onClick={() => setIsAppsDropdownOpen(!isAppsDropdownOpen)}
        >
          <AppsIcon className="h-full w-full text-primary-foreground" />
        </div>
      </div>

      {/* Apps dropdown - hover on desktop, click on mobile */}
      {isAppsDropdownOpen && (
        <>
          {/* Backdrop overlay - only on mobile */}
          <div 
            className="md:hidden fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsAppsDropdownOpen(false)}
          />
          <div 
            className="absolute top-full left-0 w-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 transition-all duration-200 z-50 max-h-[calc(100vh-5rem)] overflow-y-auto"
            onMouseEnter={() => setIsAppsDropdownOpen(true)}
            onMouseLeave={() => setIsAppsDropdownOpen(false)}
          >
          {/* Desktop layout */}
          <div className="hidden md:flex">
              {/* Left side box - Initiatives - spans full height */}
              <div className="bg-white/10 backdrop-blur-sm border-r border-white/20 py-3 px-6 w-80">
              <div className="flex flex-col items-start gap-2">
                {/* Logo at top */}
                <div className="w-32 h-24 flex items-center justify-center flex-shrink-0">
                  <img src={logoInitiatives} alt="DEEP Initiatives" className="w-full h-full object-contain" />
                </div>
                
                {/* Text in middle */}
                <p className="text-white text-sm leading-relaxed mb-1">
                  DEEP Connects Bold Ideas to Real World Change and build a better future together.
                </p>
                
                {/* Coming Soon badge at bottom */}
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/20 text-white border border-white/30">
                  Coming Soon
                </span>
              </div>
            </div>
            
            {/* Right side - grid of 4 apps */}
            <div className="flex-1 px-8 py-3">
              <div className="grid grid-cols-2 gap-2">
                {/* Funding */}
                <div 
                  onClick={() => window.open('https://deepfunding.ai/', '_blank')}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1 hover:bg-white hover:border-white/20 cursor-pointer transition-all duration-300 group"
                >
                  <div className="flex items-start gap-2 mb-0">
                    <div className="w-32 h-24 flex items-center justify-center flex-shrink-0">
                      <img src={logoFunding} alt="DEEP Funding" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex items-center gap-2">
                
                    </div>
                  </div>
                  <p className="text-white group-hover:text-gray-700 text-sm leading-relaxed transition-colors">
                    An ecosystem for innovators to secure grants and resources to bring bold ideas to life.
                  </p>
                </div>

                {/* Community */}
                <div 
                  onClick={() => window.open('https://community.deepfunding.ai/', '_blank')}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1 hover:bg-white hover:border-white/20 cursor-pointer transition-all duration-300 group"
                >
                  <div className="flex items-start gap-2 mb-0">
                    <div className="w-32 h-24 flex items-center justify-center flex-shrink-0">
                      <img src={logoCommunity} alt="DEEP Community" className="w-full h-full object-contain" />
                    </div>
                  </div>
                  <p className="text-white group-hover:text-gray-700 text-sm leading-relaxed transition-colors">
                    A collaborative space where builders, researchers, and supporters connect.
                  </p>
                </div>

                {/* Lab - Current site with white background */}
                <div 
                  className="bg-white border border-white/20 rounded-xl p-1 cursor-default transition-all duration-300"
                >
                  <div className="flex items-start gap-2 mb-0">
                    <div className="w-32 h-24 flex items-center justify-center flex-shrink-0">
                      <img src={logoLab} alt="DEEP Lab" className="w-full h-full object-contain" />
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    The experimental arm of Deep, where new products, technologies, and methods are incubated.
                  </p>
                </div>

                {/* Ideation */}
                <div 
                  onClick={() => window.open('https://ideation.deepfunding.ai', '_blank')}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1 hover:bg-white hover:border-white/20 cursor-pointer transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-0">
                    <div className="w-32 h-24 flex items-center justify-center flex-shrink-0">
                      <img src={logoIdeation} alt="DEEP Ideation" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/20 text-white border border-white/30">
                          Coming Soon
                        </span>
                    </div>
                  </div>
                  <p className="text-white group-hover:text-gray-700 text-sm leading-relaxed transition-colors">
                    Discover, share, and shape groundbreaking ideas with a community that values your voice. Explore trending concepts or submit your own to make an impact.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile layout - Vertical stack */}
          <div className="md:hidden flex flex-col px-4 py-4 gap-3">
            {/* Initiatives */}
            <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-sm border border-white/20 rounded-xl p-3">
              <div className="flex items-start gap-3 mb-0">
                <div className="w-40 h-28 flex items-center justify-center flex-shrink-0">
                  <img src={logoInitiatives} alt="DEEP Initiatives" className="w-full h-full object-contain" />
                </div>
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-2">
                DEEP Connects Bold Ideas to Real World Change and build a better future together.
              </p>
              <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-white/20 text-white border border-white/30">
                Coming Soon
              </span>
            </div>

            {/* Funding */}
            <div 
              onClick={() => {
                window.open('https://deepfunding.ai/', '_blank');
                setIsAppsDropdownOpen(false);
              }}
              className="bg-gray-800/50 backdrop-blur-sm border border-white/20 rounded-xl p-3 cursor-pointer"
            >
              <div className="flex items-start gap-3 mb-0">
                <div className="w-40 h-28 flex items-center justify-center flex-shrink-0">
                  <img src={logoFunding} alt="DEEP Funding" className="w-full h-full object-contain" />
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                An ecosystem for innovators to secure grants and resources to bring bold ideas to life.
              </p>
            </div>

            {/* Community */}
            <div 
              onClick={() => {
                window.open('https://community.deepfunding.ai/', '_blank');
                setIsAppsDropdownOpen(false);
              }}
              className="bg-gray-800/50 backdrop-blur-sm border border-white/20 rounded-xl p-3 cursor-pointer"
            >
              <div className="flex items-start gap-3 mb-0">
                <div className="w-40 h-28 flex items-center justify-center flex-shrink-0">
                  <img src={logoCommunity} alt="DEEP Community" className="w-full h-full object-contain" />
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                A collaborative space where builders, researchers, and supporters connect.
              </p>
            </div>

            {/* Lab - Current site */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/50 rounded-xl p-3">
              <div className="flex items-start gap-3 mb-0">
                <div className="w-40 h-28 flex items-center justify-center flex-shrink-0">
                  <img src={logoImage} alt="DEEP Lab" className="w-full h-full object-contain" />
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                The experimental arm of Deep, where new products, technologies, and methods are incubated.
              </p>
            </div>

            {/* Ideation */}
            <div 
              onClick={() => {
                window.open('https://ideation.deepfunding.ai', '_blank');
                setIsAppsDropdownOpen(false);
              }}
              className="bg-gray-800/50 backdrop-blur-sm border border-white/20 rounded-xl p-3 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-0">
                <div className="w-40 h-28 flex items-center justify-center flex-shrink-0">
                  <img src={logoIdeation} alt="DEEP Ideation" className="w-full h-full object-contain" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-white/20 text-white border border-white/30">
                    COMING SOON
                  </span>
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Discover, share, and shape groundbreaking ideas with a community that values your voice. Explore trending concepts or submit your own to make an impact.
              </p>
            </div>
          </div>
        </div>
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => handleNavigation("/")}
            className="flex items-center space-x-3 group ml-16 md:ml-20"
            data-testid="button-logo"
          >
            <img
              src={logoImage}
              alt="Deep Lab"
              className="h-10 md:h-16 transition-transform duration-300 group-hover:scale-105"
            />
          </button>

          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => link.id ? scrollToSection(link.id) : handleNavigation(link.path)}
                className={`text-sm font-medium transition-colors hover-elevate px-3 py-2 rounded-md ${
                  theme === 'dark' 
                    ? 'text-white hover:text-white' 
                    : 'text-gray-800 hover:text-gray-900'
                }`}
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
              data-testid="button-join-team"
              className="bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 text-white border-0 hover:opacity-90 transition-opacity"
            >
              Join Team
            </Button>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className={`md:hidden hover:bg-white/20 ${
              theme === 'dark' 
                ? 'text-white hover:text-white' 
                : 'text-gray-800 hover:text-gray-900'
            }`}
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
              setIsAppsDropdownOpen(false);
            }}
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
          <div 
            className="md:hidden backdrop-blur-xl border-b border-[#B620E0]/30 shadow-lg z-50 relative"
            style={{
              background: theme === 'dark' 
                ? "linear-gradient(to right, hsl(var(--chart-1)), hsl(var(--chart-2)), hsl(var(--chart-3))) / 95%"
                : "linear-gradient(to right, #E0E7FF, #F3E8FF, #FED7AA) / 95%"
            }}
          >
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => link.id ? scrollToSection(link.id) : handleNavigation(link.path)}
                className={`block w-full text-left px-4 py-3 text-sm font-medium hover:bg-white/20 rounded-md transition-colors ${
                  theme === 'dark' 
                    ? 'text-white hover:text-white' 
                    : 'text-gray-800 hover:text-gray-900'
                }`}
                data-testid={`link-mobile-${link.label.toLowerCase()}`}
              >
                {link.label}
              </button>
            ))}
            <div className="flex items-center gap-2 px-4 py-2">
              <span className="text-sm text-white/80">Theme:</span>
              <ThemeToggle />
            </div>
            <Button
              variant="default"
              onClick={() => handleNavigation("/join-team")}
              className="w-full bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 text-white border-0 hover:opacity-90 transition-opacity"
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