import React, { useState } from "react";
import { Sparkles, Menu, X, ArrowRight, ShieldCheck, Compass } from "lucide-react";

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
    <header className="sticky top-0 z-40 w-full border-b border-[#D4AF37]/20 bg-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <div 
          id="nav-brand-logo"
          onClick={() => handleNavClick("home")}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#F5D061] to-[#996515] p-[1.5px] shadow-lg shadow-[#D4AF37]/15 group-hover:shadow-[#D4AF37]/30 transition-all">
            <div className="w-full h-full bg-[#0A0A0A] rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-[#D4AF37] group-hover:rotate-45 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-[#FAF9F6] font-heading">
                Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5D061] via-[#E6CA65] to-[#D4AF37]">Analyzer</span>
              </span>
              <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-[#D4AF37]/15 text-[#F5D061] border border-[#D4AF37]/30">
                AI
              </span>
            </div>
            <span className="text-[11px] text-[#A1A1AA] tracking-wide hidden sm:inline">
              Career Gap & Roadmap Engine
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-black/70 px-3 py-1.5 rounded-full border border-[#D4AF37]/25 shadow-inner shadow-black">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-[#D4AF37]/15 text-[#F5D061] border border-[#D4AF37]/40 shadow-sm shadow-[#D4AF37]/10"
                    : "text-[#A1A1AA] hover:text-[#F5D061] hover:bg-white/[0.04]"
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#B8860B] text-black shadow-md shadow-[#D4AF37]/20 hover:shadow-lg hover:shadow-[#D4AF37]/35 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Analyze Resume</span>
            <ArrowRight className="w-4 h-4 text-black/80" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-black/80 text-[#A1A1AA] hover:text-[#D4AF37] border border-[#D4AF37]/30"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#D4AF37]/20 bg-black/95 px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`mobile-nav-link-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === item.id
                  ? "bg-[#D4AF37]/15 text-[#F5D061] border border-[#D4AF37]/30 font-semibold"
                  : "text-[#A1A1AA] hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2">
            <button
              id="mobile-nav-analyze-cta"
              onClick={() => handleNavClick("analyze")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#B8860B] text-black"
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
