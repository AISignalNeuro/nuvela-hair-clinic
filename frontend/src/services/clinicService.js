// Booking, contact and account requests. Each call uses the real API when
// VITE_API_URL is configured and an in-browser demo fallback otherwise.
import { apiRequest, tokenStore } from "./apiClient.js";
import { delay, demoStore } from "./demoStore.js";
import { DEMO_OTP_CODE, isDemoMode } from "../config/app.js";

export async function createAppointment(payload, lang) {
  if (isDemoMode) {
    await delay(700);
    return demoStore.addAppointment(payload);
  }
  return apiRequest("/appointments", { method: "POST", body: payload, auth: true, lang });
}

export async function listMyAppointments(user) {
  if (isDemoMode) return demoStore.listAppointments(user?.phone);
  return apiRequest("/appointments/my", { auth: true });
}

export async function sendContactMessage(payload, lang) {
  if (isDemoMode) {
    await delay(600);
    return demoStore.addLead(payload);
  }
  return apiRequest("/contact", { method: "POST", body: payload, lang });
}

// --- Auth -------------------------------------------------------------------
export async function requestOtp(phone) {
  if (isDemoMode) {
    await delay(600);
    return { sent: true, demoCode: DEMO_OTP_CODE };
  }
  return apiRequest("/auth/request-otp", { method: "POST", body: { phone } });
}

export async function verifyOtp(phone, code) {
  if (isDemoMode) {
    await delay(500);
    if (code !== DEMO_OTP_CODE) throw new Error("invalid_code");
    const session = {
      user: { id: "demo-user", phone, fullName: null, email: null, role: "PATIENT", createdAt: new Date().toISOString() },
      accessToken: "demo",
      refreshToken: "demo",
    };
    tokenStore.set(session);
    return session;
  }
  const session = await apiRequest("/auth/verify-otp", { method: "POST", body: { phone, code } });
  tokenStore.set(session);
  return session;
}

export async function loginWithGoogle(idToken) {
  if (isDemoMode) {
    await delay(500);
    const session = {
      user: { id: "demo-google", fullName: "Demo Patient", email: "demo.patient@example.com", role: "PATIENT", createdAt: new Date().toISOString() },
      accessToken: "demo",
      refreshToken: "demo",
    };
    tokenStore.set(session);
    return session;
  }
  const session = await apiRequest("/auth/google", { method: "POST", body: { idToken } });
  tokenStore.set(session);
  return session;
}

export async function fetchMe() {
  const session = tokenStore.get();
  if (!session) return null;
  if (isDemoMode) return session.user;
  const user = await apiRequest("/auth/me", { auth: true });
  tokenStore.set({ ...session, user });
  return user;
}

export async function logout() {
  const session = tokenStore.get();
  tokenStore.set(null);
  if (!isDemoMode && session?.refreshToken) {
    await apiRequest("/auth/logout", { method: "POST", body: { refreshToken: session.refreshToken } }).catch(() => {});
  }
}
