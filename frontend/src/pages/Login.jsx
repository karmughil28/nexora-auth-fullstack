import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { saveSession } from "../lib/auth.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) return setError("Please enter both your email and password.");
    if (!emailPattern.test(email.trim())) return setError("Please enter a valid email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters long.");

    setLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`,{ email: email.trim(), password});
      saveSession(data);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="welcome-panel">
        <Link className="brand" to="/"><span className="brand-mark">N</span><span>nexora<span className="brand-dot">.</span></span></Link>
        <div className="welcome-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> YOUR WORKSPACE, REIMAGINED</div>
          <h1>Make room for<br /><span>what matters.</span></h1>
          <p>A calmer place to focus, find your flow, and move your best work forward.</p>
        </div>
        <div className="panel-bottom"><div className="avatar-stack"><span>AR</span><span>JM</span><span>SK</span><span>+</span></div><div><strong>Good things happen together.</strong><small>One workspace. More possibilities.</small></div></div>
        <div className="decor decor-one" /><div className="decor decor-two" />
      </section>
      <section className="form-panel">
        <div className="mobile-brand"><span className="brand-mark">N</span><span>nexora<span className="brand-dot">.</span></span></div>
        <div className="form-wrap">
          <div className="form-heading"><span className="welcome-tag">WELCOME BACK</span><h2>Sign in to Nexora</h2><p>Enter your details below to access your workspace.</p></div>
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="email">Email address</label>
            <div className="input-wrap"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="m4.5 7 7.5 6 7.5-6"/></svg><input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} /></div>
            <div className="password-label-row"><label htmlFor="password">Password</label><span className="secure-note">Keep it secure</span></div>
            <div className="input-wrap"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="10" width="15" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg><input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} /><button className="show-password" type="button" onClick={() => setShowPassword((v) => !v)}>{showPassword ? "Hide" : "Show"}</button></div>
            {error && <div className="error-message" role="alert">{error}</div>}
            <button className="submit-button" type="submit" disabled={loading}>{loading ? <><span className="spinner" /> Signing in...</> : <>Sign in <span>→</span></>}</button>
          </form>
          <div className="form-switch">New to Nexora? <Link to="/signup">Create an account</Link></div>
          <p className="terms">By continuing, you agree to our <span>Terms</span> and <span>Privacy Policy</span>.</p>
        </div>
        <footer className="form-footer"><span>© 2026 Nexora Studio</span><span><i /> All systems operational</span></footer>
      </section>
    </main>
  );
}
