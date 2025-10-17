import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import logoImage from "@assets/logo.png";

export function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-background border-t border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-chart-1/5 via-chart-2/5 to-chart-3/5 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="Deep Lab" className="h-10" />
              <span className="text-foreground" style={{ fontFamily: 'Orbitron', fontWeight: 600, fontSize: '25px', lineHeight: '100%', letterSpacing: '0%' }}>Funding Lab</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Where innovation takes flight. Building the future of AI, one prototype at a
              time.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md hover-elevate transition-all"
                data-testid="link-social-github"
              >
                <Github className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md hover-elevate transition-all"
                data-testid="link-social-twitter"
              >
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md hover-elevate transition-all"
                data-testid="link-social-linkedin"
              >
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
              <a
                href="mailto:contact@deep-lab.ai"
                className="p-2 rounded-md hover-elevate transition-all"
                data-testid="link-social-email"
              >
                <Mail className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
            </div>
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
                  href="https://ramazo3.github.io/df_labs/ideas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-ideas"
                >
                  View All Ideas
                </a>
              </li>
              <li>
                <a
                  href="https://ramazo3.github.io/df_labs/workflow"
                  target="_blank"
                  rel="noopener noreferrer"
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
                  href="https://ramazo3.github.io/df_labs/submit-idea"
                  target="_blank"
                  rel="noopener noreferrer"
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
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Deep Lab. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Powered by innovation since June 2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}