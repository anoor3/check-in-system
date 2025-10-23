"use client";

import { motion } from "framer-motion";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface MotionFadeInProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number;
}

export function MotionFadeIn({ children, className, delay = 0, ...props }: MotionFadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn("fade-in", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
