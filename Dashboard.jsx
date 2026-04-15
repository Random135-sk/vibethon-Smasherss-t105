// pages/Dashboard.jsx — Learning topics with progress tracking
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";

/* ── Topic Data ─────────────────────────────────────────── */
const TOPICS = [
  {
    id: "ml",
    category: "Core",
    title: "Machine Learning Basics",
    subtitle: "Supervised, Unsupervised & Evaluation",
    icon: "⊕",
    color: "#00d4ff",
    progress: 72,
    lessons: 14,
    duration: "6h",
    level: "Beginner",
    tags: ["Regression", "Classification", "Clustering"],
    desc: "Understand how machines learn from data — from linear regression to decision trees and beyond.",
  },
  {
    id: "dl",
    category: "Core",
    title: "Deep Learning",
    subtitle: "Neural Networks & Backpropagation",
    icon: "⊗",
    color: "#8b5cf6",
    progress: 45,
    lessons: 18,
    duration: "9h",
    level: "Intermediate",
    tags: ["Neural Nets", "Activation", "Backprop"],
    desc: "Dive into multi-layer perceptrons, activation functions, gradient descent and modern deep architectures.",
  },
  {
    id: "nlp",
    category: "Specialization",
    title: "Natural Language Processing",
    subtitle: "Text, Embeddings & Transformers",
    icon: "⊘",
    color: "#ff6b35",
    progress: 28,
    lessons: 16,
    duration: "8h",
    level: "Intermediate",
    tags: ["Tokenization", "Embeddings", "Transformers"],
    desc: "Learn how computers understand human language — from bag-of-words to modern LLMs.",
  },
  {
    id: "cv",
    category: "Specialization",
    title: "Computer Vision",
    subtitle: "CNNs, Detection & Segmentation",
    icon: "⊙",
    color: "#10f5a0",
    progress: 15,
    lessons: 12,
    duration: "7h",
    level: "Intermediate",
    tags: ["CNN", "Detection", "ResNet"],
    desc: "Teach machines to see — convolutional networks, image classification, object detection and segmentation.",
  },
  {
    id: "rl",
    category: "Advanced",
    title: "Reinforcement Learning",
    subtitle: "Agents, Rewards & Policies",
    icon: "⊚",
    color: "#fbbf24",
    progress: 0,
    lessons: 10,
    duration: "5h",
    level: "Advanced",
    tags: ["Q-Learning", "Policy", "Rewards"],
    desc: "Explore how agents learn through interaction — Markov decision processes, Q-learning, and policy gradients.",
  },
  {
    id: "data",
    category: "Core",
    title: "Data Preprocessing",
    subtitle: "Cleaning, Scaling & Feature Engineering",
    icon: "⊛",
    color: "#e879f9",
    progress: 90,
    lessons: 8,
    duration: "3h",
    level: "Beginner",
    tags: ["Scaling", "Imputation", "Features"],
    desc: "Master the art of preparing data — handling missing values, feature scaling, encoding, and selection.",
  },
  {
    id: "eval",
    category: "Core",
    title: "Model Evaluation",
    subtitle: "Metrics, Cross-validation & Tuning",
    icon: "⊜",
    color: "#38bdf8",
    progress: 60,
    lessons: 9,
    duration: "4h",
    level: "Beginner",
    tags: ["Accuracy", "ROC-AUC", "CV"],
    desc: "Learn to measure and improve model performance using the right metrics, validation strategies, and hyperparameter tuning.",
  },
  {
    id: "mlops",
    category: "Advanced",
    title: "MLOps Fundamentals",
    subtitle: "Pipelines, Deployment & Monitoring",
    icon: "⊝",
    color: "#fb923c",
    progress: 5,
    lessons: 11,
    duration: "5h",
    level: "Advanced",
    tags: ["Pipelines", "Docker", "Monitoring"],
    desc: "Bridge the gap between model development and production — CI/CD for ML, containerization, and model drift monitoring.",
  },
];

const CATEGORIES = ["All", "Core", "Specialization", "Advanced"];
const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];

/* Map each topic to its best destination page */
const TOPIC_ROUTES = {
  ml:    "/quiz",
  dl:    "/quiz",
  nlp:   "/quiz",
  cv:    "/quiz",
  rl:    "/simulate",
  data:  "/playground",
  eval:  "/quiz",
  mlops: "/simulate",
};

/* ── Component ─────────────────────────────────────────────── */
export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLevel, setActiveLevel] = useState("All Levels");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = TOPICS.filter((t) => {
    const matchCategory = activeCategory === "All" || t.category === activeCategory;
    const matchLevel = activeLevel === "All Levels" || t.level === activeLevel;
    const matchSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchLevel && matchSearch;
  });

  const totalProgress = Math.round(
    TOPICS.reduce((s, t) => s + t.progress, 0) / TOPICS.length
  );

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="mb-10">
        <p className="section-label mb-2">// LEARNING DASHBOARD</p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-slate-100 mb-2"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Your{" "}
              <span className="gradient-text">AI/ML</span> Journey
            </h1>
            <p className="text-slate-400">
              {TOPICS.length} modules · Track your progress across every topic
            </p>
          </div>

          {/* Overall progress */}
          <div className="glass-card rounded-2xl px-6 py-4 min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                OVERALL PROGRESS
              </span>
              <span className="text-lg font-bold gradient-text" style={{ fontFamily: "Syne, sans-serif" }}>
                {totalProgress}%
              </span>
            </div>
            <ProgressBar value={totalProgress} />
          </div>
        </div>
      </div>

      {/* ── Filters ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">⌕</span>
          <input
            type="text"
            placeholder="Search topics or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0f172a] border border-white/10 rounded-lg pl-8 pr-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-[#00d4ff]/40 transition-colors"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/30"
                  : "text-slate-500 border border-white/5 hover:border-white/15 hover:text-slate-300"
              }`}
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Level filter */}
        <select
          value={activeLevel}
          onChange={(e) => setActiveLevel(e.target.value)}
          className="bg-[#0f172a] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-slate-400 focus:outline-none focus:border-[#00d4ff]/40 cursor-pointer"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          {LEVELS.map((l) => (
            <option key={l} value={l} style={{ background: "#0f172a" }}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {/* ── Topic Grid ────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <span className="text-4xl block mb-3">◎</span>
          No topics match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((topic) => (
            <TopicCard key={topic.id} topic={topic} route={TOPIC_ROUTES[topic.id] || "/quiz"} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── TopicCard sub-component ─────────────────────────────── */
function TopicCard({ topic, route }) {
  const { title, subtitle, icon, color, progress, lessons, duration, level, tags, desc } = topic;
  const navigate = useNavigate();

  const handleContinue = (e) => {
    e.stopPropagation();
    navigate(route);
  };

  const handleCardClick = () => {
    navigate(route);
  };

  const levelColors = {
    Beginner: "tag-green",
    Intermediate: "tag-cyan",
    Advanced: "tag-coral",
  };

  return (
    <div
      className="glass-card rounded-2xl p-5 flex flex-col gap-4 border border-white/5 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
      style={{ "--hover-color": color }}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      aria-label={`${progress > 0 ? "Continue" : "Start"} ${title}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${color}15`, border: `1px solid ${color}25`, color }}
        >
          {icon}
        </div>
        <span className={`tag ${levelColors[level] || "tag-cyan"}`}>{level}</span>
      </div>

      {/* Title */}
      <div>
        <h3
          className="text-base font-bold text-slate-100 mb-0.5 leading-snug"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          {title}
        </h3>
        <p className="text-[11px] text-slate-500" style={{ fontFamily: "JetBrains Mono, monospace" }}>
          {subtitle}
        </p>
      </div>

      {/* Desc */}
      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{desc}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded text-[10px] font-mono"
            style={{
              background: `${color}10`,
              color: `${color}cc`,
              border: `1px solid ${color}20`,
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-slate-500" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            PROGRESS
          </span>
          <span className="text-xs font-bold" style={{ color }}>
            {progress}%
          </span>
        </div>
        <div className="progress-track h-1.5 w-full">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${color}, ${color}88)`,
            }}
          />
        </div>
      </div>

      {/* Meta footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-500">
        <span>{lessons} lessons</span>
        <span>⏱ {duration}</span>
        <button
          onClick={handleContinue}
          className="text-[11px] font-semibold transition-all duration-200 hover:opacity-80 hover:tracking-wide"
          style={{ color, fontFamily: "Syne, sans-serif" }}
          aria-label={`${progress > 0 ? "Continue" : "Start"} ${title}`}
        >
          {progress > 0 ? "Continue →" : "Start →"}
        </button>
      </div>
    </div>
  );
}
