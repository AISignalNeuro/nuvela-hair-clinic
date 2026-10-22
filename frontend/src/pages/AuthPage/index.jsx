import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Seo from "../../components/ui/Seo.jsx";
import Icon from "../../components/ui/Icon.jsx";
import Logo from "../../components/ui/Logo.jsx";
import IstanbulSkyline from "../../components/ui/IstanbulSkyline.jsx";
import LocalizedLink from "../../components/ui/LocalizedLink.jsx";
import { Field } from "../../components/booking/fields.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useUI } from "../../context/UIContext.jsx";
import { APP, DEMO_OTP_CODE, isDemoMode } from "../../config/app.js";
import { isValidPhone } from "../../utils/contact.js";

export default function AuthPage() {
  const { t, content, localePath } = useI18n();
  const { isAuthenticated, requestOtp, verifyOtp, loginWithGoogle } = useAuth();
  const { toast } = useUI();
  const navigate = useNavigate();
  const [tab, setTab] = useState("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState("phone");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const googleBtn = useRef(null);

  useEffect(() => {
    if (isAuthenticated) navigate(localePath("/profile"), { replace: true });
  }, [isAuthenticated, navigate, localePath]);

  // Real Google Identity Services button when a client id is configured and an API is connected.
  useEffect(() => {
    if (tab !== "google" || isDemoMode || !APP.googleClientId) return undefined;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: APP.googleClientId,
        callback: async ({ credential }) => {
          try {
            const user = await loginWithGoogle(credential);
            toast(t("auth.welcome", { name: user.fullName || t("profile.guest") }));
          } catch {
            setError(t("booking.errorText"));
          }
        },
      });
      window.google?.accounts.id.renderButton(googleBtn.current, { theme: "outline", size: "large", width: 320 });
    };
    document.head.appendChild(script);
    return () => script.remove();
  }, [tab, loginWithGoogle, toast, t]);

  const sendCode = async (e) => {
    e.preventDefault();
    if (!isValidPhone(phone)) return setError(t("auth.invalidPhone"));
    setError("");
    setBusy(true);
    try {
      await requestOtp(phone.trim());
      setStage("code");
    } catch {
      setError(t("booking.errorText"));
    } finally {
      setBusy(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const user = await verifyOtp(phone.trim(), code.trim());
      toast(t("auth.welcome", { name: user.fullName || t("profile.guest") }));
    } catch {
      setError(t("auth.invalidCode"));
    } finally {
      setBusy(false);
    }
  };

  const demoGoogle = async () => {
    setBusy(true);
    const user = await loginWithGoogle("demo");
    toast(t("auth.welcome", { name: user.fullName || t("profile.guest") }));
  };

  return (
    <>
      <Seo title={content.pages.authPage.seoTitle} path="/auth" noindex />
      <section className="auth-page">
        <div className="hero-aurora" aria-hidden="true">
          <span className="aurora aurora--1" />
          <span className="aurora aurora--2" />
        </div>
        <IstanbulSkyline className="auth-skyline" />
        <motion.div className="auth-card" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}>
          <LocalizedLink to="/" className="auth-logo">
            <Logo size={42} />
          </LocalizedLink>
          <h1>{t("auth.title")}</h1>
          <p className="muted">{t("auth.subtitle")}</p>

          <div className="segmented" role="tablist">
            {["phone", "google"].map((key) => (
              <button key={key} type="button" role="tab" aria-selected={tab === key} className={tab === key ? "is-active" : ""} onClick={() => { setTab(key); setError(""); }}>
                <Icon name={key === "phone" ? "phone" : "google"} size={16} /> {t(`auth.${key}Tab`)}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "phone" ? (
              <motion.div key={`phone-${stage}`} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                {stage === "phone" ? (
                  <form onSubmit={sendCode} noValidate>
                    <Field label={t("auth.phoneLabel")} htmlFor="auth-phone" error={error}>
                      <input id="auth-phone" type="tel" dir="ltr" autoComplete="tel" inputMode="tel" placeholder="+90 5xx xxx xx xx" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </Field>
                    <button type="submit" className="btn btn-primary w-100" disabled={busy}>
                      {busy && <span className="spinner" aria-hidden="true" />} {t("auth.sendCode")}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={verify} noValidate>
                    <p className="auth-sent">{t("auth.codeSent", { phone })}</p>
                    <Field label={t("auth.codeLabel")} htmlFor="auth-code" error={error}>
                      <input id="auth-code" className="otp-input" dir="ltr" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} />
                    </Field>
                    {isDemoMode && <p className="demo-note"><Icon name="info" size={14} /> {t("auth.demoCode", { code: DEMO_OTP_CODE })}</p>}
                    <button type="submit" className="btn btn-primary w-100" disabled={busy || code.length !== 6}>
                      {busy && <span className="spinner" aria-hidden="true" />} {t("auth.verify")}
                    </button>
                    <div className="auth-links">
                      <button type="button" className="link-btn" onClick={() => { setStage("phone"); setCode(""); }}>
                        {t("auth.changeNumber")}
                      </button>
                      <button type="button" className="link-btn" onClick={sendCode}>
                        {t("auth.resend")}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            ) : (
              <motion.div key="google" className="auth-google" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                {!isDemoMode && APP.googleClientId ? (
                  <div ref={googleBtn} className="google-slot" />
                ) : (
                  <button type="button" className="btn btn-google w-100" onClick={demoGoogle} disabled={busy}>
                    <Icon name="google" size={18} /> {t("auth.google")}
                  </button>
                )}
                <p className="muted small">{t("auth.googleHint")}</p>
                {error && <p className="field-error">{error}</p>}
              </motion.div>
            )}
          </AnimatePresence>
          <p className="auth-terms">
            <Icon name="lock" size={14} /> {t("auth.terms")}
          </p>
        </motion.div>
      </section>
    </>
  );
}
