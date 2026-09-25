import React, { useState } from "react";
import { Sparkles, Menu, X, ArrowRight, Compass } from "lucide-react";

interface NavbarProps {
  activeTab: "home" | "analyze" | "how-it-works" | "dashboard";
  setActiveTab: (tab: "home" | "analyze" | "how-it-works" | "dashboard") => void;
  hasReport: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, hasReport }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: "home" | "analyze" | "how-it-works" | "dashboard"; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "how-it-works", label: "How It Works" },
    { id: "analyze", label: "Analyze" },
    ...(hasReport ? [{ id: "dashboard" as const, label: "Dashboard" }] : []),
  ];

  const handleNavClick = (id: "home" | "analyze" | "how-it-works" | "dashboard") => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <div 
          id="nav-brand-logo"
          onClick={() => handleNavClick("home")}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
            <Compass className="w-4 h-4 text-white group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-neutral-950 font-heading">
                Resume <span className="text-black underline decoration-1 underline-offset-4 decoration-neutral-300">Analyzer</span>
              </span>
              <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                AI
              </span>
            </div>
            <span className="text-[11px] text-neutral-500 tracking-wide hidden sm:inline">
              Career Gap & Roadmap Engine
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-neutral-100/80 p-1 rounded-full border border-neutral-200/80">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white text-black shadow-sm font-semibold border border-neutral-200/60"
                    : "text-neutral-600 hover:text-black hover:bg-white/50"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Button & Indicators */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            id="nav-analyze-cta-btn"
            onClick={() => handleNavClick("analyze")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-black text-white hover:bg-neutral-800 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Analyze Resume</span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-300" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-neutral-100 text-neutral-700 hover:text-black border border-neutral-200 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`mobile-nav-link-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === item.id
                  ? "bg-neutral-100 text-black border border-neutral-300 font-semibold"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-black"
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2">
            <button
              id="mobile-nav-analyze-cta"
              onClick={() => handleNavClick("analyze")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-black text-white hover:bg-neutral-800"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze My Resume</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
