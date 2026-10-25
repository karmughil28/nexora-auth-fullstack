import { Navigate, useNavigate } from "react-router-dom";
import { clearSession, readSession } from "../lib/auth.js";

export default function Dashboard() {
  const navigate = useNavigate();
  const session = readSession();
  const user = session?.user;

  // Demo-only route check. Real apps must authorize protected API requests on the server.
  if (!user) return <Navigate to="/" replace />;

  function handleLogout() {
    clearSession();
    navigate("/", { replace: true });
  }

  const firstName = user.name?.trim().split(/\s+/)[0] || "there";

  return (
    <main className="dashboard-shell">
      <header className="dashboard-nav">
        <a className="brand dashboard-brand" href="/" onClick={(e) => e.preventDefault()}><span className="brand-mark">N</span><span>nexora<span className="brand-dot">.</span></span></a>
        <div className="nav-user"><span className="nav-avatar">{firstName.charAt(0).toUpperCase()}</span><span className="nav-user-name">{user.name}</span><button className="logout-button" onClick={handleLogout}>Sign out <span>↗</span></button></div>
      </header>
      <section className="dashboard-content">
        <div className="dashboard-eyebrow"><span /> YOUR PERSONAL WORKSPACE</div>
        <h1>Welcome,<br /><span>{firstName}.</span></h1>
        <p className="dashboard-intro">Your Nexora space is ready. This dashboard confirms your account was created or authenticated by the backend.</p>
        <div className="dashboard-grid">
          <article className="dash-card feature-card"><div className="card-icon purple-icon">✳</div><span className="card-label">YOUR WORKSPACE</span><h2>A fresh start.</h2><p>Your space is ready for the ideas, plans, and projects you want to move forward.</p><span className="card-link">Explore your space <span>→</span></span></article>
          <article className="dash-card"><div className="card-icon green-icon">✓</div><span className="card-label">ACCOUNT STATUS</span><h2>You're all set.</h2><p>Your account details were accepted by the Nexora Express API.</p><span className="status-pill"><i /> Signed in</span></article>
          <article className="dash-card bottom-card"><span className="card-label">ACCOUNT DETAILS</span><h2 className="user-email">{user.name}</h2><p>{user.email}</p><p className="account-meta">Created: {user.createdAt ? new Date(user.createdAt).toLocaleString() : "Demo session"}</p></article>
        </div>
        <p className="demo-disclaimer">Learning demo · Account data is stored in the backend's local JSON file. Do not use real or sensitive information.</p>
      </section>
    </main>
  );
}
