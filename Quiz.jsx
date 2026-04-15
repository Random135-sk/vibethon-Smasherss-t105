// pages/Quiz.jsx — Interactive MCQ quiz with scoring
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";

/* ── Questions Bank ───────────────────────────────────────── */
const QUESTIONS = [
  {
    q: "What type of learning uses labeled training data to learn a mapping from inputs to outputs?",
    options: ["Unsupervised Learning", "Reinforcement Learning", "Supervised Learning", "Self-supervised Learning"],
    answer: 2,
    explanation: "Supervised learning trains on labeled data — each input has a corresponding correct output label.",
    topic: "ML Basics",
  },
  {
    q: "Which activation function outputs values strictly between 0 and 1, and is often used for binary classification?",
    options: ["ReLU", "Sigmoid", "Tanh", "Softmax"],
    answer: 1,
    explanation: "Sigmoid maps any real number to (0, 1), making it ideal for binary classification output layers.",
    topic: "Deep Learning",
  },
  {
    q: "What is 'overfitting' in machine learning?",
    options: [
      "The model performs poorly on both training and test data",
      "The model learns training data too well, failing to generalize",
      "The model trains too slowly",
      "The model has too few parameters",
    ],
    answer: 1,
    explanation: "Overfitting means the model memorizes training data (noise included), so it generalizes poorly to new data.",
    topic: "Model Evaluation",
  },
  {
    q: "In NLP, what does 'tokenization' refer to?",
    options: [
      "Encrypting text data",
      "Converting text to numbers randomly",
      "Splitting text into words, subwords, or characters",
      "Removing stop words from text",
    ],
    answer: 2,
    explanation: "Tokenization breaks raw text into smaller units (tokens) — words, subwords, or characters — that models can process.",
    topic: "NLP",
  },
  {
    q: "What does CNN stand for in the context of Computer Vision?",
    options: [
      "Conditional Normalization Network",
      "Convolutional Neural Network",
      "Contextual Node Network",
      "Connected Node Network",
    ],
    answer: 1,
    explanation: "CNNs use convolutional layers to automatically learn spatial hierarchies of features from images.",
    topic: "Computer Vision",
  },
  {
    q: "Which metric is most appropriate for evaluating a model on an imbalanced dataset?",
    options: ["Accuracy", "Mean Squared Error", "F1-Score", "R-squared"],
    answer: 2,
    explanation: "F1-Score balances precision and recall, making it better than accuracy when classes are imbalanced.",
    topic: "Model Evaluation",
  },
  {
    q: "What is the purpose of dropout in a neural network?",
    options: [
      "To speed up matrix multiplication",
      "To reduce the number of layers",
      "To prevent overfitting by randomly deactivating neurons during training",
      "To initialize weights to zero",
    ],
    answer: 2,
    explanation: "Dropout randomly sets a fraction of neurons to zero during training, acting as a regularizer to prevent overfitting.",
    topic: "Deep Learning",
  },
  {
    q: "In K-Means clustering, what does 'K' represent?",
    options: [
      "The number of dimensions in the data",
      "The number of training iterations",
      "The learning rate",
      "The number of clusters to form",
    ],
    answer: 3,
    explanation: "K in K-Means specifies how many clusters the algorithm will partition the data into.",
    topic: "ML Basics",
  },
  {
    q: "What is the 'vanishing gradient' problem?",
    options: [
      "Gradients grow exponentially during backpropagation",
      "Gradients become very small, making early layers train very slowly",
      "The loss function disappears during training",
      "Weights are initialized to zero",
    ],
    answer: 1,
    explanation: "In deep networks, gradients can shrink exponentially through backpropagation, effectively stopping early layers from learning.",
    topic: "Deep Learning",
  },
  {
    q: "Which technique is used to reduce model complexity by adding a penalty term to the loss function?",
    options: ["Data Augmentation", "Regularization", "Batch Normalization", "Transfer Learning"],
    answer: 1,
    explanation: "Regularization (L1/L2) adds a penalty for large weights to the loss function, discouraging overly complex models.",
    topic: "ML Basics",
  },
];

const QUIZ_TIME = 30; // seconds per question

/* ── Component ─────────────────────────────────────────────── */
export default function Quiz() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState("start"); // start | quiz | results
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME);
  const [answers, setAnswers] = useState([]);
  const [timedOut, setTimedOut] = useState(false);

  const question = QUESTIONS[currentQ];

  // Timer countdown
  useEffect(() => {
    if (screen !== "quiz" || answered) return;
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, screen, answered]);

  const handleTimeout = useCallback(() => {
    setTimedOut(true);
    setAnswered(true);
    setAnswers((prev) => [...prev, { q: currentQ, selected: -1, correct: false, timeout: true }]);
  }, [currentQ]);

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === question.answer;
    if (correct) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, { q: currentQ, selected: idx, correct, timeout: false }]);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= QUESTIONS.length) {
      setScreen("results");
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
      setTimedOut(false);
      setTimeLeft(QUIZ_TIME);
    }
  };

  const restart = () => {
    setScreen("start");
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setTimeLeft(QUIZ_TIME);
    setAnswers([]);
    setTimedOut(false);
  };

  /* ── Start Screen ─────────────────────────────────────── */
  if (screen === "start") {
    return (
      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="section-label mb-2">// QUIZ SECTION</p>
          <h1
            className="text-4xl sm:text-5xl font-extrabold text-slate-100 mb-3"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Test Your{" "}
            <span className="gradient-text">AI/ML</span> Knowledge
          </h1>
          <p className="text-slate-400 text-lg">
            {QUESTIONS.length} questions · 30 seconds each · Instant feedback
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 border border-white/5 mb-6">
          <div className="grid grid-cols-3 gap-6 mb-8">
            {[
              { label: "Questions", value: QUESTIONS.length, icon: "✦" },
              { label: "Sec / Question", value: QUIZ_TIME, icon: "⏱" },
              { label: "Topics", value: "5+", icon: "◈" },
            ].map(({ label, value, icon }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold gradient-text mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
                  {value}
                </div>
                <div className="text-xs text-slate-500">{icon} {label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3 mb-8">
            {["ML Basics", "Deep Learning", "NLP", "Computer Vision", "Model Evaluation"].map((topic) => (
              <div key={topic} className="flex items-center gap-3 text-sm text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]" />
                {topic}
              </div>
            ))}
          </div>

          <button
            onClick={() => setScreen("quiz")}
            className="btn-primary w-full text-base py-3.5"
          >
            <span>Start Quiz →</span>
          </button>
        </div>
      </div>
    );
  }

  /* ── Results Screen ───────────────────────────────────── */
  if (screen === "results") {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    const grade =
      pct >= 90 ? { label: "Expert!", color: "#10f5a0", desc: "Outstanding! You have a strong grasp of AI/ML." } :
      pct >= 70 ? { label: "Proficient", color: "#00d4ff", desc: "Great work! A few more practice rounds and you'll be an expert." } :
      pct >= 50 ? { label: "Learning", color: "#fbbf24", desc: "Good start! Review the topics you missed and try again." } :
      { label: "Beginner", color: "#ff6b35", desc: "Keep studying! Every expert was once a beginner." };

    return (
      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="section-label mb-2">// RESULTS</p>
          <h1 className="text-4xl font-extrabold mb-2" style={{ fontFamily: "Syne, sans-serif", color: grade.color }}>
            {grade.label}
          </h1>
          <p className="text-slate-400">{grade.desc}</p>
        </div>

        {/* Score circle */}
        <div className="glass-card rounded-2xl p-8 border border-white/5 text-center mb-6">
          <div
            className="text-7xl font-extrabold mb-2"
            style={{ fontFamily: "Syne, sans-serif", color: grade.color }}
          >
            {pct}%
          </div>
          <p className="text-slate-400 mb-2">{score} / {QUESTIONS.length} correct</p>
          <ProgressBar value={pct} />
        </div>

        {/* Per-question breakdown */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 mb-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
            Question Breakdown
          </h3>
          <div className="space-y-2">
            {answers.map(({ q, correct, timeout }, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-slate-400 truncate max-w-xs">
                  Q{i + 1}. {QUESTIONS[q].q.slice(0, 55)}...
                </span>
                <span
                  className="flex-shrink-0 ml-4 font-semibold"
                  style={{ color: correct ? "#10f5a0" : "#ff6b35" }}
                >
                  {timeout ? "⏱ Timed out" : correct ? "✓ Correct" : "✗ Wrong"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={restart} className="btn-primary flex-1 py-3.5">
            <span>Try Again →</span>
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-secondary flex-1 py-3.5"
          >
            Study More
          </button>
        </div>
      </div>
    );
  }

  /* ── Quiz Screen ──────────────────────────────────────── */
  const progress = ((currentQ) / QUESTIONS.length) * 100;
  const timerPct = (timeLeft / QUIZ_TIME) * 100;
  const timerColor = timeLeft > 10 ? "#00d4ff" : timeLeft > 5 ? "#fbbf24" : "#ff6b35";

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
      {/* Progress header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500" style={{ fontFamily: "JetBrains Mono, monospace" }}>
          QUESTION {currentQ + 1} / {QUESTIONS.length}
        </span>
        <span className="tag tag-cyan">{question.topic}</span>
      </div>
      <ProgressBar value={progress} className="mb-6" />

      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/5 mb-5">
        {/* Timer */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs text-slate-600" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            Score: <span className="text-[#10f5a0]">{score}</span>
          </span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 progress-track">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${timerPct}%`, background: timerColor }}
              />
            </div>
            <span
              className="text-sm font-bold w-6 text-right"
              style={{ color: timerColor, fontFamily: "JetBrains Mono, monospace" }}
            >
              {timeLeft}
            </span>
          </div>
        </div>

        {/* Question text */}
        <h2
          className="text-xl sm:text-2xl font-bold text-slate-100 mb-8 leading-snug"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          {question.q}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let cls = "quiz-option";
            if (answered) {
              if (idx === question.answer) cls += " correct";
              else if (idx === selected) cls += " wrong";
            } else if (idx === selected) {
              cls += " selected";
            }
            return (
              <button
                key={idx}
                className={cls}
                onClick={() => handleSelect(idx)}
                disabled={answered}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full border text-xs flex items-center justify-center mt-0.5"
                    style={{
                      borderColor: answered && idx === question.answer
                        ? "#10f5a0"
                        : answered && idx === selected
                        ? "#ff6b35"
                        : "rgba(255,255,255,0.15)",
                      color: answered && idx === question.answer
                        ? "#10f5a0"
                        : answered && idx === selected
                        ? "#ff6b35"
                        : "inherit",
                      fontFamily: "Syne, sans-serif",
                    }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div
            className="mt-6 p-4 rounded-xl text-sm text-slate-300 leading-relaxed"
            style={{
              background: timedOut
                ? "rgba(255,107,53,0.08)"
                : selected === question.answer
                ? "rgba(16,245,160,0.08)"
                : "rgba(255,107,53,0.08)",
              borderLeft: `3px solid ${
                timedOut || selected !== question.answer ? "#ff6b35" : "#10f5a0"
              }`,
            }}
          >
            <span className="font-semibold" style={{ fontFamily: "Syne, sans-serif" }}>
              {timedOut ? "⏱ Time's up! " : selected === question.answer ? "✓ Correct! " : "✗ Incorrect. "}
            </span>
            {question.explanation}
          </div>
        )}
      </div>

      {/* Next button */}
      {answered && (
        <button onClick={nextQuestion} className="btn-primary w-full py-3.5 text-base">
          <span>
            {currentQ + 1 >= QUESTIONS.length ? "See Results →" : "Next Question →"}
          </span>
        </button>
      )}
    </div>
  );
}
