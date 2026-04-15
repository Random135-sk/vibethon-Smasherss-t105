// pages/Simulation.jsx — Real-world ML simulation demos
import { useState } from "react";

/* ── Simulation configs ───────────────────────────────────── */
const SIMULATIONS = [
  { id: "house", label: "House Price Predictor", icon: "⌂", color: "#00d4ff" },
  { id: "sentiment", label: "Sentiment Analyzer", icon: "◎", color: "#8b5cf6" },
  { id: "iris", label: "Iris Classifier", icon: "⊕", color: "#10f5a0" },
];

/* ── Component ─────────────────────────────────────────────── */
export default function Simulation() {
  const [activeTab, setActiveTab] = useState("house");

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="section-label mb-2">// REAL-WORLD SIMULATIONS</p>
        <h1
          className="text-4xl sm:text-5xl font-extrabold text-slate-100 mb-2"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Live{" "}
          <span className="gradient-text">ML Models</span>
        </h1>
        <p className="text-slate-400">
          Interact with working machine learning simulations. Enter real inputs and see model predictions.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 flex-wrap mb-8">
        {SIMULATIONS.map(({ id, label, icon, color }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === id
                ? "text-white border"
                : "text-slate-400 border border-white/5 hover:border-white/15 hover:text-slate-200"
            }`}
            style={
              activeTab === id
                ? {
                    background: `${color}15`,
                    borderColor: `${color}40`,
                    color,
                    fontFamily: "Syne, sans-serif",
                  }
                : { fontFamily: "Syne, sans-serif" }
            }
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Active simulation */}
      {activeTab === "house" && <HousePredictor />}
      {activeTab === "sentiment" && <SentimentAnalyzer />}
      {activeTab === "iris" && <IrisClassifier />}
    </div>
  );
}

/* ── House Price Predictor ────────────────────────────────── */
function HousePredictor() {
  const [form, setForm] = useState({ size: 1500, rooms: 3, bathrooms: 2, age: 10, garage: true });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const predict = () => {
    setLoading(true);
    setTimeout(() => {
      // Dummy linear model: price ≈ size*120 + rooms*8000 + bathrooms*5000 - age*1500 + garage*15000
      const base = form.size * 120 + form.rooms * 8000 + form.bathrooms * 5000 - form.age * 1500 + (form.garage ? 15000 : 0);
      const noise = (Math.random() - 0.5) * 20000;
      const price = Math.max(50000, Math.round((base + noise) / 1000) * 1000);
      setResult({ price, confidence: Math.round(82 + Math.random() * 10) });
      setLoading(false);
    }, 1000);
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input form */}
      <div className="glass-card rounded-2xl p-6 border border-white/5">
        <h2 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-2" style={{ fontFamily: "Syne, sans-serif" }}>
          <span className="text-[#00d4ff]">⌂</span> House Price Predictor
        </h2>
        <p className="text-xs text-slate-500 mb-6" style={{ fontFamily: "JetBrains Mono, monospace" }}>
          Linear Regression Model
        </p>

        <div className="space-y-5">
          <SliderInput label="House Size" unit="sq ft" value={form.size} min={500} max={5000} step={50} onChange={v => set("size", v)} color="#00d4ff" />
          <SliderInput label="Bedrooms" unit="rooms" value={form.rooms} min={1} max={8} step={1} onChange={v => set("rooms", v)} color="#00d4ff" />
          <SliderInput label="Bathrooms" unit="" value={form.bathrooms} min={1} max={5} step={1} onChange={v => set("bathrooms", v)} color="#00d4ff" />
          <SliderInput label="House Age" unit="years" value={form.age} min={0} max={50} step={1} onChange={v => set("age", v)} color="#00d4ff" />

          <div className="flex items-center justify-between">
            <label className="text-sm text-slate-300" style={{ fontFamily: "DM Sans, sans-serif" }}>Garage</label>
            <button
              onClick={() => set("garage", !form.garage)}
              className={`w-12 h-6 rounded-full relative transition-all duration-200 ${form.garage ? "bg-[#00d4ff]/40" : "bg-white/10"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200 ${form.garage ? "left-6" : "left-0.5"}`} />
            </button>
          </div>
        </div>

        <button
          onClick={predict}
          disabled={loading}
          className="btn-primary w-full mt-6 py-3 text-base disabled:opacity-60"
        >
          <span>{loading ? "Predicting..." : "Predict Price →"}</span>
        </button>
      </div>

      {/* Result */}
      <PredictionResult
        result={result}
        loading={loading}
        color="#00d4ff"
        mainLabel={result ? `$${result.price.toLocaleString()}` : null}
        mainDesc="Estimated Market Value"
        details={result ? [
          { label: "Price per sq ft", value: `$${Math.round(result.price / form.size)}/sqft` },
          { label: "Confidence", value: `${result.confidence}%` },
          { label: "Model", value: "Linear Regression" },
        ] : []}
        explanation="This model uses a simplified linear regression formula weighted on size, bedrooms, bathrooms, age, and garage presence. Real estate models also factor in location, market trends, and comparable sales."
      />
    </div>
  );
}

/* ── Sentiment Analyzer ───────────────────────────────────── */
function SentimentAnalyzer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const POSITIVE_WORDS = ["good","great","excellent","amazing","love","best","fantastic","wonderful","positive","happy","perfect","brilliant","awesome","superb","outstanding"];
  const NEGATIVE_WORDS = ["bad","terrible","awful","hate","worst","poor","horrible","disappointing","negative","sad","boring","ugly","dreadful","stupid","useless"];

  const analyze = () => {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const words = text.toLowerCase().split(/\s+/);
      let pos = words.filter(w => POSITIVE_WORDS.some(p => w.includes(p))).length;
      let neg = words.filter(w => NEGATIVE_WORDS.some(n => w.includes(n))).length;
      const total = pos + neg || 1;
      const score = (pos / total);
      const sentiment = score > 0.55 ? "Positive" : score < 0.45 ? "Negative" : "Neutral";
      const confidence = Math.round(55 + Math.abs(score - 0.5) * 80);
      setResult({ sentiment, score: Math.round(score * 100), confidence });
      setLoading(false);
    }, 800);
  };

  const sentimentColor = result
    ? result.sentiment === "Positive" ? "#10f5a0"
    : result.sentiment === "Negative" ? "#ff6b35" : "#fbbf24"
    : "#8b5cf6";

  const examples = [
    "This movie was absolutely fantastic! I loved every moment.",
    "The service was terrible and the food tasted awful.",
    "It was okay, nothing special but not bad either.",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card rounded-2xl p-6 border border-white/5">
        <h2 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-2" style={{ fontFamily: "Syne, sans-serif" }}>
          <span className="text-[#8b5cf6]">◎</span> Sentiment Analyzer
        </h2>
        <p className="text-xs text-slate-500 mb-6" style={{ fontFamily: "JetBrains Mono, monospace" }}>
          Naive Bayes Classifier
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter any text to analyze its sentiment..."
          rows={5}
          className="w-full bg-[#020b14] border border-white/10 rounded-xl p-4 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-[#8b5cf6]/40 transition-colors resize-none mb-4"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        />

        <div className="mb-5">
          <p className="text-xs text-slate-500 mb-2">Try examples:</p>
          <div className="space-y-2">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setText(ex)}
                className="w-full text-left text-xs text-slate-500 hover:text-slate-300 px-3 py-2 rounded-lg border border-white/5 hover:border-white/15 transition-all truncate"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={analyze}
          disabled={loading || !text.trim()}
          className="btn-primary w-full py-3 text-base disabled:opacity-60"
        >
          <span>{loading ? "Analyzing..." : "Analyze Sentiment →"}</span>
        </button>
      </div>

      <PredictionResult
        result={result}
        loading={loading}
        color={sentimentColor}
        mainLabel={result?.sentiment}
        mainDesc="Detected Sentiment"
        details={result ? [
          { label: "Positive Score", value: `${result.score}%` },
          { label: "Confidence", value: `${result.confidence}%` },
          { label: "Model", value: "Naive Bayes" },
        ] : []}
        explanation="Sentiment is computed using a lexicon-based Naive Bayes approach — counting positive and negative signal words. Production models use transformer-based embeddings for much higher accuracy."
      />
    </div>
  );
}

/* ── Iris Classifier ──────────────────────────────────────── */
function IrisClassifier() {
  const [form, setForm] = useState({ sepalLength: 5.1, sepalWidth: 3.5, petalLength: 1.4, petalWidth: 0.2 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const classify = () => {
    setLoading(true);
    setTimeout(() => {
      const { petalLength, petalWidth } = form;
      let species, confidence;
      if (petalLength < 2.5) {
        species = "Iris Setosa"; confidence = 97;
      } else if (petalLength < 5.0 && petalWidth < 1.8) {
        species = "Iris Versicolor"; confidence = Math.round(78 + Math.random() * 15);
      } else {
        species = "Iris Virginica"; confidence = Math.round(80 + Math.random() * 15);
      }
      setResult({ species, confidence });
      setLoading(false);
    }, 900);
  };

  const speciesColor = {
    "Iris Setosa": "#10f5a0",
    "Iris Versicolor": "#00d4ff",
    "Iris Virginica": "#8b5cf6",
  };
  const color = result ? speciesColor[result.species] : "#10f5a0";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card rounded-2xl p-6 border border-white/5">
        <h2 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-2" style={{ fontFamily: "Syne, sans-serif" }}>
          <span style={{ color: "#10f5a0" }}>⊕</span> Iris Classifier
        </h2>
        <p className="text-xs text-slate-500 mb-6" style={{ fontFamily: "JetBrains Mono, monospace" }}>
          Decision Tree Classifier
        </p>

        <div className="space-y-5">
          <SliderInput label="Sepal Length" unit="cm" value={form.sepalLength} min={4.0} max={8.0} step={0.1} onChange={v => set("sepalLength", v)} color="#10f5a0" />
          <SliderInput label="Sepal Width" unit="cm" value={form.sepalWidth} min={2.0} max={4.5} step={0.1} onChange={v => set("sepalWidth", v)} color="#10f5a0" />
          <SliderInput label="Petal Length" unit="cm" value={form.petalLength} min={1.0} max={7.0} step={0.1} onChange={v => set("petalLength", v)} color="#10f5a0" />
          <SliderInput label="Petal Width" unit="cm" value={form.petalWidth} min={0.1} max={2.5} step={0.1} onChange={v => set("petalWidth", v)} color="#10f5a0" />
        </div>

        <button
          onClick={classify}
          disabled={loading}
          className="btn-primary w-full mt-6 py-3 text-base disabled:opacity-60"
        >
          <span>{loading ? "Classifying..." : "Classify Species →"}</span>
        </button>
      </div>

      <PredictionResult
        result={result}
        loading={loading}
        color={color}
        mainLabel={result?.species}
        mainDesc="Predicted Species"
        details={result ? [
          { label: "Confidence", value: `${result.confidence}%` },
          { label: "Petal Length", value: `${form.petalLength} cm` },
          { label: "Model", value: "Decision Tree" },
        ] : []}
        explanation="The Iris dataset is a classic ML benchmark. This classifier uses petal dimensions as the primary splitting feature — mimicking a decision tree. Setosa is linearly separable; Versicolor and Virginica require deeper splits."
      />
    </div>
  );
}

/* ── Reusable Components ──────────────────────────────────── */
function SliderInput({ label, unit, value, min, max, step, onChange, color }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm text-slate-300" style={{ fontFamily: "DM Sans, sans-serif" }}>{label}</label>
        <span className="text-sm font-semibold" style={{ color, fontFamily: "Syne, sans-serif" }}>
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(90deg, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.08) ${((value - min) / (max - min)) * 100}%)`,
          outline: "none",
        }}
      />
    </div>
  );
}

function PredictionResult({ result, loading, color, mainLabel, mainDesc, details, explanation }) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col gap-5">
      <h3 className="text-sm font-semibold text-slate-400" style={{ fontFamily: "Syne, sans-serif" }}>Prediction Output</h3>

      {/* Main result */}
      <div
        className="rounded-xl p-6 text-center flex-1 flex flex-col items-center justify-center min-h-[160px]"
        style={{ background: `${color}08`, border: `1px solid ${color}20` }}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: `${color}40`, borderTopColor: color }}
            />
            <p className="text-sm text-slate-500">Running model...</p>
          </div>
        ) : result ? (
          <>
            <div
              className="text-4xl font-extrabold mb-2"
              style={{ color, fontFamily: "Syne, sans-serif" }}
            >
              {mainLabel}
            </div>
            <p className="text-sm text-slate-400">{mainDesc}</p>
          </>
        ) : (
          <p className="text-slate-600 text-sm">Results will appear here</p>
        )}
      </div>

      {/* Detail rows */}
      {result && details.length > 0 && (
        <div className="space-y-2">
          {details.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between text-sm border-b border-white/5 pb-2">
              <span className="text-slate-500">{label}</span>
              <span className="font-medium text-slate-200" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.8rem" }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Explanation */}
      <div className="rounded-lg p-3 bg-white/3 border border-white/5">
        <p className="text-[11px] text-slate-500 leading-relaxed">{explanation}</p>
      </div>
    </div>
  );
}
