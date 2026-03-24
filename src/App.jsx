import { useState, useEffect } from "react";
import { getUsers, saveUsers, getSession, saveSession } from "./utils";
import AuthScreen from "./components/AuthScreen";
import Nav        from "./components/Nav";
import TimerPage  from "./pages/TimerPage";
import LogPage    from "./pages/LogPage";
import SavedPage  from "./pages/SavedPage";
import "./styles.css";

export default function App() {
  const [user,               setUser]               = useState(null);
  const [page,               setPage]               = useState("timer");
  const [timers,             setTimers]             = useState([]);
  const [workouts,           setWorkouts]           = useState([]);
  const [loadedTimer,        setLoadedTimer]        = useState(null);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  useEffect(() => {
    const email = getSession();
    if (email) {
      const users = getUsers();
      if (users[email]) {
        setUser(users[email]);
        setTimers(users[email].timers    || []);
        setWorkouts(users[email].workouts || []);
      }
    }
  }, []);

  const login = (u) => {
    setUser(u);
    setTimers(u.timers || []);
    setWorkouts(u.workouts || []);
  };

  const logout = () => {
    saveSession(null);
    setUser(null);
    setTimers([]);
    setWorkouts([]);
    setLoadedTimer(null);
    setShowSignOutConfirm(false);
  };

  const persist = (email, newTimers, newWorkouts) => {
    const users = getUsers();
    users[email] = { ...users[email], timers: newTimers, workouts: newWorkouts };
    saveUsers(users);
  };

  const saveTimer   = (t) => { const next = [...timers,   t]; setTimers(next);   persist(user.email, next, workouts); };
  const saveWorkout = (w) => { const next = [...workouts, w]; setWorkouts(next); persist(user.email, timers, next);   };

  const deleteItem = (id, type) => {
    if (type === "timer") {
      const next = timers.filter(t => t.id !== id);
      setTimers(next); persist(user.email, next, workouts);
    } else {
      const next = workouts.filter(w => w.id !== id);
      setWorkouts(next); persist(user.email, timers, next);
    }
  };

  const handleLoadTimer = (t) => { setLoadedTimer(t); setPage("timer"); };

  if (!user) return <AuthScreen onLogin={login} />;

  return (
    <div className="app-shell">
      <header className="top-bar">
        <span className="brand-icon small">⚡</span>
        <span className="brand-name small">COMBAT SPORTS TRACKER</span>
        <span className="user-name">{user.name}</span>
        <div className="signout-wrap">
          {showSignOutConfirm ? (
            <div className="signout-confirm">
              <span className="signout-confirm-txt">Sign out?</span>
              <button className="signout-yes" onClick={logout}>Yes</button>
              <button className="signout-no" onClick={() => setShowSignOutConfirm(false)}>No</button>
            </div>
          ) : (
            <button className="signout-btn" onClick={() => setShowSignOutConfirm(true)} title="Sign out">→|</button>
          )}
        </div>
      </header>

      <main className="main-content">
        {page === "timer" && <TimerPage onSave={saveTimer} loadedTimer={loadedTimer} onClearLoaded={() => setLoadedTimer(null)} />}
        {page === "log"   && <LogPage   onSave={saveWorkout} />}
        {page === "saved" && <SavedPage timers={timers} workouts={workouts} onDelete={deleteItem} onLoadTimer={handleLoadTimer} />}
      </main>

      <Nav page={page} setPage={setPage} />
    </div>
  );
}
