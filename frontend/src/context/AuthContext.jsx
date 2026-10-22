import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { tokenStore } from "../services/apiClient.js";
import * as api from "../services/clinicService.js";

// Patient session: phone OTP or Google sign-in, persisted tokens, refresh handled by apiClient.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStore.get()?.user ?? null);
  const [ready, setReady] = useState(!tokenStore.get());

  useEffect(() => {
    if (!tokenStore.get()) return;
    api
      .fetchMe()
      .then((me) => setUser(me))
      .catch(() => {
        tokenStore.set(null);
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const verifyOtp = useCallback(async (phone, code) => {
    const session = await api.verifyOtp(phone, code);
    setUser(session.user);
    return session.user;
  }, []);

  const loginWithGoogle = useCallback(async (idToken) => {
    const session = await api.loginWithGoogle(idToken);
    setUser(session.user);
    return session.user;
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, isAuthenticated: !!user, requestOtp: api.requestOtp, verifyOtp, loginWithGoogle, logout }),
    [user, ready, verifyOtp, loginWithGoogle, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
