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
import logoImage from "@assets/logo.png";
import logoDark from "@assets/logo-dark.svg";
import logoMono from "@assets/logo.svg";

// Custom 3x3 grid icon component - Large circular dots
const AppsIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 3x3 Grid of circles - small spacing */}
    <circle cx="30" cy="30" r="6" fill="currentColor" />
    <circle cx="50" cy="30" r="6" fill="currentColor" />
    <circle cx="70" cy="30" r="6" fill="currentColor" />
    <circle cx="30" cy="50" r="6" fill="currentColor" />
    <circle cx="50" cy="50" r="6" fill="currentColor" />
    <circle cx="70" cy="50" r="6" fill="currentColor" />
    <circle cx="30" cy="70" r="6" fill="currentColor" />
    <circle cx="50" cy="70" r="6" fill="currentColor" />
    <circle cx="70" cy="70" r="6" fill="currentColor" />
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
    { label: "Ideas", path: "/ideas" },
    { label: "Projects", path: "/projects" },
    { label: "Workflow", path: "/workflow" },
    { label: "Blog", path: "/blog" },
  ];

  const appLinks = [
    { 
      id: "initiatives",
      label: "Initiatives", 
      description: "DEEP - Where bold, bright and beneficial ideas are turned into real world solutions to create a better future for all!", 
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
          <AppsIcon className="h-12 w-12 md:h-13 md:w-13 text-primary-foreground" />
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

              <div className="pt-8 pb-16 px-6 w-96 group border-r-2 border-white/20" style={{ background: 'linear-gradient(135deg, #14082E 0%, rgb(120,50,150) 50%, #3d1f5c 100%)' }}>
              <div className="flex flex-col items-start gap-1">
                {/* Logo + Title */}
                <div className="flex items-center gap-3 mb-2 px-2">
                  <img src={logoMono} alt="DEEP" className="w-10 h-10 object-contain" />
                  <span style={{ color: '#FFF', fontFamily: 'Orbitron', fontSize: 24, fontStyle: 'normal', fontWeight: 700, lineHeight: '20px', display: 'flex', gap: 12, alignItems: 'center' as const }}>Initiatives</span>
                </div>

                {/* Description */}
                <p className="mb-0 pl-2" style={{ color: '#D2D6DD', fontFamily: 'DM Sans', fontSize: 14, fontStyle: 'normal', fontWeight: 600, lineHeight: '20px' }}>
                DEEP - Where bold, bright and beneficial ideas are turned into real world solutions to create a better future for all! 
                </p>

                {/* Coming Soon badge */}
                <div className="pl-2" style={{
                  marginTop: 20
                }}>
                  <span style={{
                    color: '#D2D0D7', fontFamily: 'DM Sans', fontSize: 12, fontStyle: 'normal', fontWeight: 600, lineHeight: '20px',
                    display: 'flex', padding: '4px 12px', justifyContent: 'center', alignItems: 'center', gap: 10, borderRadius: 60,
                    border: '1px solid #A39EB2', background: 'rgba(255, 255, 255, 0.04)', width: 'fit-content'
                  }}>
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
            
            {/* Right side - grid of 4 apps */}
            <div className="flex-1 px-8 pt-8 pb-16 flex items-center">
              <div className="grid grid-cols-2 gap-8 gap-y-4">
                {/* Funding */}
                <div className="flex items-start">
                  <div 
                    onClick={() => window.open('https://deepfunding.ai/', '_blank')}
                    className="px-4 pt-0 pb-3 cursor-pointer group"
                    style={{
                      borderRadius: '0px',
                      transition: 'background-color 0.1s ease, border-radius 0s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (e.currentTarget) {
                        const element = e.currentTarget;
                        // Set square immediately
                        element.style.backgroundColor = 'white';
                        element.style.borderRadius = '0px';
                        element.style.paddingTop = '1rem';
                        element.style.marginTop = '-1rem';
                        element.style.transition = 'background-color 0.1s ease, border-radius 0s ease, padding-top 0.1s ease, margin-top 0.1s ease';
                        // Increase background footprint without layout shift
                        // Compensate padding with negative margin to prevent movement
                        
                        // Force reflow to ensure square is rendered
                        void element.offsetHeight;
                        
                        // Then animate to rounded
                        requestAnimationFrame(() => {
                          requestAnimationFrame(() => {
                            if (element) {
                              element.style.transition = 'background-color 0.1s ease, border-radius 0.4s ease, padding-top 0.1s ease, margin-top 0.1s ease';
                              element.style.borderRadius = '0.75rem';
                            }
                          });
                        });
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (e.currentTarget) {
                        const element = e.currentTarget;
                        // Ensure border radius stays rounded during fade - background should disappear curved
                        // Explicitly keep it rounded and remove border-radius from transition so it doesn't animate
                        element.style.borderRadius = '0.75rem';
                        element.style.transition = 'background-color 0.3s ease, padding-top 0.1s ease, margin-top 0.1s ease';
                        // Transition background to transparent so it fades with curved shape
                        element.style.backgroundColor = 'transparent';
                        element.style.paddingTop = '';
                        element.style.marginTop = '';
                        // Reset border radius only after background has fully faded (keep it curved until then)
                        setTimeout(() => {
                          if (element) {
                            element.style.borderRadius = '0px';
                            element.style.transition = 'background-color 0.1s ease, border-radius 0s ease, padding-top 0.1s ease, margin-top 0.1s ease';
                          }
                        }, 350);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 mb-0">
                      <img src={logoMono} alt="DEEP" className="w-10 h-10 object-contain" />
                      <span className="text-white group-hover:text-black transition-colors" style={{ fontFamily: 'Orbitron', fontSize: 24, fontStyle: 'normal', fontWeight: 700, lineHeight: '20px', display: 'flex', gap: 12, alignItems: 'center' as const }}>Funding</span>
                    </div>
                    <p className="mt-1 transition-colors group-hover:!text-[#4A4A4A]" style={{ color: '#D2D6DD', fontFamily: 'DM Sans', fontSize: 14, fontStyle: 'normal', fontWeight: 600, lineHeight: '20px' }}>
                      An ecosystem for innovators to secure grants and resources to bring bold ideas to life.
                    </p>
                  </div>
                </div>

                {/* Community */}
                <div className="flex items-start">
                  <div 
                    onClick={() => window.open('https://community.deepfunding.ai/', '_blank')}
                    className="px-4 pt-0 pb-3 cursor-pointer group"
                    style={{
                      borderRadius: '0px',
                      transition: 'background-color 0.1s ease, border-radius 0s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (e.currentTarget) {
                        const element = e.currentTarget;
                        // Set square immediately
                        element.style.backgroundColor = 'white';
                        element.style.borderRadius = '0px';
                        element.style.paddingTop = '1rem';
                        element.style.marginTop = '-1rem';
                        element.style.transition = 'background-color 0.1s ease, border-radius 0s ease, padding-top 0.1s ease, margin-top 0.1s ease';
                        // Increase background footprint without layout shift
                        // Compensate padding with negative margin to prevent movement
                        
                        // Force reflow to ensure square is rendered
                        void element.offsetHeight;
                        
                        // Then animate to rounded
                        requestAnimationFrame(() => {
                          requestAnimationFrame(() => {
                            if (element) {
                              element.style.transition = 'background-color 0.1s ease, border-radius 0.4s ease, padding-top 0.1s ease, margin-top 0.1s ease';
                              element.style.borderRadius = '0.75rem';
                            }
                          });
                        });
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (e.currentTarget) {
                        const element = e.currentTarget;
                        // Ensure border radius stays rounded during fade - background should disappear curved
                        // Explicitly keep it rounded and remove border-radius from transition so it doesn't animate
                        element.style.borderRadius = '0.75rem';
                        element.style.transition = 'background-color 0.3s ease, padding-top 0.1s ease, margin-top 0.1s ease';
                        // Transition background to transparent so it fades with curved shape
                        element.style.backgroundColor = 'transparent';
                        element.style.paddingTop = '';
                        element.style.marginTop = '';
                        // Reset border radius only after background has fully faded (keep it curved until then)
                        setTimeout(() => {
                          if (element) {
                            element.style.borderRadius = '0px';
                            element.style.transition = 'background-color 0.1s ease, border-radius 0s ease, padding-top 0.1s ease, margin-top 0.1s ease';
                          }
                        }, 350);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 mb-0">
                      <img src={logoMono} alt="DEEP" className="w-10 h-10 object-contain" />
                      <span className="text-white group-hover:text-black transition-colors" style={{ fontFamily: 'Orbitron', fontSize: 24, fontStyle: 'normal', fontWeight: 700, lineHeight: '20px', display: 'flex', gap: 12, alignItems: 'center' as const }}>Communities</span>
                    </div>
                    <p className="mt-1 transition-colors group-hover:!text-[#4A4A4A]" style={{ color: '#D2D6DD', fontFamily: 'DM Sans', fontSize: 14, fontStyle: 'normal', fontWeight: 600, lineHeight: '20px' }}>
                      A collaborative space where builders, researchers, and supporters connect.
                    </p>
                  </div>
                </div>

                {/* Lab - Current site with white background */}
                <div className="flex items-start md:mt-3">
                  <div 
                    className="bg-white rounded-xl px-4 py-3 cursor-default transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-0">
                      <img src={logoMono} alt="DEEP" className="w-10 h-10 object-contain" />
                      <span style={{ color: '#000', fontFamily: 'Orbitron', fontSize: 24, fontStyle: 'normal', fontWeight: 700, lineHeight: '20px', display: 'flex', gap: 12, alignItems: 'center' as const }}>Lab</span>
                    </div>
                    <p className="mt-2" style={{ color: '#4A4A4A', fontFamily: 'DM Sans', fontSize: 14, fontStyle: 'normal', fontWeight: 600, lineHeight: '20px' }}>
                      The experimental arm of Deep, where new products, technologies, and methods are incubated.
                    </p>
                  </div>
                </div>

                {/* Ideation */}
                <div className="flex items-start md:mt-4">
                  <div 
                    className="rounded-xl px-4 pt-0 pb-3 cursor-default transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3 mb-0">
                      <img src={logoMono} alt="DEEP" className="w-10 h-10 object-contain" />
                      <span style={{ color: '#FFF', fontFamily: 'Orbitron', fontSize: 24, fontStyle: 'normal', fontWeight: 700, lineHeight: '20px', display: 'flex', gap: 12, alignItems: 'center' as const }}>Ideation</span>
                      <span style={{
                        color: '#D2D0D7', fontFamily: 'DM Sans', fontSize: 12, fontStyle: 'normal', fontWeight: 600, lineHeight: '20px',
                        display: 'flex', padding: '4px 12px', justifyContent: 'center', alignItems: 'center', gap: 10, borderRadius: 60,
                        border: '1px solid #A39EB2', background: 'rgba(255, 255, 255, 0.04)'
                      }}>
                        COMING SOON
                      </span>
                    </div>
                    <p className="mt-1" style={{ color: '#D2D6DD', fontFamily: 'DM Sans', fontSize: 14, fontStyle: 'normal', fontWeight: 600, lineHeight: '20px' }}>
                      Discover, share, and shape groundbreaking ideas with a community that values your voice.<br />
                      Explore trending concepts or submit your own to make an impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile layout - Vertical stack */}
          <div className="md:hidden flex flex-col px-4 py-3 gap-4">
            {/* Initiatives */}
            <div className="border-2 border-white/20 rounded-none pt-12 pb-5 px-5 -mx-4 -mt-3 group" style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.45)', background: 'linear-gradient(135deg, #14082E 0%, rgb(120,50,150) 50%, #3d1f5c 100%)' }}>
              <div className="flex items-center gap-3 mb-3">
                <img src={logoMono} alt="DEEP" className="w-10 h-10 object-contain" />
                <span style={{ color: '#FFF', fontFamily: 'Orbitron', fontSize: 24, fontStyle: 'normal', fontWeight: 700, lineHeight: '20px', display: 'flex', gap: 12, alignItems: 'center' as const }}>Initiatives</span>
              </div>
              <p className="mb-0" style={{ color: '#D2D6DD', fontFamily: 'DM Sans', fontSize: 14, fontStyle: 'normal', fontWeight: 600, lineHeight: '20px' }}>
                DEEP Connects Bold Ideas to Real World Change<br />and build a better future together.
              </p>
              <span style={{
                color: '#D2D0D7', fontFamily: 'DM Sans', fontSize: 12, fontStyle: 'normal', fontWeight: 600, lineHeight: '20px',
                display: 'flex', padding: '4px 12px', justifyContent: 'center', alignItems: 'center', gap: 10, borderRadius: 60,
                border: '1px solid #A39EB2', background: 'rgba(255, 255, 255, 0.04)', width: 'fit-content', marginTop: 20
              }}>
                Coming Soon
              </span>
            </div>

            {/* Funding */}
            <div 
              onClick={() => {
                window.open('https://deepfunding.ai/', '_blank');
                setIsAppsDropdownOpen(false);
              }}
              className="bg-gray-800/50 backdrop-blur-sm border border-white/20 rounded-xl p-4 cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-0">
                <img src={logoMono} alt="DEEP" className="w-8 h-8 object-contain" />
                <span style={{ color: '#FFF', fontFamily: 'Orbitron', fontSize: 20, fontStyle: 'normal', fontWeight: 700, lineHeight: '20px', display: 'flex', gap: 12, alignItems: 'center' as const }}>Funding</span>
              </div>
              <p className="mt-1 text-white/70" style={{ color: '#D2D6DD', fontFamily: 'DM Sans', fontSize: 14, fontStyle: 'normal', fontWeight: 600, lineHeight: '20px' }}>
                An ecosystem for innovators to secure grants and resources to bring bold ideas to life.
              </p>
            </div>

            {/* Community */}
            <div 
              onClick={() => {
                window.open('https://community.deepfunding.ai/', '_blank');
                setIsAppsDropdownOpen(false);
              }}
              className="bg-gray-800/50 backdrop-blur-sm border border-white/20 rounded-xl p-4 cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-0">
                <img src={logoMono} alt="DEEP" className="w-8 h-8 object-contain" />
                <span style={{ color: '#FFF', fontFamily: 'Orbitron', fontSize: 20, fontStyle: 'normal', fontWeight: 700, lineHeight: '20px', display: 'flex', gap: 12, alignItems: 'center' as const }}>Communities</span>
              </div>
              <p className="mt-1 text-white/70" style={{ color: '#D2D6DD', fontFamily: 'DM Sans', fontSize: 14, fontStyle: 'normal', fontWeight: 600, lineHeight: '20px' }}>
                A collaborative space where builders, researchers, and supporters connect.
              </p>
            </div>

            {/* Lab - Current site */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-0">
                <img src={logoMono} alt="DEEP" className="w-8 h-8 object-contain" />
                <span style={{ color: '#FFF', fontFamily: 'Orbitron', fontSize: 20, fontStyle: 'normal', fontWeight: 700, lineHeight: '20px', display: 'flex', gap: 12, alignItems: 'center' as const }}>Lab</span>
              </div>
              <p className="mt-2" style={{ color: '#B0B5BD', fontFamily: 'DM Sans', fontSize: 14, fontStyle: 'normal', fontWeight: 600, lineHeight: '20px' }}>
                The experimental arm of Deep, where new products, technologies, and methods are incubated.
              </p>
            </div>

            {/* Ideation */}
            <div 
              className="bg-gray-800/50 backdrop-blur-sm border border-white/20 rounded-xl p-4 cursor-default group"
            >
              <div className="flex items-center gap-3 mb-0">
                <img src={logoMono} alt="DEEP" className="w-8 h-8 object-contain" />
                <span style={{ color: '#FFF', fontFamily: 'Orbitron', fontSize: 20, fontStyle: 'normal', fontWeight: 700, lineHeight: '20px', display: 'flex', gap: 12, alignItems: 'center' as const }}>Ideation</span>
                <span style={{
                  color: '#D2D0D7', fontFamily: 'DM Sans', fontSize: 12, fontStyle: 'normal', fontWeight: 600, lineHeight: '20px',
                  display: 'flex', padding: '4px 12px', justifyContent: 'center', alignItems: 'center', gap: 10, borderRadius: 60,
                  border: '1px solid #A39EB2', background: 'rgba(255, 255, 255, 0.04)'
                }}>
                  COMING SOON
                </span>
              </div>
              <p className="mt-1 text-white/70" style={{ color: '#D2D6DD', fontFamily: 'DM Sans', fontSize: 14, fontStyle: 'normal', fontWeight: 600, lineHeight: '20px' }}>
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
            <div className="flex items-center gap-2 transition-transform duration-300 group-hover:scale-105">
              <img src={logoMono} alt="DEEP" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
              <span style={{ color: '#FFF', fontFamily: 'Orbitron', fontSize: 20, fontStyle: 'normal', fontWeight: 700, lineHeight: '20px', display: 'flex', alignItems: 'center' as const }}>Lab</span>
            </div>
          </button>

          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavigation(link.path)}
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  height: "88px",
                  lineHeight: "88px",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: theme === 'dark' ? "#FFFFFF" : "#1A1A1A",
                  padding: "0 20px",
                  textTransform: "none",
                }}
                className="transition-colors hover-elevate"
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
              className="bg-gradient-to-r from-chart-1 to-chart-2 text-white border-0 hover:opacity-90 transition-opacity"
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
                onClick={() => handleNavigation(link.path)}
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
              className="w-full bg-gradient-to-r from-chart-1 to-chart-2 text-white border-0 hover:opacity-90 transition-opacity"
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

