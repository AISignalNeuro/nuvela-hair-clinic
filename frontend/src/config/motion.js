// Shared Framer Motion variants (fadeInUp, stagger, float, modal, page transitions).
export const EASE = [0.22, 1, 0.36, 1];

export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export const stagger = (step = 0.08, delay = 0.05) => ({
  hidden: {},
  visible: { transition: { staggerChildren: step, delayChildren: delay } },
});

export const floatCard = {
  rest: { y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } },
  hover: { y: -8, transition: { type: "spring", stiffness: 260, damping: 18 } },
};

export const modalPanel = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 28 } },
  exit: { opacity: 0, y: 24, scale: 0.98, transition: { duration: 0.18 } },
};

export const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

export const pageTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
