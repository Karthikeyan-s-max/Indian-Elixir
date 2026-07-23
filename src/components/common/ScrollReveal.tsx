"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  yOffset = 30,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
