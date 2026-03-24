import { useState } from "react";
import { SPORTS } from "../constants";

export default function SavedPage({ timers, workouts, onDelete, onLoadTimer }) {
  const [tab, setTab] = useState("workouts");
  const sportOf = (id) => SPORTS.find(s => s.id === id) || SPORTS[0];

  return (
    <div className="page">
      <h2 className="page-title">Your Records</h2>
      <div className="saved-tabs">
        <button className={tab === "workouts" ? "active" : ""} onClick={() => setTab("workouts")}>
          Workouts <span className="badge">{workouts.length}</span>
        </button>
        <button className={tab === "timers" ? "active" : ""} onClick={() => setTab("timers")}>
          Timers <span className="badge">{timers.length}</span>
        </button>
      </div>

      {tab === "workouts" && (
        <div className="card-list">
          {workouts.length === 0 && <p className="empty">No workouts logged yet.</p>}
          {[...workouts].reverse().map(w => {
            const s = sportOf(w.sport);
            return (
              <div className="record-card" key={w.id} style={{ "--sc": s.color }}>
                <div className="record-header">
                  <span className="record-sport-icon">{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div className="record-title">{w.title}</div>
                    <div className="record-meta">{s.label} · {w.duration} min · {new Date(w.createdAt).toLocaleDateString()}</div>
                  </div>
                  <button className="del-btn" onClick={() => onDelete(w.id, "workout")}>✕</button>
                </div>
                {w.notes && <p className="record-notes">{w.notes}</p>}
              </div>
            );
          })}
        </div>
      )}

      {tab === "timers" && (
        <div className="card-list">
          {timers.length === 0 && <p className="empty">No timers saved yet.</p>}
          {[...timers].reverse().map(t => {
            const s = sportOf(t.sport);
            return (
              <div className="record-card" key={t.id} style={{ "--sc": s.color }}>
                <div className="record-header">
                  <span className="record-sport-icon">{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div className="record-title">{t.title}</div>
                    <div className="record-meta">{s.label} · {t.rounds} rounds · {t.roundLen} min work / {t.restLen} sec rest</div>
                    <div className="record-meta">{new Date(t.createdAt).toLocaleDateString()}</div>
                  </div>
                  <button className="del-btn" onClick={() => onDelete(t.id, "timer")}>✕</button>
                </div>
                <button className="load-timer-btn" style={{ "--sc": s.color }} onClick={() => onLoadTimer(t)}>
                  ▶ Use This Timer
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
