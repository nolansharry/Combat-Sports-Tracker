import { useState, useEffect, useRef, useCallback } from "react";
import { SPORTS } from "../constants";
import { fmt, uid } from "../utils";

function Knob({ label, value, min, max, onChange }) {
  return (
    <div className="knob">
      <span className="knob-label">{label}</span>
      <div className="knob-row">
        <button className="knob-btn" onClick={() => onChange(Math.max(min, value - 1))}>−</button>
        <span className="knob-val">{value}</span>
        <button className="knob-btn" onClick={() => onChange(Math.min(max, value + 1))}>+</button>
      </div>
    </div>
  );
}

export default function TimerPage({ onSave, loadedTimer, onClearLoaded }) {
  const sportFromId = (id) => SPORTS.find(s => s.id === id) || SPORTS[0];

  const [sport,    setSport]    = useState(loadedTimer ? sportFromId(loadedTimer.sport) : SPORTS[0]);
  const [rounds,   setRounds]   = useState(loadedTimer ? loadedTimer.rounds   : 5);
  const [roundLen, setRoundLen] = useState(loadedTimer ? loadedTimer.roundLen : 5);
  const [restLen,  setRestLen]  = useState(loadedTimer ? loadedTimer.restLen  : 60);
  const [title,    setTitle]    = useState(loadedTimer ? loadedTimer.title    : "");
  const [saved,        setSaved]        = useState(false);
  const [loadedBanner, setLoadedBanner] = useState(!!loadedTimer);

  const [running,      setRunning]      = useState(false);
  const [phase,        setPhase]        = useState("round");
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft,     setTimeLeft]     = useState((loadedTimer ? loadedTimer.roundLen : 5) * 60);
  const [started,      setStarted]      = useState(false);
  const intervalRef = useRef(null);

  const totalRounds = rounds;

  useEffect(() => {
    if (loadedBanner) {
      const t = setTimeout(() => setLoadedBanner(false), 3000);
      return () => clearTimeout(t);
    }
  }, [loadedBanner]);

  useEffect(() => {
    if (!running) {
      setPhase("round");
      setCurrentRound(1);
      setTimeLeft(roundLen * 60);
      setStarted(false);
    }
  }, [roundLen, restLen, rounds]);

  const tick = useCallback(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        setPhase(ph => {
          if (ph === "round") {
            if (currentRound >= totalRounds) {
              clearInterval(intervalRef.current);
              setRunning(false);
              setPhase("done");
              return "done";
            }
            setCurrentRound(r => r + 1);
            setTimeout(() => setTimeLeft(restLen), 0);
            return "rest";
          } else {
            setTimeout(() => setTimeLeft(roundLen * 60), 0);
            return "round";
          }
        });
        return 0;
      }
      return prev - 1;
    });
  }, [currentRound, totalRounds, roundLen, restLen]);

  useEffect(() => {
    if (running) { intervalRef.current = setInterval(tick, 1000); }
    else         { clearInterval(intervalRef.current); }
    return () => clearInterval(intervalRef.current);
  }, [running, tick]);

  const startStop = () => {
    if (phase === "done") return;
    if (!started) setStarted(true);
    setRunning(r => !r);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setStarted(false);
    setPhase("round");
    setCurrentRound(1);
    setTimeLeft(roundLen * 60);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ id: uid(), type: "timer", title: title.trim(), sport: sport.id, rounds, roundLen, restLen, createdAt: new Date().toISOString() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const phaseColor    = phase === "round" ? sport.color : phase === "rest" ? "#555" : "#2ecc71";
  const progress      = phase === "round" ? timeLeft / (roundLen * 60) : phase === "rest" ? timeLeft / restLen : 0;
  const circumference = 2 * Math.PI * 110;

  return (
    <div className="page">
      <h2 className="page-title">Timer Builder</h2>

      {loadedBanner && (
        <div className="loaded-banner">✓ Loaded: <strong>{loadedTimer?.title}</strong></div>
      )}

      <div className="sport-grid">
        {SPORTS.map(s => (
          <button key={s.id} className={`sport-btn ${sport.id === s.id ? "active" : ""}`}
            style={{ "--sc": s.color }} onClick={() => { setSport(s); onClearLoaded?.(); }}>
            <span className="sport-icon">{s.icon}</span>
            <span className="sport-label">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="config-grid">
        <Knob label="Rounds"      value={rounds}   min={1} max={20} onChange={v => { setRounds(v);   onClearLoaded?.(); }} />
        <Knob label="Round (min)" value={roundLen} min={1} max={20} onChange={v => { setRoundLen(v); onClearLoaded?.(); }} />
        <Knob label="Rest (sec)"  value={restLen}  min={0} max={300} onChange={v => { setRestLen(v);  onClearLoaded?.(); }} />
      </div>

      <div className="timer-stage">
        <div className="timer-ring-wrap">
          <svg viewBox="0 0 240 240" className="timer-ring">
            <circle cx="120" cy="120" r="110" className="ring-bg" />
            <circle cx="120" cy="120" r="110" className="ring-fg"
              stroke={phaseColor}
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }} />
          </svg>
          <div className="timer-inner">
            {phase === "done" ? (
              <div className="done-txt">DONE!</div>
            ) : (
              <>
                <div className="timer-phase" style={{ color: phaseColor }}>
                  {phase === "round" ? `Round ${currentRound}/${totalRounds}` : "Rest"}
                </div>
                <div className="timer-time">{fmt(timeLeft)}</div>
              </>
            )}
          </div>
        </div>
        <div className="timer-controls">
          <button className="ctrl-btn reset" onClick={reset}>↺</button>
          <button className="ctrl-btn play" style={{ background: sport.color }} onClick={startStop} disabled={phase === "done"}>
            {running ? "⏸" : "▶"}
          </button>
        </div>
      </div>

      <div className="save-section">
        <input className="save-input" placeholder="Name this timer…" value={title} onChange={e => setTitle(e.target.value)} />
        <button className="save-btn" onClick={handleSave} disabled={!title.trim()}>
          {saved ? "✓ Saved!" : "Save Timer"}
        </button>
      </div>
    </div>
  );
}
