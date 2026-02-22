import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import { useLocation } from "wouter";
import logoMono from "@assets/logo.svg";

const GLOBAL_SWITCHER_ENDPOINT = "/api/global-switcher";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { theme } = useTheme();
  const switcherContainerRef = useRef<HTMLDivElement | null>(null);
  const switcherMountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const controller = new AbortController();
    let mounted = true;
    let overlayObserver: MutationObserver | null = null;
    const originalBodyClassListAdd = document.body.classList.add;
    let handleOrientationChange: (() => void) | null = null;

    const removeExistingSwitcher = () => {
      const existing = document.body.querySelector<HTMLDivElement>(
        '[data-global-switcher="true"]'
      );
      if (existing?.parentNode) {
        existing.parentNode.removeChild(existing);
      }
    };

    const appendScripts = (container: HTMLElement) => {
      const scripts = Array.from(container.querySelectorAll("script"));
      scripts.forEach((script) => {
        const newScript = document.createElement("script");
        Array.from(script.attributes).forEach((attr) =>
          newScript.setAttribute(attr.name, attr.value)
        );
        newScript.text = `${script.textContent ?? ""}\nif (document.readyState !== "loading") {\n  const event = new Event("DOMContentLoaded");\n  document.dispatchEvent(event);\n}`;
        script.replaceWith(newScript);
      });
    };

    const injectFallbackScript = () => {
      // Check if fallback script already exists
      if (document.getElementById("global-switcher-fallback-script")) {
        return;
      }

      const fallbackScript = document.createElement("script");
      fallbackScript.id = "global-switcher-fallback-script";
      fallbackScript.textContent = `
        document.addEventListener("DOMContentLoaded", function () {
          let hoverInTimeout, hoverOutTimeout;
          let clickedRecently = false;

          const isLargeScreen = () => window.innerWidth > 1200;

          const switcherWrapper = document.querySelector(".df-switch-tabs-wrapper");
          const toggleButton = document.getElementById("toggle-switch-tabs");

          function openSwitcher() {
            switcherWrapper?.classList.add("active");
            // Force visibility on mobile
            if (switcherWrapper && window.innerWidth <= 1200) {
              // Get the toggle button position
              let topPosition = 80; // Default navbar height
              if (toggleButton) {
                const toggleRect = toggleButton.getBoundingClientRect();
                topPosition = toggleRect.top + toggleRect.height;
              }
              
              switcherWrapper.style.setProperty("display", "block", "important");
              switcherWrapper.style.setProperty("visibility", "visible", "important");
              switcherWrapper.style.setProperty("opacity", "1", "important");
              switcherWrapper.style.setProperty("z-index", "70", "important");
              switcherWrapper.style.setProperty("position", "fixed", "important");
              switcherWrapper.style.setProperty("left", "0", "important");
              switcherWrapper.style.setProperty("right", "0", "important");
              switcherWrapper.style.setProperty("top", topPosition + "px", "important");
              switcherWrapper.style.setProperty("width", "100vw", "important");
              switcherWrapper.style.setProperty("max-width", "100vw", "important");
              switcherWrapper.style.setProperty("max-height", "calc(100vh - " + topPosition + "px)", "important");
              switcherWrapper.style.setProperty("overflow-y", "auto", "important");
              
              // Ensure wrapper content is visible
              const switchWrapper = switcherWrapper.querySelector(".df-switch-wrapper");
              if (switchWrapper) {
                switchWrapper.style.setProperty("display", "block", "important");
                switchWrapper.style.setProperty("visibility", "visible", "important");
                switchWrapper.style.setProperty("opacity", "1", "important");
                switchWrapper.style.setProperty("width", "100%", "important");
              }
            }
            // Don't add overlay class to prevent blur on switcher dropdown
            // document.body.classList.add("profile-icon-overlay");
          }

          function closeSwitcher() {
            switcherWrapper?.classList.remove("active");
            // Hide on mobile
            if (switcherWrapper && window.innerWidth <= 1200) {
              switcherWrapper.style.setProperty("display", "none", "important");
            }
            setTimeout(() => {
              if (!switcherWrapper?.classList.contains("active")) {
                // document.body.classList.remove("profile-icon-overlay");
              }
            }, 10);
          }

          // Toggle click - works on all screen sizes
          toggleButton?.addEventListener("click", function (e) {
            e.stopPropagation();
            if (switcherWrapper?.classList.contains("active")) {
              closeSwitcher();
            } else {
              openSwitcher();
            }
          });

          // Hover in/out - only for large screens
          const hoverTargets = [switcherWrapper, toggleButton].filter(Boolean);
          hoverTargets.forEach((el) => {
            el.addEventListener("mouseenter", function () {
              clearTimeout(hoverOutTimeout);
              hoverInTimeout = setTimeout(function () {
                if (isLargeScreen()) openSwitcher();
              }, 200);
            });

            el.addEventListener("mouseleave", function () {
              clearTimeout(hoverInTimeout);
              hoverOutTimeout = setTimeout(function () {
                if (isLargeScreen() && !clickedRecently) {
                  closeSwitcher();
                }
              }, 1500);
            });
          });

          // Click outside to close - works on all screen sizes
          document.addEventListener("click", function (event) {
            const target = event.target;
            const clickedInside =
              switcherWrapper?.contains(target) || toggleButton?.contains(target);

            if (!clickedInside) {
              closeSwitcher();
            }

            clickedRecently = clickedInside;
            setTimeout(() => (clickedRecently = false), 1000);
          });
        });
        
        // Trigger if DOM is already loaded
        if (document.readyState !== "loading") {
          const event = new Event("DOMContentLoaded");
          document.dispatchEvent(event);
        }
      `;
      document.head.appendChild(fallbackScript);
    };

    const applySwitcherColor = () => {
      const toggle = switcherContainerRef.current?.querySelector<HTMLElement>(".globalswitcher");
      if (toggle) {
        toggle.style.setProperty("background-color", "hsl(25, 100%, 63%)", "important");
        toggle.style.setProperty("border", "none", "important");
        toggle.style.setProperty("outline", "none", "important");
        toggle.style.setProperty("box-shadow", "none", "important");
        const toggleLink = toggle.querySelector<HTMLAnchorElement>("a");
        if (toggleLink) {
          toggleLink.style.setProperty("background-color", "hsl(25, 100%, 63%)", "important");
          toggleLink.style.setProperty("border", "none", "important");
          toggleLink.style.setProperty("outline", "none", "important");
        }
      }
    };

    const updatePosition = () => {
      const anchor = switcherMountRef.current;
      const container = switcherContainerRef.current;

      if (!anchor || !container) {
        return;
      }

      const anchorRect = anchor.getBoundingClientRect();

      container.style.position = "fixed";
      container.style.left = "0px";
      container.style.top = "0px";
      container.style.width = "100vw";
      container.style.maxWidth = "100vw";
      container.style.pointerEvents = "auto";
      container.style.height = "0px";
      container.style.overflow = "visible";
      container.style.zIndex = "60";

      const toggle = container.querySelector<HTMLElement>(".globalswitcher");
      if (toggle) {
        toggle.style.position = "fixed";
        toggle.style.left = `${anchorRect.left}px`;
        toggle.style.top = `${anchorRect.top}px`;
        toggle.style.display = "flex";
        toggle.style.alignItems = "stretch";
        toggle.style.justifyContent = "stretch";
        toggle.style.width = `${anchorRect.width}px`;
        toggle.style.height = `${anchorRect.height}px`;
        toggle.style.pointerEvents = "auto";
        toggle.style.zIndex = "60";
        toggle.style.setProperty("background-color", "hsl(25, 100%, 63%)", "important");
        toggle.style.setProperty("border", "none", "important");
        toggle.style.setProperty("outline", "none", "important");
        toggle.style.setProperty("box-shadow", "none", "important");

        const toggleLink = toggle.querySelector<HTMLAnchorElement>("a");
        if (toggleLink) {
          toggleLink.style.width = `${anchorRect.width}px`;
          toggleLink.style.height = `${anchorRect.height}px`;
          toggleLink.style.display = "flex";
          toggleLink.style.alignItems = "center";
          toggleLink.style.justifyContent = "center";
          toggleLink.style.setProperty("background-color", "hsl(25, 100%, 63%)", "important");
          toggleLink.style.setProperty("border", "none", "important");
          toggleLink.style.setProperty("outline", "none", "important");
        }

        // Reapply color after a short delay to override any external CSS
        setTimeout(() => {
          applySwitcherColor();
        }, 100);
      }

      const wrapper = container.querySelector<HTMLElement>(
        ".df-switch-tabs-wrapper"
      );
      if (wrapper) {
        wrapper.style.position = "fixed";
        wrapper.style.left = "0px";
        wrapper.style.top = `${anchorRect.top + anchorRect.height}px`;
        wrapper.style.width = "100vw";
        wrapper.style.maxWidth = "100vw";
        wrapper.style.pointerEvents = "auto";
        wrapper.style.zIndex = "70";
        // Ensure dropdown is visible and properly sized on mobile
        if (window.innerWidth <= 1200) {
          wrapper.style.maxHeight = "calc(100vh - " + (anchorRect.top + anchorRect.height) + "px)";
          wrapper.style.overflowY = "auto";
          wrapper.style.display = wrapper.classList.contains("active") ? "block" : "none";
        } else {
          wrapper.style.display = "";
        }
      }
    };

    const handleViewportChange = () => updatePosition();

    const loadGlobalSwitcher = async () => {
      try {
        const response = await fetch(GLOBAL_SWITCHER_ENDPOINT, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to load global switcher: ${response.status}`);
        }

        const data: { html?: string } = await response.json();

        if (!mounted || !data?.html) {
          return;
        }

        removeExistingSwitcher();

        const container = document.createElement("div");
        container.setAttribute("data-global-switcher", "true");
        container.innerHTML = data.html;

        document.body.appendChild(container);
        switcherContainerRef.current = container;

        appendScripts(container);
        updatePosition();

        // Override the overlay class addition to prevent blur on switcher
        document.body.classList.add = function (...tokens: string[]) {
          if (tokens.includes('profile-icon-overlay')) {
            // Don't add the overlay class - it causes blur on switcher
            return;
          }
          return originalBodyClassListAdd.apply(this, tokens);
        };

        // Watch for overlay class being added and remove it immediately
        overlayObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              if (document.body.classList.contains('profile-icon-overlay')) {
                document.body.classList.remove('profile-icon-overlay');
              }
            }
          });
        });
        overlayObserver.observe(document.body, {
          attributes: true,
          attributeFilter: ['class']
        });

        // Inject fallback script in case main script doesn't load
        injectFallbackScript();

        // Add CSS override style
        const styleId = "global-switcher-color-override";
        if (!document.getElementById(styleId)) {
          const style = document.createElement("style");
          style.id = styleId;
          style.textContent = `
            .globalswitcher,
            .globalswitcher a {
              background-color: hsl(25, 100%, 63%) !important;
              border: none !important;
              outline: none !important;
            }
            .globalswitcher {
              position: fixed !important;
              z-index: 60 !important;
              border: none !important;
              box-shadow: none !important;
            }
            .globalswitcher * {
              border: none !important;
            }
            .df-switch-tabs-wrapper {
              z-index: 70 !important;
              position: fixed !important;
            }
            /* Ensure wrapper and all children are visible when active */
            .df-switch-tabs-wrapper.active {
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
            }
            .df-switch-tabs-wrapper.active .df-switch-wrapper {
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
            }
            /* Mobile visibility and responsiveness */
            @media (max-width: 1200px) {
              .globalswitcher {
                display: flex !important;
                visibility: visible !important;
                position: fixed !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
              }
              .globalswitcher a {
                display: flex !important;
                width: 100% !important;
                height: 100% !important;
                border: none !important;
                outline: none !important;
              }
              .df-switch-tabs-wrapper {
                position: fixed !important;
                left: 0 !important;
                right: 0 !important;
                top: 64px !important;
                width: 100vw !important;
                max-width: 100vw !important;
                display: none !important;
                height: auto !important;
                min-height: 0 !important;
              }
              .df-switch-tabs-wrapper.active {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                transform: none !important;
                height: auto !important;
                min-height: 100px !important;
                max-height: calc(100vh - 64px) !important;
                overflow-y: auto !important;
              }
              /* Reset absolute positioning that collapses height */
              .df-switch-tabs-wrapper .df-switch-wrapper {
                position: relative !important;
                width: 100% !important;
                max-width: 100% !important;
                display: flex !important;
                flex-direction: column !important;
                visibility: visible !important;
                height: auto !important;
              }
              .df-switch-tabs-wrapper .df-switch-tabs {
                position: relative !important;
                height: auto !important;
                flex-wrap: wrap !important;
              }
              .df-switch-tabs-wrapper.active .df-switch-wrapper {
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
              }
              .df-switch-tabs-wrapper.active .df-switch-tabs,
              .df-switch-tabs-wrapper.active .df-switch-tab,
              .df-switch-tabs-wrapper.active .nav-item,
              .df-switch-tabs-wrapper.active .nav-link {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                height: auto !important;
              }
              .df-switch-tabs-wrapper.active * {
                visibility: visible !important;
                opacity: 1 !important;
              }
            }
            [data-global-switcher="true"],
            [data-global-switcher="true"] *,
            .globalswitcher,
            .globalswitcher *,
            .df-switch-tabs-wrapper,
            .df-switch-tabs-wrapper * {
              filter: none !important;
              backdrop-filter: none !important;
              -webkit-backdrop-filter: none !important;
            }
            .globalswitcher,
            .globalswitcher *,
            .globalswitcher a,
            .globalswitcher a * {
              border: none !important;
              outline: none !important;
              box-shadow: none !important;
            }
            body.profile-icon-overlay [data-global-switcher="true"],
            body.profile-icon-overlay .globalswitcher,
            body.profile-icon-overlay .df-switch-tabs-wrapper,
            body.profile-icon-overlay [data-global-switcher="true"] *,
            body.profile-icon-overlay .globalswitcher *,
            body.profile-icon-overlay .df-switch-tabs-wrapper * {
              filter: none !important;
              backdrop-filter: none !important;
              -webkit-backdrop-filter: none !important;
            }
            /* Prevent any blur from navbar affecting switcher */
            nav[class*="backdrop-blur"] ~ [data-global-switcher="true"],
            nav[class*="backdrop-blur"] ~ [data-global-switcher="true"] * {
              filter: none !important;
              backdrop-filter: none !important;
              -webkit-backdrop-filter: none !important;
            }
          `;
          document.head.appendChild(style);
        }

        // Apply color after scripts execute
        setTimeout(() => {
          applySwitcherColor();
          updatePosition();
        }, 200);

        window.addEventListener("resize", handleViewportChange);
        window.addEventListener("scroll", handleViewportChange, { passive: true });
        // Mobile orientation change
        handleOrientationChange = () => {
          setTimeout(handleViewportChange, 100);
        };
        window.addEventListener("orientationchange", handleOrientationChange);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to initialize global switcher", error);
        }
      }
    };

    loadGlobalSwitcher();

    return () => {
      mounted = false;
      controller.abort();

      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange);
      if (handleOrientationChange) {
        window.removeEventListener("orientationchange", handleOrientationChange);
      }

      if (switcherContainerRef.current?.parentNode) {
        switcherContainerRef.current.parentNode.removeChild(
          switcherContainerRef.current
        );
        switcherContainerRef.current = null;
      }

      // Remove fallback script
      const fallbackScript = document.getElementById("global-switcher-fallback-script");
      if (fallbackScript?.parentNode) {
        fallbackScript.parentNode.removeChild(fallbackScript);
      }

      // Disconnect overlay observer
      if (overlayObserver) {
        overlayObserver.disconnect();
      }

      // Restore original classList.add
      document.body.classList.add = originalBodyClassListAdd;

      document.body.classList.remove("profile-icon-overlay");
    };
  }, []);

  const handleNavigation = (path: string) => {
    setLocation(path);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "Ideas", path: "/ideas" },
    { label: "Projects", path: "/projects" },
    { label: "Workflow", path: "/workflow" },
    { label: "Blog", path: "/blog" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "backdrop-blur-xl border-b border-[#B620E0]/30"
        : ""
        }`}
      style={{
        background: "#311B50"
      }}
    >
      <div
        ref={switcherMountRef}
        className="absolute left-0 top-0 z-50 w-16 h-16 md:w-20 md:h-20"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => handleNavigation("/")}
            className="flex items-center space-x-3 ml-16 md:ml-20"
            data-testid="button-logo"
          >
            <div className="flex items-center gap-2">
              <img src={logoMono} alt="DEEP" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
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
                  color: "#FFFFFF",
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
              onClick={() => handleNavigation("/submit-idea")}
              data-testid="button-submit-idea"
              className="bg-gradient-to-r from-chart-1 to-chart-2 text-white border-0 hover:opacity-90 transition-opacity"
            >
              Submit an Idea
            </Button>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className={`md:hidden hover:bg-white/20 ${theme === 'dark'
              ? 'text-white hover:text-white'
              : 'text-gray-800 hover:text-gray-900'
              }`}
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
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
              background: "#311B50"
            }}
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavigation(link.path)}
                  className="block w-full text-left px-4 py-3 text-sm font-medium hover:bg-white/20 rounded-md transition-colors text-white hover:text-white"
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
                onClick={() => handleNavigation("/submit-idea")}
                className="w-full bg-gradient-to-r from-chart-1 to-chart-2 text-white border-0 hover:opacity-90 transition-opacity"
                data-testid="button-mobile-submit-idea"
              >
                Submit Idea
              </Button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

