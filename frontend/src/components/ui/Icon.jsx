// 24×24 line icon set, kept inline so no icon library is needed.
// Icons listed in FLIP_IN_RTL are mirrored automatically for Arabic.
const PATHS = {
  check: "M5 12.5l4.2 4.2L19 7",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  arrowLeft: "M19 12H5M11 6l-6 6 6 6",
  arrowUp: "M12 19V5M6 11l6-6 6 6",
  chevronDown: "M6 9l6 6 6-6",
  chevronRight: "M9 6l6 6-6 6",
  menu: "M4 7h16M4 12h16M4 17h10",
  close: "M6 6l12 12M18 6L6 18",
  phone: "M5.5 4h3l1.7 4.6-2.3 1.4a11.5 11.5 0 005.6 5.6l1.4-2.3 4.6 1.7v3a2 2 0 01-2.2 2A16.5 16.5 0 013.5 6.2 2 2 0 015.5 4z",
  mail: "M4 6h16v12H4zM4.5 6.5l7.5 6 7.5-6",
  mapPin: "M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21zM12 12.2a2.6 2.6 0 100-5.2 2.6 2.6 0 000 5.2z",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7.5V12l3 2",
  globe: "M12 21a9 9 0 100-18 9 9 0 000 18zM3.5 12h17M12 3c2.4 2.6 3.7 5.6 3.7 9s-1.3 6.4-3.7 9c-2.4-2.6-3.7-5.6-3.7-9S9.6 5.6 12 3z",
  calendar: "M4.5 6h15v14h-15zM4.5 10.5h15M8.5 3.5v4M15.5 3.5v4",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 20.5c1.4-3.7 4.2-5.5 7.5-5.5s6.1 1.8 7.5 5.5",
  users: "M9 11.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20c1.2-3.4 3.6-5 6.5-5s5.3 1.6 6.5 5M16 4.8a3.3 3.3 0 010 6.4M18 15.2c1.7.6 2.9 2.2 3.5 4.8",
  search: "M11 17.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM20 20l-4.4-4.4",
  shield: "M12 3l7 3v5.5c0 4.4-3 8.3-7 9.5-4-1.2-7-5.1-7-9.5V6zM9 12l2.2 2.2L15.5 10",
  award: "M12 14a5 5 0 100-10 5 5 0 000 10zM8.6 12.7L7 21l5-2.6 5 2.6-1.6-8.3",
  plane: "M21 4.5L3 11.5l7 2.6 2.6 7L21 4.5zM10 14.1l4.6-4.6",
  hotel: "M3 19V7M3 14.5h18V19M21 14.5V13a3 3 0 00-3-3h-7.5v4.5M7.2 12.6a1.6 1.6 0 100-3.2 1.6 1.6 0 000 3.2z",
  car: "M4 16.5h16M4.5 16.5v-3.5l2-4.8h11l2 4.8v3.5M4.5 16.5V19h2.8v-2.5M16.7 16.5V19h2.8v-2.5M7.5 13.2h.01M16.5 13.2h.01",
  chat: "M4 5h11v8H9.5L6 16v-3H4zM15 9h5v8h-2v3l-3-3h-4v-2",
  gem: "M7 4h10l4 5-9 11L3 9zM3 9h18M12 20L8.5 9 10 4M12 20l3.5-11L14 4",
  pen: "M14.5 4.5l5 5M17 7l-8.5 8.5-3.5 1 1-3.5L14.5 4.5M4 20l2.5-2.5",
  follicle: "M12 21c0-6 1-10.5 4.5-14.5M8.5 21c0-5 .6-8.4 2.4-11.5M15.5 21c0-3.2 1-5.6 3.5-7.6M16.5 6.5a1.5 1.5 0 102.1-2.1 1.5 1.5 0 00-2.1 2.1z",
  female: "M12 14a5 5 0 100-10 5 5 0 000 10zM12 14v7M9 18h6",
  beard: "M5 7.5v3.5c0 5 3.1 9 7 9s7-4 7-9V7.5M8.5 13.5c1.1.9 2.2 1.3 3.5 1.3s2.4-.4 3.5-1.3M9.5 17h5",
  brow: "M3.5 9.5c2.7-2.7 5.7-3.8 8.7-3.5 2.6.2 5.2 1.4 8.3 3.5M5 15.5c2-2.3 4.4-3.5 7-3.5s5 1.2 7 3.5c-2 2.3-4.4 3.5-7 3.5s-5-1.2-7-3.5zM12 17.2a1.7 1.7 0 100-3.4 1.7 1.7 0 000 3.4z",
  drop: "M12 3.5c3.5 4.2 6 7.7 6 10.5a6 6 0 01-12 0c0-2.8 2.5-6.3 6-10.5zM9.3 14.5A2.7 2.7 0 0012 17.2",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z",
  heart: "M12 20s-7.5-4.5-7.5-10.2A4.3 4.3 0 0112 7.2a4.3 4.3 0 017.5 2.6C19.5 15.5 12 20 12 20z",
  tag: "M3.5 12.5V4h8.5l8.5 8.5-8.5 8.5zM8 8.5h.01",
  info: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v5.5M12 7.8h.01",
  lock: "M6 11h12v9.5H6zM8.5 11V8a3.5 3.5 0 017 0v3",
  logout: "M14.5 4h4.5v16h-4.5M10 8l-4 4 4 4M6 12h11",
  share: "M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4",
  link: "M10 14a4.5 4.5 0 006.4 0l3-3a4.5 4.5 0 00-6.4-6.4l-1 1M14 10a4.5 4.5 0 00-6.4 0l-3 3a4.5 4.5 0 006.4 6.4l1-1",
  headset: "M4.5 14v-2a7.5 7.5 0 0115 0v2M4.5 14h3v5.5h-2a1 1 0 01-1-1zM19.5 14h-3v5.5h2a1 1 0 001-1zM16.5 19.5c0 1.3-2 2-4.5 2",
  camera: "M4 8h3.2l2-2.5h5.6l2 2.5H20v11H4zM12 16.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z",
  play: "M8 5.5v13l10.5-6.5z",
  quote: "M9.5 7H6a2 2 0 00-2 2v3.5a2 2 0 002 2h2.5c0 2-1 3-3 3.5M20 7h-3.5a2 2 0 00-2 2v3.5a2 2 0 002 2H19c0 2-1 3-3 3.5",
  instagram: "M7.5 3.5h9a4 4 0 014 4v9a4 4 0 01-4 4h-9a4 4 0 01-4-4v-9a4 4 0 014-4zM12 16a4 4 0 100-8 4 4 0 000 8zM17.2 6.8h.01",
  facebook: "M14 21v-8h2.7l.4-3.2H14V7.9c0-.9.3-1.6 1.6-1.6h1.6V3.5c-.8-.1-1.7-.2-2.5-.2-2.4 0-4 1.5-4 4.1v2.4H8V13h2.7v8",
  youtube: "M21 8.2a2.7 2.7 0 00-1.9-1.9C17.4 5.8 12 5.8 12 5.8s-5.4 0-7.1.5A2.7 2.7 0 003 8.2 28 28 0 002.6 12c0 1.3.1 2.6.4 3.8a2.7 2.7 0 001.9 1.9c1.7.5 7.1.5 7.1.5s5.4 0 7.1-.5a2.7 2.7 0 001.9-1.9c.3-1.2.4-2.5.4-3.8s-.1-2.6-.4-3.8zM10.2 14.6V9.4L14.8 12z",
  star: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z",
  filter: "M4 6h16M7 12h10M10 18h4",
  minus: "M5 12h14",
  plus: "M12 5v14M5 12h14",
};

const FILLED = new Set(["star", "play"]);
const FLIP_IN_RTL = new Set(["arrowRight", "arrowLeft", "chevronRight", "logout", "plane"]);

export default function Icon({ name, size = 20, className = "", strokeWidth = 1.7, title, ...rest }) {
  if (name === "whatsapp") return <WhatsAppIcon size={size} className={className} title={title} {...rest} />;
  if (name === "google") return <GoogleIcon size={size} className={className} {...rest} />;

  const d = PATHS[name];
  if (!d) return null;
  const filled = FILLED.has(name);
  const classes = ["icon", FLIP_IN_RTL.has(name) ? "icon--flip-rtl" : "", className].filter(Boolean).join(" ");

  return (
    <svg
      className={classes}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...rest}
    >
      {title && <title>{title}</title>}
      <path d={d} />
    </svg>
  );
}

function WhatsAppIcon({ size, className, title, ...rest }) {
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden={title ? undefined : true} {...rest}>
      {title && <title>{title}</title>}
      <path
        fill="currentColor"
        d="M12 2.2a9.8 9.8 0 00-8.4 14.8L2.3 21.8l4.9-1.3A9.8 9.8 0 1012 2.2zm0 17.8a8 8 0 01-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1112 20z"
      />
      <path
        fill="currentColor"
        d="M16.4 14.2c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 01-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 00-.6.3 2.7 2.7 0 00-.8 2c0 1.2.9 2.3 1 2.5.1.2 1.7 2.6 4.1 3.6 1.5.7 2.1.7 2.9.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.4-.4z"
      />
    </svg>
  );
}

function GoogleIcon({ size, className, ...rest }) {
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...rest}>
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 01-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" />
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0012 22z" />
      <path fill="#FBBC05" d="M6.4 14a6 6 0 010-3.9V7.5H3.1a10 10 0 000 9z" />
      <path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 003.1 7.5L6.4 10C7.2 7.8 9.4 6 12 6z" />
    </svg>
  );
}
