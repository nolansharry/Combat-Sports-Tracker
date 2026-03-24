export default function Nav({ page, setPage }) {
  return (
    <nav className="bottom-nav">
      <button className={page === "timer" ? "nav-btn active" : "nav-btn"} onClick={() => setPage("timer")}>
        <span className="nav-icon">⏱</span>
        <span className="nav-lbl">Timer</span>
      </button>
      <button className={page === "log" ? "nav-btn active" : "nav-btn"} onClick={() => setPage("log")}>
        <span className="nav-icon">📋</span>
        <span className="nav-lbl">Log</span>
      </button>
      <button className={page === "saved" ? "nav-btn active" : "nav-btn"} onClick={() => setPage("saved")}>
        <span className="nav-icon">🗂</span>
        <span className="nav-lbl">Saved</span>
      </button>
    </nav>
  );
}
