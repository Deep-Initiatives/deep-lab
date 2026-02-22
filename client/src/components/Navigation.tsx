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
          }

          function closeSwitcher() {
            switcherWrapper?.classList.remove("active");
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

        // Deep-lab specific: move active state from Funding to Lab
        const fundingBtn = container.querySelector('.funding-switch-tab');
        const labBtn = container.querySelector('.lab-switch-tab');
        if (fundingBtn) fundingBtn.classList.remove('active');
        if (labBtn) {
          labBtn.classList.add('active');
          labBtn.removeAttribute('disabled');
        }

        // Insert Back button at top of switcher wrapper
        const switcherWrapper = container.querySelector('.df-switch-tabs-wrapper');
        if (switcherWrapper && !switcherWrapper.querySelector('.switcher-back-btn')) {
          const backBtn = document.createElement('button');
          backBtn.className = 'switcher-back-btn';
          backBtn.innerHTML = '&#10094; Back';
          backBtn.addEventListener('click', () => {
            switcherWrapper.classList.remove('active');
          });
          switcherWrapper.insertBefore(backBtn, switcherWrapper.firstChild);
        }

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
              /* Back button */
              .switcher-back-btn {
                display: none;
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
            /* Mobile full-screen switcher - matches deep-projects.ai */
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
              /* Wrapper: full-screen dark overlay below navbar */
              .df-switch-tabs-wrapper {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100vw !important;
                max-width: 100vw !important;
                height: 100vh !important;
                max-height: 100vh !important;
                display: none !important;
                background: #0D0620 !important;
                overflow-y: auto !important;
                z-index: 9999 !important;
                padding: 16px !important;
                padding-top: 0 !important;
                box-sizing: border-box !important;
              }
              .df-switch-tabs-wrapper.active {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
              }
              /* Back button - mobile only */
              .df-switch-tabs-wrapper .switcher-back-btn {
                display: flex !important;
                align-items: center !important;
                gap: 4px !important;
                background: none !important;
                border: none !important;
                color: #7F56D9 !important;
                font-family: "DM Sans", sans-serif !important;
                font-size: 16px !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                padding: 16px 0 12px !important;
                margin: 0 !important;
              }
              /* Inner wrapper: vertical flex layout */
              .df-switch-tabs-wrapper .df-switch-wrapper {
                position: relative !important;
                width: 100% !important;
                max-width: 100% !important;
                display: flex !important;
                flex-direction: column !important;
                height: auto !important;
              }
              /* Tabs list: vertical stack */
              .df-switch-tabs-wrapper .df-switch-tabs {
                position: relative !important;
                display: flex !important;
                flex-direction: column !important;
                gap: 8px !important;
                padding: 0 !important;
                margin: 0 !important;
                width: 100% !important;
                height: auto !important;
                background: transparent !important;
                backdrop-filter: none !important;
                border: none !important;
                list-style: none !important;
              }
              /* Each tab card: full width */
              .df-switch-tabs-wrapper .df-switch-tab {
                width: 100% !important;
                display: block !important;
                height: auto !important;
              }
              .df-switch-tabs-wrapper .df-switch-tab a {
                display: block !important;
                text-decoration: none !important;
                width: 100% !important;
                padding: 0 !important;
                border: none !important;
              }
              .df-switch-tabs-wrapper .df-switch-tab button {
                width: 100% !important;
                border-radius: 12px !important;
                border: 1px solid #344054 !important;
                background: rgba(19, 7, 45, 0.9) !important;
                padding: 20px 16px !important;
                text-align: left !important;
                cursor: pointer !important;
                height: auto !important;
                display: block !important;
              }
              .df-switch-tabs-wrapper .df-switch-tab button .logo-text {
                color: #EAECF0 !important;
                font-family: Orbitron !important;
                font-size: 20px !important;
                font-weight: 700 !important;
                line-height: 20px !important;
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
                margin-bottom: 10px !important;
              }
              .df-switch-tabs-wrapper .df-switch-tab button p {
                color: #98A2B3 !important;
                font-family: "DM Sans", sans-serif !important;
                font-size: 14px !important;
                font-weight: 600 !important;
                line-height: 20px !important;
                text-align: left !important;
                margin: 0 !important;
              }
              .df-switch-tabs-wrapper .df-switch-tab button svg {
                width: 32px !important;
                height: 32px !important;
                flex-shrink: 0 !important;
              }
              /* Initiatives card gradient border */
              .df-switch-tabs-wrapper .init_switch_tab {
                border: 1px solid transparent !important;
                background: linear-gradient(#14082E, #14082E) padding-box,
                  linear-gradient(243deg, #32C5FF -11%, #B620E0 44%, #F7B500 107%) border-box !important;
                border-radius: 12px !important;
              }
              .df-switch-tabs-wrapper .init_switch_tab button {
                border: none !important;
                background: transparent !important;
              }
              /* Coming Soon badge */
              .df-switch-tabs-wrapper .coming-soon {
                font-size: 12px !important;
                padding: 4px 12px !important;
                border-radius: 60px !important;
                border: 1px solid #A39EB2 !important;
                background: rgba(255, 255, 255, 0.04) !important;
                color: #D2D0D7 !important;
                font-family: "DM Sans", sans-serif !important;
                font-weight: 600 !important;
                line-height: 20px !important;
                display: inline-flex !important;
                align-items: center !important;
              }
              /* Active/selected card */
              .df-switch-tabs-wrapper .df-switch-tab button.active {
                border: 1px solid #EAECF0 !important;
                background: #E9E7EC !important;
              }
              .df-switch-tabs-wrapper .df-switch-tab button.active .logo-text {
                color: #120B29 !important;
              }
              .df-switch-tabs-wrapper .df-switch-tab button.active p {
                color: #667085 !important;
              }
              /* Ensure all content visible */
              .df-switch-tabs-wrapper.active * {
                visibility: visible !important;
                opacity: 1 !important;
              }
              /* Deep initiative left panel hidden on mobile */
              .df-switch-tabs-wrapper .deep-initiative-left {
                display: none !important;
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

