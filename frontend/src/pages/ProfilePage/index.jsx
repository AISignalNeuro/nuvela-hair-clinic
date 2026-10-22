import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Seo from "../../components/ui/Seo.jsx";
import PageHero from "../../components/ui/PageHero.jsx";
import Icon from "../../components/ui/Icon.jsx";
import LocalizedLink from "../../components/ui/LocalizedLink.jsx";
import { Avatar, EmptyState } from "../../components/ui/Primitives.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { listMyAppointments } from "../../services/clinicService.js";

export default function ProfilePage() {
  const { t, content, format, localePath } = useI18n();
  const { user, ready, logout } = useAuth();
  const [requests, setRequests] = useState(null);

  useEffect(() => {
    if (!user) return;
    Promise.resolve(listMyAppointments(user))
      .then(setRequests)
      .catch(() => setRequests([]));
  }, [user]);

  if (!ready) return <div className="page-loader" aria-busy="true" />;
  if (!user) return <Navigate to={localePath("/auth")} replace />;

  const name = user.fullName || t("profile.guest");
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <Seo title={content.pages.profilePage.seoTitle} path="/profile" noindex />
      <PageHero eyebrow={t("profile.title")} title={t("profile.greeting", { name })} crumbs={[{ label: t("profile.title") }]} />
      <section className="section section--overlap">
        <div className="container profile-grid">
          <aside className="profile-card">
            <Avatar initials={initials} hue={182} size={72} />
            <h2>{name}</h2>
            <dl>
              {user.phone && (
                <div>
                  <dt><Icon name="phone" size={14} /> {t("profile.phone")}</dt>
                  <dd dir="ltr">{user.phone}</dd>
                </div>
              )}
              {user.email && (
                <div>
                  <dt><Icon name="mail" size={14} /> {t("profile.email")}</dt>
                  <dd>{user.email}</dd>
                </div>
              )}
              {user.createdAt && (
                <div>
                  <dt><Icon name="calendar" size={14} /> {t("profile.memberSince")}</dt>
                  <dd>{format.date(user.createdAt)}</dd>
                </div>
              )}
            </dl>
            <button type="button" className="btn btn-ghost w-100" onClick={logout}>
              <Icon name="logout" size={16} /> {t("profile.logout")}
            </button>
          </aside>

          <div className="profile-main">
            <div className="profile-main-head">
              <h2>{t("profile.requests")}</h2>
              <LocalizedLink to="/booking" className="btn btn-primary btn-sm">
                <Icon name="plus" size={16} /> {t("profile.newRequest")}
              </LocalizedLink>
            </div>
            {requests === null ? (
              <div className="page-loader page-loader--inline" aria-busy="true" />
            ) : requests.length === 0 ? (
              <EmptyState icon="calendar">{t("profile.noRequests")}</EmptyState>
            ) : (
              <ul className="request-list">
                {requests.map((r) => {
                  const status = (r.status ?? "pending").toLowerCase();
                  const service = content.serviceBySlug[r.serviceSlug ?? r.service?.slug];
                  return (
                    <li key={r.id ?? r.reference} className="request-item">
                      <span className="request-icon">
                        <Icon name={service?.icon ?? "calendar"} size={20} />
                      </span>
                      <div>
                        <strong>{service?.title ?? t("booking.wizard.unsure")}</strong>
                        <small dir="ltr">{r.reference ?? r.id}</small>
                      </div>
                      <span className="request-date">{format.date(r.createdAt)}</span>
                      <span className={`status-pill status-pill--${status}`}>{t(`profile.status.${status}`)}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
