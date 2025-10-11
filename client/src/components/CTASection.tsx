import { Button } from "@/components/ui/button";
import { ArrowRight, Lightbulb, Users } from "lucide-react";

export function CTASection() {
  return (
    <section id="join" className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-chart-1 via-chart-2 to-chart-3 opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Join the Innovation
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Be part of our journey to build the future of AI. Submit your ideas or join our
            talented team of developers and innovators.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-8 text-white">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white/20 mb-4">
              <Lightbulb className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Submit Your Idea</h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              Have a groundbreaking AI concept? Share it with us and we'll help bring it to
              life through our rapid prototyping process.
            </p>
            <Button
              size="lg"
              className="w-full bg-white text-chart-2 hover:bg-white/90 border-0 font-semibold"
              asChild
              data-testid="button-submit-idea"
            >
              <a
                href="https://ramazo3.github.io/df_labs/submit-idea"
                target="_blank"
                rel="noopener noreferrer"
              >
                Submit Idea
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>

          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-8 text-white">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white/20 mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Join Our Team</h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              Are you a developer, data analyst, or ML/AI specialist? Join our active pods
              and contribute to rapid prototyping of cutting-edge solutions.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="w-full backdrop-blur-md bg-white/10 text-white border-white/30 hover:bg-white/20 font-semibold"
              asChild
              data-testid="button-join-team-form"
            >
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdUJnEPRzkyb0OJJBYVzBWCvc5TknsNmtLZvf4dwVTmnadIqA/viewform"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
