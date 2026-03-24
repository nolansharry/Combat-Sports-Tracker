import { USERS_KEY, SESSION_KEY } from "./constants";

const storage = {
  get: (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};

export function getUsers()     { return storage.get(USERS_KEY) || {}; }
export function saveUsers(u)   { storage.set(USERS_KEY, u); }
export function getSession()   { return storage.get(SESSION_KEY) || null; }
export function saveSession(u) { storage.set(SESSION_KEY, u); }

export function fmt(s) {
  const m  = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}

export function uid() { return Math.random().toString(36).slice(2, 9); }
