/** @format */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  readSession,
  readUsers,
  writeSession,
  writeUsers,
} from "../storage/quizAppStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readSession());
  const [usersVersion, setUsersVersion] = useState(0);

  const user = useMemo(() => {
    if (!session?.username) return null;
    const users = readUsers();
    return users[session.username] ?? null;
  }, [session, usersVersion]);

  const refreshUsers = useCallback(() => {
    setUsersVersion((v) => v + 1);
  }, []);

  const login = useCallback((username) => {
    const u = String(username).trim();
    if (!u) return { ok: false, error: "Indica un nombre de usuario." };
    const users = readUsers();
    if (!users[u]) {
      return { ok: false, error: "No existe ninguna cuenta con ese usuario." };
    }
    writeSession({ username: u });
    setSession(readSession());
    return { ok: true };
  }, []);

  const register = useCallback((name, username) => {
    const n = String(name).trim();
    const u = String(username).trim();
    if (!n) return { ok: false, error: "Indica tu nombre." };
    if (!u) return { ok: false, error: "Indica un nombre de usuario." };
    const users = readUsers();
    if (users[u]) {
      return {
        ok: false,
        error: "Ese nombre de usuario ya existe. Prueba a entrar o elige otro.",
      };
    }
    users[u] = { name: n, username: u };
    writeUsers(users);
    writeSession({ username: u });
    setSession(readSession());
    refreshUsers();
    return { ok: true };
  }, [refreshUsers]);

  const logout = useCallback(() => {
    writeSession(null);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }),
    [user, session, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
}
