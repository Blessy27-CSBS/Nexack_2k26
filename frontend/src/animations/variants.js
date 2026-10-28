// Reusable Framer Motion Animation Variants & Helpers
// Strictly adheres to dark-first, performance-optimized, 60fps design standards

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
  }
};

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

export const slideLeft = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export const slideRight = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0.05) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren
    }
  }
});

export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
    transition: { duration: 0.25, ease: "easeOut" }
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: "0 20px 35px -5px rgba(16, 185, 129, 0.12), 0 0 15px 1px rgba(168, 85, 247, 0.08)",
    transition: { duration: 0.25, ease: "easeOut" }
  }
};

export const buttonTap = {
  scale: 0.97,
  transition: { duration: 0.1 }
};

export const buttonHover = {
  scale: 1.03,
  transition: { duration: 0.2 }
};
