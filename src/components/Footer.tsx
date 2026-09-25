import React from "react";
import { Compass, ShieldCheck } from "lucide-react";

interface FooterProps {
  onNavClick: (tab: "home" | "analyze" | "how-it-works" | "dashboard") => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer className="border-t border-neutral-200 bg-white text-neutral-600 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-200">
          
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white shadow-xs">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-neutral-950 font-heading tracking-tight">
                Resume <span className="underline decoration-2 underline-offset-4">Analyzer</span>
              </span>
            </div>

            <p className="text-lg text-neutral-900 font-heading font-semibold">
              Turn your resume into a roadmap.
            </p>

            <p className="text-xs text-neutral-600 max-w-md leading-relaxed">
              Objective AI analysis and structural gap detection designed for students and job seekers aspiring to join leading engineering teams.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-950">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavClick("home")}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavClick("how-it-works")}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavClick("analyze")}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Analyze Resume
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Resources */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-950">
              Trust & Safety
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-black transition-colors cursor-pointer">About Methodology</li>
              <li className="hover:text-black transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-black transition-colors cursor-pointer">Terms of Service</li>
              <li className="hover:text-black transition-colors cursor-pointer">Security Practices</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with Mandatory Transparency Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2 text-left">
            <ShieldCheck className="w-4 h-4 text-black flex-shrink-0" />
            <p>
              <strong>Disclaimer:</strong> AI-generated recommendations are informational and should be verified against current job descriptions and official company information.
            </p>
          </div>
          <div className="font-mono text-[11px] whitespace-nowrap text-neutral-500">
            © {new Date().getFullYear()} Resume Analyzer. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};
