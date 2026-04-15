// pages/MiniGames.jsx — Mini games for ML concept reinforcement
import { useState, useRef, useEffect } from "react";

/* ── Game Data ─────────────────────────────────────────────── */
const GAMES = [
  {
    id: "classify",
    title: "Binary Classifier",
    subtitle: "Plot & Classify",
    icon: "◎",
    color: "#00d4ff",
    tag: "tag-cyan",
    tagLabel: "Interactive",
    desc: "Click on the canvas to add data points. Toggle class (0/1) and watch a simple decision boundary emerge.",
    difficulty: "Beginner",
    active: true,
  },
  {
    id: "neurons",
    title: "Neuron Activator",
    subtitle: "Activation Functions",
    icon: "⊗",
    color: "#8b5cf6",
    tag: "tag-purple",
    tagLabel: "Visual",
    desc: "Drag the input slider and watch how different activation functions (ReLU, Sigmoid, Tanh) transform values.",
    difficulty: "Beginner",
    active: true,
  },
  {
    id: "gradient",
    title: "Gradient Descent Race",
    subtitle: "Optimization Challenge",
    icon: "∿",
    color: "#10f5a0",
    tag: "tag-green",
    tagLabel: "Coming Soon",
    desc: "Manually adjust weights to minimize loss on a parabolic surface. Race against automated gradient descent.",
    difficulty: "Intermediate",
    active: false,
  },
  {
    id: "decisiontree",
    title: "Decision Tree Builder",
    subtitle: "Split & Classify",
    icon: "⊕",
    color: "#fbbf24",
    tag: "tag-cyan",
    tagLabel: "Coming Soon",
    desc: "Build a decision tree by choosing split thresholds. Try to achieve 100% accuracy on the training set.",
    difficulty: "Intermediate",
    active: false,
  },
  {
    id: "knn",
    title: "K-NN Explorer",
    subtitle: "Distance Matters",
    icon: "⊘",
    color: "#ff6b35",
    tag: "tag-coral",
    tagLabel: "Coming Soon",
    desc: "Add points and predict new point classes by changing K. Visualize how neighborhood size affects decisions.",
    difficulty: "Beginner",
    active: false,
  },
  {
    id: "confusion",
    title: "Confusion Matrix Game",
    subtitle: "TP, FP, TN, FN",
    icon: "⊙",
    color: "#e879f9",
    tag: "tag-purple",
    tagLabel: "Coming Soon",
    desc: "Given model predictions, correctly fill in the confusion matrix and compute precision, recall and F1-score.",
    difficulty: "Intermediate",
    active: false,
  },
];

/* ── Component ─────────────────────────────────────────────── */
export default function MiniGames() {
  const [activeGame, setActiveGame] = useState(null);

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="section-label mb-2">// MINI GAMES</p>
        <h1
          className="text-4xl sm:text-5xl font-extrabold text-slate-100 mb-2"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Learn by{" "}
          <span className="gradient-text">Playing</span>
        </h1>
        <p className="text-slate-400">
          Reinforce AI/ML concepts through hands-on, visual, interactive mini-games.
        </p>
      </div>

      {/* Game cards */}
      {!activeGame && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {GAMES.map((game) => (
            <GameCard key={game.id} game={game} onPlay={() => setActiveGame(game.id)} />
          ))}
        </div>
      )}

      {/* Active game */}
      {activeGame === "classify" && (
        <ClassifierGame onBack={() => setActiveGame(null)} />
      )}
      {activeGame === "neurons" && (
        <NeuronGame onBack={() => setActiveGame(null)} />
      )}
    </div>
  );
}

/* ── GameCard ─────────────────────────────────────────────── */
function GameCard({ game, onPlay }) {
  const { title, subtitle, icon, color, tag, tagLabel, desc, difficulty, active } = game;
  return (
    <div
      className={`glass-card rounded-2xl p-6 flex flex-col gap-4 border border-white/5 transition-all duration-300 ${
        active ? "hover:scale-[1.02] hover:border-white/15 cursor-pointer group" : "opacity-60"
      }`}
      onClick={active ? onPlay : undefined}
      role={active ? "button" : undefined}
      tabIndex={active ? 0 : undefined}
      onKeyDown={active ? (e) => e.key === "Enter" && onPlay() : undefined}
      aria-label={active ? `Play ${title}` : undefined}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${color}15`, border: `1px solid ${color}25`, color }}
        >
          {icon}
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`tag ${tag}`}>{tagLabel}</span>
          <span className="text-[10px] text-slate-600" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {difficulty}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-100 mb-0.5" style={{ fontFamily: "Syne, sans-serif" }}>
          {title}
        </h3>
        <p className="text-[11px] text-slate-500 mb-2" style={{ fontFamily: "JetBrains Mono, monospace" }}>
          {subtitle}
        </p>
        <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
      </div>

      <button
        className={`mt-auto text-sm font-semibold transition-all duration-200 flex items-center gap-1 self-start ${
          active ? "hover:gap-2" : ""
        }`}
        style={{ color: active ? color : "#475569", fontFamily: "Syne, sans-serif" }}
        onClick={active ? (e) => { e.stopPropagation(); onPlay(); } : undefined}
        disabled={!active}
        aria-label={active ? `Play ${title}` : `${title} coming soon`}
      >
        {active ? "Play Now →" : "Coming Soon"}
      </button>
    </div>
  );
}

/* ── Classifier Game ──────────────────────────────────────── */
function ClassifierGame({ onBack }) {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [currentClass, setCurrentClass] = useState(0); // 0 or 1
  const [accuracy, setAccuracy] = useState(null);

  // Draw points on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Background grid
    ctx.strokeStyle = "rgba(0,212,255,0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Draw decision boundary (simple linear: y = x)
    if (points.length >= 4) {
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(W, 0); ctx.stroke();
      ctx.setLineDash([]);

      // Shade regions
      ctx.fillStyle = "rgba(0,212,255,0.04)";
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(W,0); ctx.lineTo(W,H); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(139,92,246,0.04)";
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,H); ctx.lineTo(W,H); ctx.closePath(); ctx.fill();
    }

    // Draw points
    points.forEach(({ x, y, cls }) => {
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fillStyle = cls === 0 ? "#00d4ff" : "#8b5cf6";
      ctx.fill();
      ctx.strokeStyle = cls === 0 ? "rgba(0,212,255,0.5)" : "rgba(139,92,246,0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Compute accuracy if enough points
    if (points.length >= 4) {
      const W2 = W, H2 = H;
      let correct = 0;
      points.forEach(({ x, y, cls }) => {
        const predicted = y < (H2 - (H2 / W2) * x) ? 1 : 0;
        if (predicted === cls) correct++;
      });
      setAccuracy(Math.round((correct / points.length) * 100));
    }
  }, [points]);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints((p) => [...p, { x, y, cls: currentClass }]);
  };

  const clearPoints = () => { setPoints([]); setAccuracy(null); };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        ← Back to Games
      </button>

      <div className="glass-card rounded-2xl p-6 border border-white/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
              Binary Classifier
            </h2>
            <p className="text-sm text-slate-400">Click on the canvas to add data points. The dashed line is a linear decision boundary.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Class toggle */}
            <div className="flex rounded-lg overflow-hidden border border-white/10">
              <button
                onClick={() => setCurrentClass(0)}
                className={`px-4 py-2 text-sm font-semibold transition-all ${
                  currentClass === 0 ? "bg-[#00d4ff]/20 text-[#00d4ff]" : "text-slate-500 hover:text-slate-300"
                }`}
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                ● Class 0
              </button>
              <button
                onClick={() => setCurrentClass(1)}
                className={`px-4 py-2 text-sm font-semibold transition-all ${
                  currentClass === 1 ? "bg-[#8b5cf6]/20 text-[#8b5cf6]" : "text-slate-500 hover:text-slate-300"
                }`}
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                ● Class 1
              </button>
            </div>
            <button
              onClick={clearPoints}
              className="px-3 py-2 text-xs text-slate-500 border border-white/10 rounded-lg hover:border-white/20 hover:text-slate-300 transition-all"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative rounded-xl overflow-hidden border border-white/10 cursor-crosshair">
          <canvas
            ref={canvasRef}
            width={700}
            height={380}
            className="w-full"
            style={{ background: "#020b14" }}
            onClick={handleCanvasClick}
          />
          {points.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-slate-600 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Click to add data points
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="flex gap-4 text-slate-500">
            <span>
              <span style={{ color: "#00d4ff" }}>●</span> Class 0: {points.filter(p => p.cls === 0).length}
            </span>
            <span>
              <span style={{ color: "#8b5cf6" }}>●</span> Class 1: {points.filter(p => p.cls === 1).length}
            </span>
          </div>
          {accuracy !== null && (
            <span
              className="font-bold text-base"
              style={{ color: accuracy >= 70 ? "#10f5a0" : "#ff6b35", fontFamily: "Syne, sans-serif" }}
            >
              Boundary Accuracy: {accuracy}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Neuron Activator Game ────────────────────────────────── */
function NeuronGame({ onBack }) {
  const [input, setInput] = useState(0);

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  const relu = (x) => Math.max(0, x);
  const tanh = (x) => Math.tanh(x);
  const leakyRelu = (x) => x >= 0 ? x : 0.1 * x;

  const FUNCTIONS = [
    { name: "Sigmoid", fn: sigmoid, color: "#00d4ff", range: "[0, 1]", use: "Binary classification output" },
    { name: "ReLU", fn: relu, color: "#8b5cf6", range: "[0, ∞)", use: "Hidden layers (most common)" },
    { name: "Tanh", fn: tanh, color: "#10f5a0", range: "[-1, 1]", use: "Hidden layers (zero-centered)" },
    { name: "Leaky ReLU", fn: leakyRelu, color: "#fbbf24", range: "(-∞, ∞)", use: "Avoids dying ReLU problem" },
  ];

  const normalize = (val, fn) => {
    const result = fn(val);
    if (fn === relu || fn === leakyRelu) {
      return Math.min(1, Math.max(-1, result / 5));
    }
    return result;
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        ← Back to Games
      </button>

      <div className="glass-card rounded-2xl p-6 border border-white/5">
        <h2 className="text-2xl font-bold text-slate-100 mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
          Neuron Activator
        </h2>
        <p className="text-sm text-slate-400 mb-8">
          Drag the slider to change the input value and watch how each activation function responds.
        </p>

        {/* Input slider */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-slate-300" style={{ fontFamily: "DM Sans, sans-serif" }}>
              Input (z)
            </label>
            <span
              className="text-2xl font-bold gradient-text"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              {input.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="-5"
            max="5"
            step="0.1"
            value={input}
            onChange={(e) => setInput(parseFloat(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(90deg, #8b5cf6 0%, #00d4ff ${((input + 5) / 10) * 100}%, rgba(255,255,255,0.1) ${((input + 5) / 10) * 100}%)`,
              outline: "none",
            }}
          />
          <div className="flex justify-between text-xs text-slate-600 mt-1.5">
            <span>-5</span>
            <span>0</span>
            <span>+5</span>
          </div>
        </div>

        {/* Activation function cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FUNCTIONS.map(({ name, fn, color, range, use }) => {
            const output = fn(input);
            const barPct = ((normalize(input, fn) + 1) / 2) * 100;

            return (
              <div
                key={name}
                className="rounded-xl p-4 border border-white/5"
                style={{ background: `${color}08`, borderColor: `${color}20` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm" style={{ color, fontFamily: "Syne, sans-serif" }}>{name}</h3>
                  <span className="text-xs text-slate-500" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                    range: {range}
                  </span>
                </div>

                {/* Output bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-500">Output</span>
                    <span
                      className="text-lg font-bold"
                      style={{ color, fontFamily: "JetBrains Mono, monospace" }}
                    >
                      {output.toFixed(4)}
                    </span>
                  </div>
                  <div className="progress-track h-2">
                    <div
                      className="h-full rounded-full transition-all duration-100"
                      style={{ width: `${Math.max(2, Math.min(100, barPct))}%`, background: color }}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">{use}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
