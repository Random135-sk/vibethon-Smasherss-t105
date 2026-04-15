// pages/Login.jsx — Login & Sign-up page
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ── tiny inline icon helpers ───────────────────────────── */
const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const SpinnerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="login-spinner">
    <path d="M12 2a10 10 0 1 0 10 10" />
  </svg>
);

/* ── Floating orb background ─────────────────────────────── */
function FloatingOrbs() {
  return (
    <div aria-hidden className="login-orbs-wrap">
      <div className="login-orb orb-1" />
      <div className="login-orb orb-2" />
      <div className="login-orb orb-3" />
    </div>
  );
}

/* ── Input field component ───────────────────────────────── */
function Field({ id, label, type = "text", value, onChange, icon, error, placeholder, rightSlot }) {
  return (
    <div className="login-field">
      <label htmlFor={id} className="login-label">{label}</label>
      <div className={`login-input-wrap ${error ? "login-input-error" : ""}`}>
        <span className="login-input-icon">{icon}</span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={type === "password" ? "current-password" : type === "email" ? "email" : "name"}
          className="login-input"
        />
        {rightSlot && <span className="login-input-right">{rightSlot}</span>}
      </div>
      {error && <p className="login-field-error">{error}</p>}
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */
export default function Login() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { user, loading, error, login, signup, clearError } = useAuth();

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      const from = location.state?.from || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location.state]);

  /* Tab state */
  const [tab, setTab] = useState("login"); // "login" | "signup"

  /* Login form state */
  const [loginEmail,    setLoginEmail]    = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRemember, setLoginRemember] = useState(false);
  const [showLoginPw,   setShowLoginPw]   = useState(false);
  const [loginErrors,   setLoginErrors]   = useState({});

  /* Signup form state */
  const [signupName,     setSignupName]     = useState("");
  const [signupEmail,    setSignupEmail]    = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm,  setSignupConfirm]  = useState("");
  const [showSignupPw,   setShowSignupPw]   = useState(false);
  const [signupErrors,   setSignupErrors]   = useState({});

  /* Success flash */
  const [successMsg, setSuccessMsg] = useState("");

  /* Clear global auth error on tab switch */
  const switchTab = (t) => {
    setTab(t);
    clearError();
    setLoginErrors({});
    setSignupErrors({});
    setSuccessMsg("");
  };

  /* ── Client-side validation ───────────────────────────── */
  const validateLogin = () => {
    const errs = {};
    if (!loginEmail.trim())                   errs.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) errs.email   = "Enter a valid email.";
    if (!loginPassword)                        errs.password = "Password is required.";
    else if (loginPassword.length < 6)         errs.password = "Min. 6 characters.";
    return errs;
  };

  const validateSignup = () => {
    const errs = {};
    if (!signupName.trim())                     errs.name     = "Full name is required.";
    if (!signupEmail.trim())                    errs.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(signupEmail)) errs.email   = "Enter a valid email.";
    if (!signupPassword)                         errs.password = "Password is required.";
    else if (signupPassword.length < 6)          errs.password = "Min. 6 characters.";
    if (signupPassword !== signupConfirm)        errs.confirm  = "Passwords don't match.";
    return errs;
  };

  /* ── Submit handlers ─────────────────────────────────── */
  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();
    const errs = validateLogin();
    if (Object.keys(errs).length) { setLoginErrors(errs); return; }
    setLoginErrors({});
    try {
      await login({ email: loginEmail, password: loginPassword, remember: loginRemember });
      // navigation handled by useEffect above
    } catch (_) {}
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    clearError();
    const errs = validateSignup();
    if (Object.keys(errs).length) { setSignupErrors(errs); return; }
    setSignupErrors({});
    try {
      await signup({ name: signupName, email: signupEmail, password: signupPassword });
      setSuccessMsg("Account created! Redirecting…");
      // navigation handled by useEffect above
    } catch (_) {}
  };

  const handleGoogleLogin = () => {
    // Placeholder — wire to real OAuth provider
    alert("Google OAuth would be configured here with your provider credentials.");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!loginEmail) {
      setLoginErrors(prev => ({ ...prev, email: "Enter your email first." }));
      return;
    }
    setSuccessMsg(`Password reset link sent to ${loginEmail}`);
  };

  /* ─────────────────────────────────────────────────────── */
  return (
    <div className="login-page bg-grid">
      <FloatingOrbs />

      {/* Back to home */}
      <Link to="/" className="login-back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Home
      </Link>

      <div className="login-card glass-card">
        {/* ── Logo ── */}
        <div className="login-logo-row">
          <Link to="/" className="login-logo">
            <div className="login-logo-icon">
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="3" fill="white" />
                <path d="M9 2L9 5M9 13L9 16M2 9L5 9M13 9L16 9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M4.2 4.2L6.3 6.3M11.7 11.7L13.8 13.8M4.2 13.8L6.3 11.7M11.7 6.3L13.8 4.2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="gradient-text login-brand">NeuralPath</span>
          </Link>
          <p className="login-tagline">Your AI/ML learning journey starts here</p>
        </div>

        {/* ── Tabs ── */}
        <div className="login-tab-row" role="tablist">
          <button
            role="tab"
            id="tab-login"
            aria-selected={tab === "login"}
            aria-controls="panel-login"
            onClick={() => switchTab("login")}
            className={`login-tab ${tab === "login" ? "login-tab--active" : ""}`}
          >
            Sign In
          </button>
          <button
            role="tab"
            id="tab-signup"
            aria-selected={tab === "signup"}
            aria-controls="panel-signup"
            onClick={() => switchTab("signup")}
            className={`login-tab ${tab === "signup" ? "login-tab--active" : ""}`}
          >
            Create Account
          </button>
          {/* sliding indicator */}
          <span
            className="login-tab-indicator"
            style={{ left: tab === "login" ? "4px" : "50%" }}
          />
        </div>

        {/* ── Global error / success banners ── */}
        {error && (
          <div className="login-banner login-banner--error" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}
        {successMsg && (
          <div className="login-banner login-banner--success" role="status">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            {successMsg}
          </div>
        )}

        {/* ══════════════ LOGIN PANEL ══════════════ */}
        {tab === "login" && (
          <form
            id="panel-login"
            role="tabpanel"
            aria-labelledby="tab-login"
            onSubmit={handleLogin}
            noValidate
            className="login-form"
          >
            <Field
              id="login-email"
              label="Email Address"
              type="email"
              value={loginEmail}
              onChange={e => { setLoginEmail(e.target.value); setLoginErrors(p => ({ ...p, email: "" })); }}
              icon={<MailIcon />}
              error={loginErrors.email}
              placeholder="you@example.com"
            />
            <Field
              id="login-password"
              label="Password"
              type={showLoginPw ? "text" : "password"}
              value={loginPassword}
              onChange={e => { setLoginPassword(e.target.value); setLoginErrors(p => ({ ...p, password: "" })); }}
              icon={<LockIcon />}
              error={loginErrors.password}
              placeholder="••••••••"
              rightSlot={
                <button
                  type="button"
                  id="login-toggle-pw"
                  onClick={() => setShowLoginPw(v => !v)}
                  className="login-pw-toggle"
                  aria-label={showLoginPw ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showLoginPw} />
                </button>
              }
            />

            {/* Remember me + Forgot */}
            <div className="login-row-between">
              <label htmlFor="login-remember" className="login-checkbox-label">
                <input
                  type="checkbox"
                  id="login-remember"
                  checked={loginRemember}
                  onChange={e => setLoginRemember(e.target.checked)}
                  className="login-checkbox"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                id="login-forgot"
                onClick={handleForgotPassword}
                className="login-link-btn"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="btn-primary login-submit-btn"
            >
              {loading
                ? <><SpinnerIcon /><span>Signing in…</span></>
                : <span>Sign In</span>
              }
            </button>

            {/* Divider */}
            <div className="login-divider">
              <span />
              <p>or continue with</p>
              <span />
            </div>

            {/* Google OAuth */}
            <button
              type="button"
              id="login-google"
              onClick={handleGoogleLogin}
              className="login-oauth-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <p className="login-switch-hint">
              Don't have an account?{" "}
              <button type="button" id="login-goto-signup" onClick={() => switchTab("signup")} className="login-link-btn">
                Create one
              </button>
            </p>
          </form>
        )}

        {/* ══════════════ SIGNUP PANEL ══════════════ */}
        {tab === "signup" && (
          <form
            id="panel-signup"
            role="tabpanel"
            aria-labelledby="tab-signup"
            onSubmit={handleSignup}
            noValidate
            className="login-form"
          >
            <Field
              id="signup-name"
              label="Full Name"
              type="text"
              value={signupName}
              onChange={e => { setSignupName(e.target.value); setSignupErrors(p => ({ ...p, name: "" })); }}
              icon={<UserIcon />}
              error={signupErrors.name}
              placeholder="Alex Chen"
            />
            <Field
              id="signup-email"
              label="Email Address"
              type="email"
              value={signupEmail}
              onChange={e => { setSignupEmail(e.target.value); setSignupErrors(p => ({ ...p, email: "" })); }}
              icon={<MailIcon />}
              error={signupErrors.email}
              placeholder="you@example.com"
            />
            <Field
              id="signup-password"
              label="Password"
              type={showSignupPw ? "text" : "password"}
              value={signupPassword}
              onChange={e => { setSignupPassword(e.target.value); setSignupErrors(p => ({ ...p, password: "" })); }}
              icon={<LockIcon />}
              error={signupErrors.password}
              placeholder="Min. 6 characters"
              rightSlot={
                <button
                  type="button"
                  id="signup-toggle-pw"
                  onClick={() => setShowSignupPw(v => !v)}
                  className="login-pw-toggle"
                  aria-label={showSignupPw ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showSignupPw} />
                </button>
              }
            />
            <Field
              id="signup-confirm"
              label="Confirm Password"
              type={showSignupPw ? "text" : "password"}
              value={signupConfirm}
              onChange={e => { setSignupConfirm(e.target.value); setSignupErrors(p => ({ ...p, confirm: "" })); }}
              icon={<LockIcon />}
              error={signupErrors.confirm}
              placeholder="Repeat password"
            />

            {/* Strength indicator */}
            {signupPassword && (
              <div className="login-strength">
                <div className="login-strength-bars">
                  {[1,2,3,4].map(n => {
                    const strength = Math.min(
                      4,
                      (signupPassword.length >= 6 ? 1 : 0) +
                      (/[A-Z]/.test(signupPassword) ? 1 : 0) +
                      (/[0-9]/.test(signupPassword) ? 1 : 0) +
                      (/[^A-Za-z0-9]/.test(signupPassword) ? 1 : 0)
                    );
                    return (
                      <div
                        key={n}
                        className="login-strength-bar"
                        style={{
                          background: n <= strength
                            ? strength <= 1 ? "#ff6b35"
                              : strength <= 2 ? "#f59e0b"
                              : strength <= 3 ? "#00d4ff"
                              : "#10f5a0"
                            : "rgba(255,255,255,0.08)"
                        }}
                      />
                    );
                  })}
                </div>
                <span className="login-strength-label">
                  {(() => {
                    const s = Math.min(
                      4,
                      (signupPassword.length >= 6 ? 1 : 0) +
                      (/[A-Z]/.test(signupPassword) ? 1 : 0) +
                      (/[0-9]/.test(signupPassword) ? 1 : 0) +
                      (/[^A-Za-z0-9]/.test(signupPassword) ? 1 : 0)
                    );
                    return ["", "Weak", "Fair", "Good", "Strong"][s];
                  })()}
                </span>
              </div>
            )}

            <button
              type="submit"
              id="signup-submit"
              disabled={loading}
              className="btn-primary login-submit-btn"
            >
              {loading
                ? <><SpinnerIcon /><span>Creating account…</span></>
                : <span>Create Account</span>
              }
            </button>

            {/* Divider */}
            <div className="login-divider">
              <span />
              <p>or sign up with</p>
              <span />
            </div>

            <button
              type="button"
              id="signup-google"
              onClick={handleGoogleLogin}
              className="login-oauth-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <p className="login-switch-hint">
              Already have an account?{" "}
              <button type="button" id="signup-goto-login" onClick={() => switchTab("login")} className="login-link-btn">
                Sign in
              </button>
            </p>
          </form>
        )}

        {/* Terms */}
        <p className="login-terms">
          By continuing you agree to our{" "}
          <button type="button" id="link-terms" className="login-link-btn" onClick={() => alert("Terms of Service — coming soon.")}>Terms</button>
          {" "}and{" "}
          <button type="button" id="link-privacy" className="login-link-btn" onClick={() => alert("Privacy Policy — coming soon.")}>Privacy Policy</button>.
        </p>
      </div>

      {/* Right-side feature highlights (desktop only) */}
      <aside className="login-aside" aria-hidden>
        <div className="login-aside-inner">
          <h2 className="login-aside-title">
            Master AI &amp; ML<br />
            <span className="gradient-text">the interactive way</span>
          </h2>
          <ul className="login-features">
            {[
              { icon: "◎", color: "var(--cyan)",   title: "Live Simulations",    desc: "Run real ML algorithms in your browser" },
              { icon: "✦", color: "var(--purple)", title: "Adaptive Quizzes",    desc: "Get smarter questions as you level-up" },
              { icon: "◈", color: "var(--coral)",  title: "Mini-game Learning",  desc: "Concepts taught through interactive games" },
              { icon: "⌨", color: "var(--green)",  title: "Code Playground",     desc: "Write & execute Python-style pseudocode" },
            ].map(f => (
              <li key={f.title} className="login-feature-item">
                <span className="login-feature-icon" style={{ color: f.color }}>{f.icon}</span>
                <div>
                  <p className="login-feature-title">{f.title}</p>
                  <p className="login-feature-desc">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="login-aside-stats">
            {[["10K+","Learners"],["50+","Modules"],["4.9★","Rating"]].map(([v,l]) => (
              <div key={l} className="login-stat">
                <span className="login-stat-val gradient-text">{v}</span>
                <span className="login-stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
