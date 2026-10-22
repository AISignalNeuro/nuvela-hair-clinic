// Runtime configuration from Vite env variables (see .env.example).
const trimSlash = (s) => (s || "").replace(/\/+$/, "");

export const APP = {
  // Public URL of the deployed site (used for canonical/hreflang/OG tags and the sitemap).
  siteUrl: trimSlash(import.meta.env.VITE_SITE_URL) || "https://aisignalneuro.github.io/nuvela-hair-clinic",
  // Backend API base, e.g. http://localhost:4000/api/v1. Empty → demo mode (no network calls).
  apiUrl: trimSlash(import.meta.env.VITE_API_URL),
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
  basePath: import.meta.env.BASE_URL,
};

export const isDemoMode = !APP.apiUrl;
export const DEMO_OTP_CODE = "123456";
