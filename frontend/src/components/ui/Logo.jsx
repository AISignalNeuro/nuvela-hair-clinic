import { useId } from "react";

// Nuvela mark: three growing strands inside a soft ring, in turquoise → gold.
export default function Logo({ size = 40, showText = true, className = "" }) {
  const id = useId().replace(/:/g, "");
  return (
    <span className={`logo ${className}`}>
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" className="logo-mark">
        <defs>
          <linearGradient id={`lg-${id}`} x1="6" y1="42" x2="42" y2="6" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0E8A8F" />
            <stop offset="0.55" stopColor="#2BB3A8" />
            <stop offset="1" stopColor="#D9B26A" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="21" fill="none" stroke={`url(#lg-${id})`} strokeWidth="2.4" opacity="0.9" />
        <path d="M17 36c0-9 1.5-15.5 7-22" fill="none" stroke={`url(#lg-${id})`} strokeWidth="3" strokeLinecap="round" />
        <path d="M24 36c0-8 1.8-13 6.5-18" fill="none" stroke={`url(#lg-${id})`} strokeWidth="3" strokeLinecap="round" />
        <path d="M31 36c0-5 1.2-8.4 4-11" fill="none" stroke={`url(#lg-${id})`} strokeWidth="3" strokeLinecap="round" />
        <circle cx="24.6" cy="13" r="2.2" fill="#D9B26A" />
      </svg>
      {showText && (
        <span className="logo-text">
          <span className="logo-name">Nuvela</span>
          <span className="logo-sub">Hair Clinic · Istanbul</span>
        </span>
      )}
    </span>
  );
}
