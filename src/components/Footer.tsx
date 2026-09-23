import React from "react";
import { Compass, ShieldCheck } from "lucide-react";

interface FooterProps {
  onNavClick: (tab: "home" | "analyze" | "how-it-works" | "dashboard") => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer className="border-t border-[#D4AF37]/20 bg-black text-[#A1A1AA] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#D4AF37]/15">
          
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-black shadow-md shadow-[#D4AF37]/20">
                <Compass className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-bold text-white font-heading">
                Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5D061] to-[#D4AF37]">Analyzer</span> AI
              </span>
            </div>

            <p className="text-lg text-white font-heading font-semibold">
              Turn your resume into a roadmap.
            </p>

            <p className="text-xs text-[#A1A1AA] max-w-md leading-relaxed">
              Objective AI analysis and structural gap detection designed for students and job seekers aspiring to join leading engineering teams.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5D061]">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavClick("home")}
                  className="hover:text-[#F5D061] transition-colors"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick("how-it-works")}
                  className="hover:text-[#F5D061] transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick("analyze")}
                  className="hover:text-[#F5D061] transition-colors"
                >
                  Analyze Resume
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Resources */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5D061]">
              Trust & Safety
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-[#F5D061] transition-colors cursor-pointer">About Methodology</li>
              <li className="hover:text-[#F5D061] transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-[#F5D061] transition-colors cursor-pointer">Terms of Service</li>
              <li className="hover:text-[#F5D061] transition-colors cursor-pointer">Security Practices</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with Mandatory Transparency Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
          <div className="flex items-center gap-2 text-left">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
            <p>
              <strong>Disclaimer:</strong> AI-generated recommendations are informational and should be verified against current job descriptions and official company information.
            </p>
          </div>
          <div className="font-mono text-[11px] whitespace-nowrap text-[#71717A]">
            © {new Date().getFullYear()} ResumeLens AI. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};
