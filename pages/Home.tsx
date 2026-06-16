import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Zap,
  BarChart3,
  Bot,
  ChevronRight,
  Lock,
  Target,
  Search,
} from "lucide-react";
import { Logo } from "../components/Logo";

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
}> = ({ icon, title, desc }) => (
  <div className="glass p-8 rounded-2xl hover:border-neon-cyan transition-all duration-300 group hover:-translate-y-2">
    <div className="bg-neon-cyan/10 w-14 h-14 rounded-xl flex items-center justify-center text-neon-cyan mb-6 group-hover:bg-neon-cyan group-hover:text-navy-900 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export const Home: React.FC = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-neon-cyan rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative ">
          <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-bold tracking-widest uppercase">
              <Zap size={14} /> Next Gen Web Protection
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-6xl mx-auto">
              Secure Your Web
              <br />
              Infrastructure with{" "}
              <span className="text-neon-cyan neon-text whitespace-nowrap">
                Black Cat
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Automated security scans targeting common vulnerabilities like
              XSS, SQL Injection, and Auth weaknesses. AI-powered insights for
              smarter decisions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 ">
              <Link
                to="/scan"
                className="w-full sm:w-auto px-8 py-4 bg-neon-cyan text-navy-900 rounded-xl font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                Start Free Scan <ChevronRight size={20} />
              </Link>
            </div>

            {/* Trusted Logos */}
            <div className=" space-y-5 pt-5">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500 font-black">
                Trusted by engineers from
              </p>

              <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 hover:opacity-100 transition-all duration-500">
                {[
                  {
                    name: "Google",
                    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
                  },
                  {
                    name: "Meta",
                    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png",
                  },
                  {
                    name: "Pinterest",
                    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png",
                  },
                  {
                    name: "Amazon",
                    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
                  },
                  {
                    name: "Netflix",
                    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
                  },
                  {
                    name: "Microsoft",
                    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
                  },
                ].map((company) => (
                  <div
                    key={company.name}
                    className="
                    h-14
                    px-6
                    flex
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-navy-800
                    bg-white/[0.02]
                    hover:border-neon-cyan/40
                    hover:bg-neon-cyan/5
                    hover:scale-105
                    transition-all
                  "
                  >
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-6 object-contain transition-all duration-300"                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {[
                "TRUSTED BY FORBES",
                "ISO 27001",
                "SOC2 COMPLIANT",
                "G2 LEADER",
              ].map((t) => (
                <div
                  key={t}
                  className="text-xs font-black tracking-widest border border-navy-800 py-3 rounded-lg"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-navy-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Full-Stack Security Suite
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Everything you need to monitor, detect, and fix vulnerabilities
              before they can be exploited.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Search size={28} />}
              title="Automated Scanner"
              desc="Deep crawl engine detecting XSS, SQLi, and misconfigurations with zero false positives."
            />
            <FeatureCard
              icon={<BarChart3 size={28} />}
              title="Analytics Dashboard"
              desc="Interactive visual data representations for real-time risk assessment and trend monitoring."
            />
            <FeatureCard
              icon={<Zap size={28} />}
              title="AI Reports"
              desc="Intelligent, context-aware summaries generated by Gemini to turn complexity into clarity."
            />
            <FeatureCard
              icon={<Bot size={28} />}
              title="24/7 AI Chatbot"
              desc="Expert-level security assistance integrated directly into your workflow for instant support."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-2">
              <div className="text-5xl font-extrabold text-neon-cyan neon-text">
                10M+
              </div>
              <div className="text-slate-400 font-medium">Scans Performed</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-extrabold text-neon-cyan neon-text">
                99.9%
              </div>
              <div className="text-slate-400 font-medium">
                Detection Accuracy
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-extrabold text-neon-cyan neon-text">
                50ms
              </div>
              <div className="text-slate-400 font-medium">Alert Latency</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {/* <section className="py-32">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="glass p-12 md:p-20 rounded-[40px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to secure your future?
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Join 50,000+ developers protecting their applications with the
                most advanced security scanner on the market.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  to="/register"
                  className="px-10 py-5 bg-neon-cyan text-navy-900 rounded-2xl font-black text-xl hover:scale-105 transition-all"
                >
                  Create Account Now
                </Link>
                <Link
                  to="/contact"
                  className="px-10 py-5 border border-navy-700 text-white rounded-2xl font-black text-xl hover:bg-navy-800 transition-all"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="py-2 border-t border-navy-800 text-center">
        <p className="text-slate-500 text-sm">
          © 2026 Black Cat Security. Built for hackers by defenders.
        </p>
      </footer>
    </div>
  );
};
