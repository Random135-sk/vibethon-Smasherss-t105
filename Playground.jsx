// pages/Playground.jsx — Interactive code editor with real Python execution (Pyodide)
import { useState, useRef, useEffect } from "react";

/* ── Sample code snippets ─────────────────────────────────── */
const SNIPPETS = {
  "Linear Regression": `import numpy as np

# Simple Linear Regression from scratch
X = np.array([1, 2, 3, 4, 5], dtype=float)
y = np.array([2, 4, 5, 4, 5], dtype=float)

# Calculate slope (m) and intercept (b)
n = len(X)
m = (n * np.sum(X * y) - np.sum(X) * np.sum(y)) / \\
    (n * np.sum(X**2) - np.sum(X)**2)
b = (np.sum(y) - m * np.sum(X)) / n

print(f"Slope (m)     : {m:.4f}")
print(f"Intercept (b) : {b:.4f}")
print(f"Prediction for x=6: {m*6+b:.4f}")
`,

  "K-Means Clustering": `import numpy as np

# K-Means from scratch (2 clusters, 2D)
np.random.seed(42)
data = np.random.randn(20, 2)
k = 2

# Random initial centroids
centroids = data[np.random.choice(len(data), k, replace=False)]

for iteration in range(10):
    # Assign clusters
    distances = np.linalg.norm(data[:, None] - centroids, axis=2)
    labels = np.argmin(distances, axis=1)

    # Update centroids
    new_centroids = np.array([data[labels == i].mean(axis=0) for i in range(k)])

    if np.allclose(centroids, new_centroids):
        print(f"Converged at iteration {iteration + 1}")
        break
    centroids = new_centroids

print(f"Final centroids:\\n{centroids.round(3)}")
for i in range(k):
    print(f"Cluster {i}: {np.sum(labels == i)} points")
`,

  "Neural Network": `import numpy as np

# Tiny 2-layer neural network (XOR problem)
def sigmoid(x): return 1 / (1 + np.exp(-x))
def sigmoid_deriv(x): return x * (1 - x)

# XOR dataset
X = np.array([[0,0],[0,1],[1,0],[1,1]])
y = np.array([[0],[1],[1],[0]])

np.random.seed(1)
W1 = 2 * np.random.random((2, 4)) - 1
W2 = 2 * np.random.random((4, 1)) - 1

# Training loop
for epoch in range(10000):
    L1 = sigmoid(X @ W1)
    L2 = sigmoid(L1 @ W2)
    L2_err = y - L2
    L2_delta = L2_err * sigmoid_deriv(L2)
    L1_err = L2_delta @ W2.T
    L1_delta = L1_err * sigmoid_deriv(L1)
    W2 += L1.T @ L2_delta
    W1 += X.T @ L1_delta

print("Predictions vs Actual:")
for i, (pred, actual) in enumerate(zip(L2.round(2), y)):
    print(f"  Input {X[i]} → Pred: {pred[0]:.2f}, Actual: {actual[0]}")
`,

  "Naive Bayes": `# Naive Bayes Text Classifier (from scratch)
from math import log

# Training data: (text, label)
train = [
    ("great movie loved it", "positive"),
    ("amazing fantastic film", "positive"),
    ("terrible waste of time", "negative"),
    ("awful horrible boring", "negative"),
    ("good entertaining fun", "positive"),
    ("bad disappointing poor", "negative"),
]

# Build vocabulary & count words per class
vocab, class_counts, word_counts = set(), {}, {}
for text, label in train:
    words = text.split()
    vocab.update(words)
    class_counts[label] = class_counts.get(label, 0) + 1
    if label not in word_counts:
        word_counts[label] = {}
    for w in words:
        word_counts[label][w] = word_counts[label].get(w, 0) + 1

def predict(text):
    scores = {}
    for label in class_counts:
        scores[label] = log(class_counts[label] / len(train))
        for w in text.split():
            count = word_counts[label].get(w, 0) + 1
            total = sum(word_counts[label].values()) + len(vocab)
            scores[label] += log(count / total)
    return max(scores, key=scores.get)

tests = ["wonderful experience", "very bad movie", "loved it amazing"]
for t in tests:
    print(f'"{t}" → {predict(t)}')
`,
};

/* ── Detect if code uses numpy ──────────────────────────── */
const needsNumpy = (code) => /import\s+numpy|from\s+numpy/.test(code);

/* ── Load Pyodide from CDN ──────────────────────────────── */
const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";

async function loadPyodideScript() {
  if (window.loadPyodide) return;
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = PYODIDE_CDN;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

/* ── Wrap user code to capture stdout/stderr ─────────────── */
function wrapCode(userCode) {
  // Escape backticks and backslashes for template-literal embedding
  const escaped = userCode.replace(/\\/g, "\\\\").replace(/`/g, "\\`");
  return `
import sys, io, traceback as _tb
_stdout_buf = io.StringIO()
_stderr_buf = io.StringIO()
_old_out = sys.stdout
_old_err = sys.stderr
sys.stdout = _stdout_buf
sys.stderr = _stderr_buf
_exec_ok = True
try:
    exec(compile("""${escaped}""", "<playground>", "exec"), {})
except Exception as _e:
    _exec_ok = False
    print(_tb.format_exc(), file=_stderr_buf)
finally:
    sys.stdout = _old_out
    sys.stderr = _old_err
(_exec_ok, _stdout_buf.getvalue(), _stderr_buf.getvalue())
`;
}

/* ── Component ─────────────────────────────────────────────── */
export default function Playground() {
  const [selectedSnippet, setSelectedSnippet] = useState("Linear Regression");
  const [code, setCode]         = useState(SNIPPETS["Linear Regression"]);
  const [output, setOutput]     = useState("");
  const [running, setRunning]   = useState(false);
  const [outputType, setOutputType] = useState(null); // 'success' | 'error'
  const [pyStatus, setPyStatus] = useState("idle"); // 'idle'|'loading'|'ready'|'error'
  const [loadMsg, setLoadMsg]   = useState("");

  const pyodideRef  = useRef(null);
  const numpyLoaded = useRef(false);

  /* Pre-load Pyodide in background when component mounts */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setPyStatus("loading");
        setLoadMsg("Loading Python runtime…");
        await loadPyodideScript();
        if (cancelled) return;
        setLoadMsg("Initialising interpreter…");
        pyodideRef.current = await window.loadPyodide();
        if (cancelled) return;
        setPyStatus("ready");
        setLoadMsg("");
      } catch (err) {
        if (!cancelled) {
          setPyStatus("error");
          setLoadMsg("Failed to load Python runtime. Check your connection.");
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const loadSnippet = (name) => {
    setSelectedSnippet(name);
    setCode(SNIPPETS[name]);
    setOutput("");
    setOutputType(null);
  };

  const runCode = async () => {
    if (running) return;
    setRunning(true);
    setOutput("");
    setOutputType(null);

    try {
      /* ── Ensure Pyodide is ready ── */
      if (!pyodideRef.current) {
        setLoadMsg("Loading Python runtime…");
        await loadPyodideScript();
        pyodideRef.current = await window.loadPyodide();
        setPyStatus("ready");
        setLoadMsg("");
      }

      const pyodide = pyodideRef.current;

      /* ── Load numpy if needed (once) ── */
      if (needsNumpy(code) && !numpyLoaded.current) {
        setLoadMsg("Loading NumPy package…");
        await pyodide.loadPackage(["numpy"]);
        numpyLoaded.current = true;
        setLoadMsg("");
      }

      /* ── Execute ── */
      const result = await pyodide.runPythonAsync(wrapCode(code));
      const [ok, stdout, stderr] = result.toJs ? result.toJs() : result;

      if (ok) {
        setOutput(stdout.trim() || "(no output)");
        setOutputType("success");
      } else {
        setOutput(stderr.trim());
        setOutputType("error");
      }
    } catch (err) {
      // Pyodide itself threw (e.g., syntax error not caught by exec)
      setOutput(String(err.message || err));
      setOutputType("error");
    } finally {
      setRunning(false);
      setLoadMsg("");
    }
  };

  const clearOutput = () => { setOutput(""); setOutputType(null); };

  /* Status badge */
  const statusDot = {
    idle:    "bg-slate-600",
    loading: "bg-yellow-400 animate-pulse",
    ready:   "bg-[#10f5a0]",
    error:   "bg-[#ff6b35]",
  }[pyStatus];

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="section-label mb-2">// CODING PLAYGROUND</p>
        <h1
          className="text-4xl sm:text-5xl font-extrabold text-slate-100 mb-2"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Write &amp; Run{" "}
          <span className="gradient-text">ML Code</span>
        </h1>
        <p className="text-slate-400">
          Experiment with machine learning algorithms — your code actually runs in the browser.
        </p>
      </div>

      {/* Runtime status bar */}
      <div className="flex items-center gap-2 mb-5 px-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] w-fit">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot}`} />
        <span className="text-[11px] text-slate-500" style={{ fontFamily: "JetBrains Mono, monospace" }}>
          {pyStatus === "idle"    && "Python runtime ready to load"}
          {pyStatus === "loading" && (loadMsg || "Loading…")}
          {pyStatus === "ready"   && (loadMsg || "Python 3 · Pyodide · Real execution")}
          {pyStatus === "error"   && loadMsg}
        </span>
      </div>

      {/* Snippet selector */}
      <div className="flex gap-2 flex-wrap mb-6">
        <span className="text-xs text-slate-500 flex items-center mr-2" style={{ fontFamily: "JetBrains Mono, monospace" }}>
          Templates:
        </span>
        {Object.keys(SNIPPETS).map((name) => (
          <button
            key={name}
            onClick={() => loadSnippet(name)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              selectedSnippet === name
                ? "bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/30"
                : "text-slate-500 border border-white/5 hover:border-white/15 hover:text-slate-300"
            }`}
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Editor + Output layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ── Editor Panel ───────────────────────────────── */}
        <div className="flex flex-col gap-0 glass-card rounded-2xl overflow-hidden border border-white/7">
          {/* Editor toolbar */}
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b"
            style={{ background: "#020b14", borderColor: "rgba(0,212,255,0.1)" }}
          >
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span
                className="text-xs text-slate-500 ml-2"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {selectedSnippet.toLowerCase().replace(/ /g, "_")}.py
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="tag tag-cyan text-[10px]">Python 3</span>
              {needsNumpy(code) && <span className="tag tag-purple text-[10px]">NumPy</span>}
            </div>
          </div>

          {/* Line numbers + editor */}
          <div className="flex flex-1" style={{ background: "#020b14" }}>
            {/* Line numbers */}
            <div
              className="py-4 px-3 text-right select-none flex-shrink-0"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.8rem",
                lineHeight: "1.7",
                color: "rgba(148,163,184,0.2)",
                minWidth: "2.5rem",
                background: "#020b14",
                borderRight: "1px solid rgba(0,212,255,0.06)",
              }}
            >
              {code.split("\n").map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              className="code-editor flex-1 p-4 w-full min-h-[400px]"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              style={{
                background: "#020b14",
                border: "none",
                borderRadius: 0,
                fontSize: "0.82rem",
                lineHeight: "1.7",
                color: "#93c5fd",
                caretColor: "#00d4ff",
              }}
            />
          </div>

          {/* Run button bar */}
          <div
            className="flex items-center justify-between px-4 py-3 border-t"
            style={{ background: "#020b14", borderColor: "rgba(0,212,255,0.1)" }}
          >
            <span className="text-[11px] text-slate-600" style={{ fontFamily: "JetBrains Mono, monospace" }}>
              {code.split("\n").length} lines · {code.length} chars
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setCode(SNIPPETS[selectedSnippet]); setOutput(""); setOutputType(null); }}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-500 border border-white/5 hover:border-white/15 hover:text-slate-300 transition-all"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                Reset
              </button>
              <button
                onClick={runCode}
                disabled={running || pyStatus === "error"}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #00d4ff, #8b5cf6)",
                  color: "white",
                  fontFamily: "Syne, sans-serif",
                  boxShadow: "0 0 20px rgba(0,212,255,0.3)",
                }}
              >
                {running ? (
                  <>
                    <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {loadMsg || "Running..."}
                  </>
                ) : (
                  <>▶ Run Code</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Output Panel ───────────────────────────────── */}
        <div className="flex flex-col glass-card rounded-2xl overflow-hidden border border-white/7">
          {/* Output toolbar */}
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b"
            style={{ background: "#020b14", borderColor: "rgba(0,212,255,0.1)" }}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  outputType === "success"
                    ? "bg-[#10f5a0]"
                    : outputType === "error"
                    ? "bg-[#ff6b35]"
                    : "bg-slate-600"
                } ${running ? "animate-pulse" : ""}`}
              />
              <span
                className="text-xs text-slate-500"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {running
                  ? loadMsg || "executing..."
                  : outputType === "success"
                  ? "execution complete"
                  : outputType === "error"
                  ? "execution failed"
                  : "console output"}
              </span>
            </div>
            {output && (
              <button
                onClick={clearOutput}
                className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Output area */}
          <div
            className="flex-1 p-4 min-h-[400px] overflow-auto"
            style={{
              background: "#020b14",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.82rem",
              lineHeight: "1.8",
            }}
          >
            {/* Loading skeleton */}
            {running && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[#00d4ff]/60 text-xs mb-3">
                  <span className="inline-block w-3 h-3 border-2 border-[#00d4ff]/30 border-t-[#00d4ff] rounded-full animate-spin" />
                  {loadMsg || "Running Python…"}
                </div>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-3 rounded shimmer"
                    style={{ width: `${60 + i * 15}%`, animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!running && !output && (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-700">
                <span className="text-4xl">▶</span>
                <p className="text-sm">Click Run Code to execute</p>
                <p className="text-xs text-slate-700/60">Your actual output will appear here</p>
              </div>
            )}

            {/* Success output */}
            {!running && output && outputType === "success" && (
              <div>
                <div className="text-[#10f5a0]/60 text-[11px] mb-3">
                  $ python {selectedSnippet.toLowerCase().replace(/ /g, "_")}.py
                </div>
                {output.split("\n").map((line, i) => (
                  <div
                    key={i}
                    className="text-[#a5f3fc]"
                    style={{ opacity: 0, animation: `fadeIn 0.3s ease ${i * 0.06}s forwards` }}
                  >
                    {line || "\u00A0"}
                  </div>
                ))}
                <div className="mt-4 text-[#10f5a0]/50 text-[11px]">
                  ✓ Process exited with code 0
                </div>
              </div>
            )}

            {/* Error output */}
            {!running && output && outputType === "error" && (
              <div>
                <div className="text-[#ff6b35]/60 text-[11px] mb-3">
                  $ python {selectedSnippet.toLowerCase().replace(/ /g, "_")}.py
                </div>
                {output.split("\n").map((line, i) => (
                  <div
                    key={i}
                    className="text-[#ff6b35]"
                    style={{ opacity: 0, animation: `fadeIn 0.3s ease ${i * 0.04}s forwards` }}
                  >
                    {line || "\u00A0"}
                  </div>
                ))}
                <div className="mt-4 text-[#ff6b35]/50 text-[11px]">
                  ✗ Process exited with code 1
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Tips Section ──────────────────────────────────── */}
      <div className="mt-8 glass-card rounded-2xl p-6 border border-white/5">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2" style={{ fontFamily: "Syne, sans-serif" }}>
          <span className="text-[#00d4ff]">✦</span> Learning Tips
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "⌨", title: "Modify & Explore", tip: "Change values, tweak parameters, and see how outputs change. That's how real understanding builds." },
            { icon: "◈", title: "Understand the Math", tip: "Each snippet has comments explaining the math. Read them — ML is math + code." },
            { icon: "◎", title: "Build Your Own", tip: "Clear the editor and try writing from scratch — your code now actually runs!" },
          ].map(({ icon, title, tip }) => (
            <div key={title} className="flex gap-3">
              <span className="text-[#00d4ff] text-lg flex-shrink-0">{icon}</span>
              <div>
                <p className="text-xs font-semibold text-slate-300 mb-1" style={{ fontFamily: "Syne, sans-serif" }}>{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
