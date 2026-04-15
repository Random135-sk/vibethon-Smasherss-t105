// pages/Home.jsx — Landing page with hero, features & stats
import { Link } from "react-router-dom";

/* ── Data ─────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: "◈",
    title: "Learn",
    subtitle: "Structured Curriculum",
    desc: "Progressive modules covering ML, Deep Learning, NLP, and Computer Vision — from fundamentals to advanced.",
    color: "cyan",
    to: "/dashboard",
    gradient: "from-[#00d4ff]/20 to-[#00d4ff]/0",
    border: "border-[#00d4ff]/20 hover:border-[#00d4ff]/50",
    glow: "hover:shadow-[0_0_30px_rgba(0,212,255,0.15)]",
    tag: "tag-cyan",
    tagLabel: "12 Modules",
  },
  {
    icon: "⌨",
    title: "Practice",
    subtitle: "Coding Playground",
    desc: "Write, run and experiment with ML code right in your browser. No setup required — just code and learn.",
    color: "purple",
    to: "/playground",
    gradient: "from-[#8b5cf6]/20 to-[#8b5cf6]/0",
    border: "border-[#8b5cf6]/20 hover:border-[#8b5cf6]/50",
    glow: "hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]",
    tag: "tag-purple",
    tagLabel: "Live Editor",
  },
  {
    icon: "◎",
    title: "Play",
    subtitle: "Mini Games",
    desc: "Reinforce concepts through interactive games — classify data points, tune neural networks, race gradients.",
    color: "coral",
    to: "/games",
    gradient: "from-[#ff6b35]/20 to-[#ff6b35]/0",
    border: "border-[#ff6b35]/20 hover:border-[#ff6b35]/50",
    glow: "hover:shadow-[0_0_30px_rgba(255,107,53,0.15)]",
    tag: "tag-coral",
    tagLabel: "6 Games",
  },
  {
    icon: "∿",
    title: "Simulate",
    subtitle: "Real-world Models",
    desc: "Interact with live ML models — predict house prices, classify sentiment, visualize decision boundaries.",
    color: "green",
    to: "/simulate",
    gradient: "from-[#10f5a0]/20 to-[#10f5a0]/0",
    border: "border-[#10f5a0]/20 hover:border-[#10f5a0]/50",
    glow: "hover:shadow-[0_0_30px_rgba(16,245,160,0.15)]",
    tag: "tag-green",
    tagLabel: "3 Demos",
  },
];

const STATS = [
  { value: "50+", label: "Learning Topics", icon: "◈" },
  { value: "200+", label: "Practice Problems", icon: "⌨" },
  { value: "6",   label: "Mini Games",         icon: "◎" },
  { value: "3",   label: "Live Simulations",   icon: "∿" },
];

const TOPICS_PREVIEW = [
  { name: "Machine Learning", icon: "⊕", color: "#00d4ff" },
  { name: "Deep Learning",    icon: "⊗", color: "#8b5cf6" },
  { name: "NLP",              icon: "⊘", color: "#ff6b35" },
  { name: "Computer Vision",  icon: "⊙", color: "#10f5a0" },
  { name: "Reinforcement Learning", icon: "⊚", color: "#fbbf24" },
  { name: "Data Preprocessing",     icon: "⊛", color: "#e879f9" },
];

/* ── Component ─────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="relative">
      {/* ── Hero Section ──────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background layers */}
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -5%, rgba(0,212,255,0.22) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 85% 60%, rgba(139,92,246,0.18) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 10% 70%, rgba(255,107,53,0.1) 0%, transparent 50%)",
          }}
        />

        {/* Floating orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 animate-float"
          style={{
            background: "radial-gradient(circle, #00d4ff 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 animate-float"
          style={{
            background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
            filter: "blur(50px)",
            animationDelay: "-3s",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00d4ff]/20 bg-[#00d4ff]/5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10f5a0] animate-pulse" />
            <span className="text-xs text-[#00d4ff]" style={{ fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.15em" }}>
              ALL-IN-ONE AI/ML LEARNING PLATFORM
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl lg:text-8xl font-extrabold leading-none mb-6"
            style={{ fontFamily: "Syne, sans-serif", letterSpacing: "-0.03em" }}
          >
            <span className="block text-slate-100">Master AI & ML</span>
            <span className="block gradient-text">From Zero to Hero</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Learn interactively. Practice with real code. Play concept games. Run live simulations.
            <br className="hidden sm:block" />
            Everything you need to go from beginner to practitioner.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard" className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto">
              <span>Start Learning →</span>
            </Link>
            <Link to="/playground" className="btn-secondary text-base px-8 py-3.5 w-full sm:w-auto">
              Try Playground
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 text-slate-500 text-sm">
            {STATS.map(({ value, label, icon }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-[#00d4ff]">{icon}</span>
                <span className="font-bold text-slate-300" style={{ fontFamily: "Syne, sans-serif" }}>{value}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050810] to-transparent" />
      </section>

      {/* ── Features Section ────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-3">// WHAT YOU GET</p>
          <h2
            className="text-4xl sm:text-5xl font-bold text-slate-100"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Everything in one place
          </h2>
          <p className="text-slate-400 mt-4 text-lg max-w-xl mx-auto">
            Four pillars of learning — structured to take you from concept to application.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon, title, subtitle, desc, gradient, border, glow, tag, tagLabel, to }) => (
            <Link
              key={title}
              to={to}
              className={`glass-card rounded-2xl p-6 flex flex-col gap-4 border transition-all duration-300 group cursor-pointer ${border} ${glow}`}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${gradient} border ${border} transition-transform duration-300 group-hover:scale-110`}
              >
                {icon}
              </div>

              {/* Badge */}
              <span className={`tag ${tag} self-start`}>{tagLabel}</span>

              {/* Text */}
              <div>
                <h3
                  className="text-xl font-bold text-slate-100 mb-1"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {title}
                </h3>
                <p className="text-xs text-slate-500 mb-2" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                  {subtitle}
                </p>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>

              {/* Arrow */}
              <div className="mt-auto flex items-center gap-1 text-xs text-slate-500 group-hover:text-[#00d4ff] transition-colors duration-200">
                <span>Explore</span>
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Topics Preview ───────────────────────────────── */}
      <section
        className="py-20 px-4 sm:px-6"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="section-label mb-3">// CURRICULUM</p>
              <h2
                className="text-3xl sm:text-4xl font-bold text-slate-100"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                Explore Learning Tracks
              </h2>
            </div>
            <Link
              to="/dashboard"
              className="text-sm text-[#00d4ff] hover:text-white transition-colors flex items-center gap-1"
            >
              View all topics <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {TOPICS_PREVIEW.map(({ name, icon, color }) => (
              <Link
                key={name}
                to="/dashboard"
                className="glass-card rounded-xl p-4 flex flex-col items-center gap-3 text-center group hover:scale-105 transition-transform duration-200"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                >
                  <span style={{ color }}>{icon}</span>
                </div>
                <span className="text-xs text-slate-300 font-medium group-hover:text-white transition-colors">
                  {name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="relative rounded-3xl overflow-hidden p-12 sm:p-16"
            style={{
              background: "linear-gradient(135deg, rgba(0,212,255,0.12) 0%, rgba(139,92,246,0.12) 100%)",
              border: "1px solid rgba(0,212,255,0.2)",
            }}
          >
            {/* Inner glow */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,212,255,0.2) 0%, transparent 60%)",
              }}
            />
            <div className="relative z-10">
              <h2
                className="text-4xl sm:text-5xl font-extrabold text-slate-100 mb-4"
                style={{ fontFamily: "Syne, sans-serif", letterSpacing: "-0.02em" }}
              >
                Ready to build your{" "}
                <span className="gradient-text">AI future?</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
                Join thousands of learners mastering AI/ML with hands-on, interactive learning.
              </p>
              <Link to="/dashboard" className="btn-primary text-base px-10 py-3.5 inline-block">
                <span>Begin Your Journey →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
