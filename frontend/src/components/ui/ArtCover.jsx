import { useId } from "react";
import Icon from "./Icon.jsx";

// Generative cover art for journal posts: themed gradient + İznik-inspired tile pattern + icon.
const THEMES = {
  turquoise: ["#0B6E75", "#2BB3A8", "#BFEDE6"],
  teal: ["#0F4C5C", "#1E8C93", "#A8E0D9"],
  gold: ["#7A5418", "#C8A15A", "#F4E3BE"],
  navy: ["#0B1B2B", "#1F4B6E", "#9CC6E4"],
  rose: ["#7C2D3A", "#C9667A", "#F6D2D9"],
  sage: ["#31523F", "#6F9C7E", "#D7EBDD"],
};

export default function ArtCover({ theme = "turquoise", icon = "sparkle", label, className = "" }) {
  const uid = useId().replace(/:/g, "");
  const [deep, mid, light] = THEMES[theme] ?? THEMES.turquoise;

  return (
    <div className={`art-cover ${className}`} style={{ "--art-deep": deep, "--art-mid": mid, "--art-light": light }}>
      <svg className="art-cover-pattern" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id={`g-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={deep} />
            <stop offset="1" stopColor={mid} />
          </linearGradient>
          <pattern id={`p-${uid}`} width="52" height="52" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M26 4c6 9 6 13 0 22-6-9-6-13 0-22zM26 26c6 9 6 13 0 22-6-9-6-13 0-22z" fill={light} opacity="0.16" />
            <circle cx="0" cy="26" r="3" fill={light} opacity="0.2" />
            <circle cx="52" cy="26" r="3" fill={light} opacity="0.2" />
          </pattern>
          <radialGradient id={`glow-${uid}`} cx="0.78" cy="0.2" r="0.6">
            <stop offset="0" stopColor={light} stopOpacity="0.55" />
            <stop offset="1" stopColor={light} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="260" fill={`url(#g-${uid})`} />
        <rect width="400" height="260" fill={`url(#p-${uid})`} />
        <rect width="400" height="260" fill={`url(#glow-${uid})`} />
        <circle cx="330" cy="210" r="120" fill="none" stroke={light} strokeOpacity="0.18" strokeWidth="1.5" />
        <circle cx="330" cy="210" r="80" fill="none" stroke={light} strokeOpacity="0.14" strokeWidth="1.5" />
      </svg>
      <span className="art-cover-icon">
        <Icon name={icon} size={34} strokeWidth={1.5} />
      </span>
      {label && <span className="art-cover-label">{label}</span>}
    </div>
  );
}
