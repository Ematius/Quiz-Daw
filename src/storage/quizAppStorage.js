/** @format */

export const LS_USERS = "quiz_app_users";
export const LS_SESSION = "quiz_app_session";
export const LS_COMPLETIONS = "quiz_app_completions";

function safeParse(json, fallback) {
  try {
    if (json == null || json === "") return fallback;
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export function readUsers() {
  return safeParse(localStorage.getItem(LS_USERS), {});
}

export function writeUsers(users) {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

export function readSession() {
  return safeParse(localStorage.getItem(LS_SESSION), null);
}

export function writeSession(session) {
  if (session == null) {
    localStorage.removeItem(LS_SESSION);
  } else {
    localStorage.setItem(LS_SESSION, JSON.stringify(session));
  }
}

export function readCompletions() {
  return safeParse(localStorage.getItem(LS_COMPLETIONS), {});
}

export function writeCompletions(data) {
  localStorage.setItem(LS_COMPLETIONS, JSON.stringify(data));
}

export function recordTopicCompletion(username, moduloId, topicId) {
  const u = String(username).trim();
  const m = String(moduloId).trim();
  const t = String(topicId).trim();
  if (!u || !m || !t) return;

  const all = readCompletions();
  if (!all[u]) all[u] = {};
  if (!all[u][m]) all[u][m] = {};
  const prev = all[u][m][t] ?? 0;
  all[u][m][t] = prev + 1;
  writeCompletions(all);
}

