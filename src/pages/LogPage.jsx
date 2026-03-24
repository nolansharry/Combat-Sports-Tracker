import { useState } from "react";
import { SPORTS } from "../constants";
import { uid } from "../utils";

export default function LogPage({ onSave }) {
  const [title,    setTitle]    = useState("");
  const [duration, setDuration] = useState("");
  const [notes,    setNotes]    = useState("");
  const [sport,    setSport]    = useState(SPORTS[0]);
  const [saved,    setSaved]    = useState(false);
  const [err,      setErr]      = useState("");

  const handleSave = () => {
    if (!title.trim() || !duration) return setErr("Title and duration required.");
    setErr("");
    onSave({
      id: uid(), type: "workout", title: title.trim(),
      sport: sport.id, duration: Number(duration), notes,
      createdAt: new Date().toISOString(),
    });
    setTitle(""); setDuration(""); setNotes("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page">
      <h2 className="page-title">Log Workout</h2>

      <div className="sport-grid">
        {SPORTS.map(s => (
          <button key={s.id} className={`sport-btn ${sport.id === s.id ? "active" : ""}`}
            style={{ "--sc": s.color }} onClick={() => setSport(s)}>
            <span className="sport-icon">{s.icon}</span>
            <span className="sport-label">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="log-form">
        <label className="log-label">Workout Title</label>
        <input className="log-input" placeholder="e.g. Morning Drilling Session" value={title} onChange={e => setTitle(e.target.value)} />

        <label className="log-label">Duration (minutes)</label>
        <input className="log-input" type="number" min="1" placeholder="e.g. 90" value={duration} onChange={e => setDuration(e.target.value)} />

        <label className="log-label">What did you work on?</label>
        <textarea className="log-textarea"
          placeholder="Describe your session… techniques drilled, sparring notes, conditioning work, etc."
          value={notes} onChange={e => setNotes(e.target.value)} rows={6} />

        {err && <p className="auth-err">{err}</p>}
        <button className="save-btn full" onClick={handleSave}>
          {saved ? "✓ Workout Logged!" : "Log Workout"}
        </button>
      </div>
    </div>
  );
}
