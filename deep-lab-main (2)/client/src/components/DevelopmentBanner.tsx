import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function DevelopmentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem("devBannerDismissed");
    if (!dismissed) {
      // Show banner after a short delay
      setTimeout(() => setIsVisible(true), 500);
    } else {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("devBannerDismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[100] transition-transform duration-500 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="font-semibold text-sm md:text-base">
                🚧 Site Under Development
              </span>
            </div>
            <span className="hidden md:inline text-sm text-white/90">
              This site is currently being developed. Some features may not work as expected.
            </span>
          </div>
          <button
            onClick={handleDismiss}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}


