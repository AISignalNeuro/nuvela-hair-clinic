import { SITE } from "../content/shared/site.js";

export const whatsappLink = (text) =>
  `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const isValidPhone = (value) => /^\+?[0-9\s().-]{7,20}$/.test(value.trim()) && value.replace(/\D/g, "").length >= 7;
export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

export const cx = (...classes) => classes.filter(Boolean).join(" ");
