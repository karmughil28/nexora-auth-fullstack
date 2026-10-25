import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { saveSession } from "../lib/auth.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password || !confirmPassword) return setError("Please fill in all fields.");
    if (name.trim().length > 80) return setError("Name must be 80 characters or fewer.");
    if (!emailPattern.test(email.trim())) return setError("Please enter a valid email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters long.");
    if (password.length > 128) return setError("Password must be 128 characters or fewer.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/signup", { name: name.trim(), email: email.trim(), password });
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
      <section className="welcome-panel signup-welcome">
        <Link className="brand" to="/"><span className="brand-mark">N</span><span>nexora<span className="brand-dot">.</span></span></Link>
        <div className="welcome-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> A BETTER WAY TO WORK</div>
          <h1>Your next chapter<br />starts <span>here.</span></h1>
          <p>Create your free demo account and make a little space for your next big idea.</p>
        </div>
        <div className="panel-bottom"><div className="avatar-stack"><span>AR</span><span>JM</span><span>SK</span><span>+</span></div><div><strong>Built for your next big thing.</strong><small>Simple tools. Clearer days.</small></div></div>
        <div className="decor decor-one" /><div className="decor decor-two" />
      </section>
      <section className="form-panel signup-form-panel">
        <div className="mobile-brand"><span className="brand-mark">N</span><span>nexora<span className="brand-dot">.</span></span></div>
        <div className="form-wrap">
          <div className="form-heading"><span className="welcome-tag">GET STARTED — IT'S FREE</span><h2>Create your account</h2><p>Just a few details and you're ready to go.</p></div>
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="name">Full name</label>
            <div className="input-wrap"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c.7-4 3.1-6 7.5-6s6.8 2 7.5 6"/></svg><input id="name" type="text" autoComplete="name" placeholder="Your full name" value={name} onChange={(e) => { setName(e.target.value); setError(""); }} /></div>
            <div className="signup-field"><label htmlFor="signup-email">Email address</label><div className="input-wrap"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="m4.5 7 7.5 6 7.5-6"/></svg><input id="signup-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} /></div></div>
            <div className="signup-field"><div className="password-label-row"><label htmlFor="signup-password">Password</label><span className="secure-note">8+ characters</span></div><div className="input-wrap"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="10" width="15" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg><input id="signup-password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Create a password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} /><button className="show-password" type="button" onClick={() => setShowPassword((v) => !v)}>{showPassword ? "Hide" : "Show"}</button></div></div>
            <div className="signup-field"><label htmlFor="confirm-password">Confirm password</label><div className="input-wrap"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="10" width="15" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg><input id="confirm-password" type="password" autoComplete="new-password" placeholder="Re-enter your password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }} /></div></div>
            {error && <div className="error-message" role="alert">{error}</div>}
            <button className="submit-button signup-submit" type="submit" disabled={loading}>{loading ? <><span className="spinner" /> Creating account...</> : <>Create account <span>→</span></>}</button>
          </form>
          <div className="form-switch">Already have an account? <Link to="/">Sign in</Link></div>
          <p className="terms">By creating an account, you agree to our <span>Terms</span> and <span>Privacy Policy</span>.</p>
        </div>
        <footer className="form-footer"><span>© 2026 Nexora Studio</span><span><i /> All systems operational</span></footer>
      </section>
    </main>
  );
}
