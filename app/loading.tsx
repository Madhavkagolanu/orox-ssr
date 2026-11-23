"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="flex flex-col items-center"
        >
          {/* Logo / Brand Name */}
          <h1 className="text-xl md:text-2xl font-playfair tracking-[0.4em] uppercase text-[#111]">
            OROX
          </h1>

          {/* Subtle separator */}
          <div className="h-[1px] w-8 bg-[#93722B] my-4 opacity-70" />

          {/* Preloader Text */}
          <span className="text-[9px] uppercase tracking-[0.3em] font-medium text-[#555]">
            Curating
          </span>
        </motion.div>
      </div>
    </div>
  );
}
