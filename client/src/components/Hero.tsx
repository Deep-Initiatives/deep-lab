import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Rocket, Zap, Code } from "lucide-react";

interface HeroProps {
  stats: {
    totalApps: number;
    activePods: number;
    teamMembers: number;
    monthsSinceInception: number;
  };
}

export function Hero({ stats }: HeroProps) {
  const [displayStats, setDisplayStats] = useState({
    totalApps: 0,
    activePods: 0,
    teamMembers: 0,
    monthsSinceInception: 0,
  });

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setDisplayStats({
        totalApps: Math.floor(stats.totalApps * progress),
        activePods: Math.floor(stats.activePods * progress),
        teamMembers: Math.floor(stats.teamMembers * progress),
        monthsSinceInception: Math.floor(stats.monthsSinceInception * progress),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setDisplayStats(stats);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [stats]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-chart-1 via-chart-2 to-chart-3 animate-gradient-flow bg-300%" />
      
      {/* Animated Overlay Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 0%, transparent 50%),
                           radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          backgroundSize: '100% 100%',
          animation: 'pulse 8s ease-in-out infinite'
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-32 md:py-40 text-center">
        
        {/* Badge */}
        <div className="mb-8 animate-fade-in-up flex justify-center">
          <Badge className="px-6 py-3 text-base bg-white/15 backdrop-blur-xl border-white/30 text-white hover:bg-white/20 transition-all shadow-2xl">
            <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
            5+ Apps Prototyped Since June 2025
          </Badge>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-tight animate-fade-in-up">
          <span className="inline-block animate-slide-up">Where Innovation</span>
          <br />
          <span className="inline-block bg-gradient-to-r from-white via-white/80 to-white bg-clip-text text-transparent drop-shadow-2xl animate-slide-up-delayed">
            Takes Flight
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-2xl text-white/95 max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in-up font-light px-4">
          Deep Lab is an <span className="font-semibold">AI and development lab</span> pushing the boundaries of innovation.
          We prototype, MVP, and deploy <span className="font-semibold">cutting-edge AI agents, web applications, and services</span> at lightning speed.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in-up">
          <Button
            size="lg"
            onClick={() => scrollToSection("projects")}
            className="group bg-white text-chart-2 hover:bg-white/95 font-bold px-10 py-7 text-lg border-0 shadow-2xl hover:shadow-white/50 transition-all hover:scale-105 rounded-full"
            data-testid="button-view-projects"
          >
            View Projects
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollToSection("join")}
            className="backdrop-blur-xl bg-white/10 text-white border-2 border-white/40 hover:bg-white/20 hover:border-white/60 font-bold px-10 py-7 text-lg shadow-2xl transition-all hover:scale-105 rounded-full"
            data-testid="button-join-us"
          >
            Join Our Team
          </Button>
        </div>

        {/* Stats Grid - Enhanced */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto animate-fade-in-up">
          {[
            { 
              label: "Apps Built", 
              value: displayStats.totalApps, 
              suffix: "+",
              icon: Code,
              color: "from-orange-400 to-pink-400"
            },
            { 
              label: "Active Pods", 
              value: displayStats.activePods, 
              suffix: "",
              icon: Zap,
              color: "from-pink-400 to-purple-400"
            },
            { 
              label: "Team Members", 
              value: displayStats.teamMembers, 
              suffix: "+",
              icon: Sparkles,
              color: "from-purple-400 to-blue-400"
            },
            { 
              label: "Months Running", 
              value: displayStats.monthsSinceInception, 
              suffix: "",
              icon: Rocket,
              color: "from-blue-400 to-teal-400"
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative backdrop-blur-xl bg-white/10 hover:bg-white/15 border-2 border-white/30 hover:border-white/50 rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-2xl animate-count-up"
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Glow on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300 blur-xl`} />
                
                <div className="relative flex items-center gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  {/* Value and Label */}
                  <div className="flex-1 text-left">
                    <div className="text-5xl md:text-6xl font-black text-white mb-1 drop-shadow-lg tracking-tight">
                      {stat.value}
                      {stat.suffix}
                    </div>
                    <div className="text-sm md:text-base text-white/95 font-semibold tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-scroll" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(30px) translateX(-20px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up-delayed {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(8px); opacity: 0; }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        .animate-slide-up-delayed {
          animation: slide-up-delayed 1s ease-out forwards;
        }
        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }
        .bg-300\\% {
          background-size: 300% 300%;
        }
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-flow {
          animation: gradient-flow 15s ease infinite;
        }
      `}</style>
    </section>
  );
}
