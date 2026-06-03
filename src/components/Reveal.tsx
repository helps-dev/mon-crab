"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

// Mimics the original site's bouncy "from-bottom" reveal (overshoot + settle).
const variants: Variants = {
  hidden: { opacity: 0, y: 90, scaleY: 1.15 },
  show: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
