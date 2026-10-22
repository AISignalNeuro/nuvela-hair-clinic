import { forwardRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useI18n } from "../../i18n/I18nProvider.jsx";

// <Link> that automatically prefixes the active language: to="/services" → "/tr/services".
export const LocalizedLink = forwardRef(function LocalizedLink({ to, ...props }, ref) {
  const { localePath } = useI18n();
  return <Link ref={ref} to={typeof to === "string" ? localePath(to) : to} {...props} />;
});

export const LocalizedNavLink = forwardRef(function LocalizedNavLink({ to, ...props }, ref) {
  const { localePath } = useI18n();
  return <NavLink ref={ref} to={localePath(to)} end={to === "/"} {...props} />;
});

export default LocalizedLink;
