import logoMono from "@assets/logo.svg";
import { useLocation } from "wouter";

export function Footer() {
  const [location, setLocation] = useLocation();
  
  const scrollToSection = (id: string) => {
    // If not on homepage, navigate there first, then scroll
    if (location !== "/") {
      setLocation("/");
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // Already on homepage, just scroll
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="relative bg-background border-t border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-chart-1/5 via-chart-2/5 to-chart-3/5 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logoMono} alt="DEEP" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
              <span style={{ color: 'inherit', fontFamily: 'Orbitron', fontSize: 24, fontStyle: 'normal', fontWeight: 700, lineHeight: '20px', display: 'flex', alignItems: 'center' as const }}>Lab</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Where innovation takes flight. Building the future of AI, one prototype at a
              time.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Home", id: "hero" },
                { label: "Projects", id: "projects" },
                { label: "Pods", id: "pods" },
                { label: "Journey", id: "journey" },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-footer-${link.id}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="/ideas"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-ideas"
                >
                  View All Ideas
                </a>
              </li>
              <li>
                <a
                  href="/workflow"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-workflow"
                >
                  Workflow Overview
                </a>
              </li>
              <li>
                <a
                  href="https://deepfunding.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-deepfunding"
                >
                  Deep Funding
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2.5">
              <li className="text-sm text-muted-foreground">
                Email: contact@deep-lab.ai
              </li>
              <li>
                <a
                  href="/submit-idea"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-submit"
                >
                  Submit an Idea
                </a>
              </li>
              <li>
                <a
                  href="/join-team"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-join"
                >
                  Join the Team
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Deep Lab. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://deepfunding.ai/terms/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-terms"
                >
                  Terms & Conditions
                </a>
                <a
                  href="https://deepfunding.ai/privacy-policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-privacy"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Powered by innovation since June 2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}