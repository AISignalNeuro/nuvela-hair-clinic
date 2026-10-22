// Small shared building blocks used across pages.
import { motion } from "framer-motion";
import Icon from "./Icon.jsx";
import { fadeInUp } from "../../config/motion.js";

export function SectionHeader({ eyebrow, title, subtitle, align = "center", light = false, children }) {
  return (
    <motion.div
      className={`section-header section-header--${align} ${light ? "section-header--light" : ""}`}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      {title && <h2 className="section-title">{title}</h2>}
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
      {children}
    </motion.div>
  );
}

// Scroll-triggered reveal wrapper.
export function Reveal({ as = "div", delay = 0, className = "", children, ...rest }) {
  const MotionTag = motion[as] ?? motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

export function Avatar({ initials, hue = 182, size = 56, className = "" }) {
  return (
    <span
      className={`avatar ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.36, "--avatar-hue": hue }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function Stars({ value = 5, size = 16, label }) {
  return (
    <span className="stars" role="img" aria-label={label ?? `${value} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" size={size} className={i < Math.round(value) ? "star--on" : "star--off"} />
      ))}
    </span>
  );
}

export function Chip({ active, onClick, children, icon }) {
  return (
    <button type="button" className={`chip ${active ? "chip--active" : ""}`} aria-pressed={active} onClick={onClick}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}

export function EmptyState({ icon = "search", children }) {
  return (
    <div className="empty-state">
      <Icon name={icon} size={28} />
      <p>{children}</p>
    </div>
  );
}
