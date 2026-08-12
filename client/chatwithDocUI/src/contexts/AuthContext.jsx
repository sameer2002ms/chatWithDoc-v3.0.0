import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/authApi";
import { tokenStorage, setSessionExpiredHandler } from "../api/axios";

export const AuthContext = createContext(null);

function readUserFromToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.user_id ?? payload.id ?? null,
      username: payload.username ?? payload.sub ?? "User",
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readUserFromToken(tokenStorage.getAccess()));
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(tokenStorage.getAccess()));
  const [isInitializing, setIsInitializing] = useState(true);

  const logout = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      try {
        await authApi.logout();
      } catch {
        // Token may already be invalid; clear local state regardless.
      }
    } else {
      tokenStorage.clear();
    }
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      setUser(null);
      setIsAuthenticated(false);
    });
    setIsInitializing(false);
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    const nextUser = readUserFromToken(data.access) ?? { username: credentials.username };
    setUser(nextUser);
    setIsAuthenticated(true);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    return authApi.register(payload);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated, isInitializing, login, register, logout }),
    [user, isAuthenticated, isInitializing, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
