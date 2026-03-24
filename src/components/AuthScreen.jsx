import { useState } from "react";
import { getUsers, saveUsers, saveSession } from "../utils";

export default function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [err, setErr]     = useState("");

  const submit = () => {
    setErr("");
    if (!email || !pass) return setErr("All fields required.");
    const users = getUsers();
    if (mode === "signup") {
      if (!name) return setErr("Name required.");
      if (users[email]) return setErr("Account exists. Sign in instead.");
      users[email] = { name, email, pass, timers: [], workouts: [] };
      saveUsers(users);
      saveSession(email);
      onLogin(users[email]);
    } else {
      const u = users[email];
      if (!u || u.pass !== pass) return setErr("Invalid credentials.");
      saveSession(email);
      onLogin(u);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand">
          
          <span className="brand-name">COMBAT SPORTS TRACKER</span>
        </div>
        <p className="auth-sub">Combat Sports Training Hub</p>
        <div className="auth-tabs">
          <button className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setErr(""); }}>Sign In</button>
          <button className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); setErr(""); }}>Sign Up</button>
        </div>
        {mode === "signup" && (
          <input className="auth-input" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
        )}
        <input className="auth-input" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="auth-input" placeholder="Password" type="password" value={pass} onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()} />
        {err && <p className="auth-err">{err}</p>}
        <button className="auth-btn" onClick={submit}>{mode === "login" ? "Enter" : "Create Account"}</button>
      </div>
    </div>
  );
}
