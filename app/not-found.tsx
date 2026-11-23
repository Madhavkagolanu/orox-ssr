"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-32 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="max-w-md flex flex-col items-center"
        >
          <h1 className="text-7xl sm:text-9xl md:text-[12rem] leading-none font-light tracking-widest text-black select-none">
            404
          </h1>

          <div className="h-[1px] w-12 bg-[#E5E5E5] mt-8 mb-12"></div>

          <h2 className="text-[10px] font-light uppercase tracking-[0.3em] text-[#666666] mb-4">
            Destination Unavailable
          </h2>

          <p className="text-[9px] font-light text-[#A0A0A0] uppercase tracking-[0.2em] leading-relaxed max-w-[280px]">
            The requested page does not exist or has been moved.
          </p>

          <Link
            href="/"
            className="mt-16 px-12 py-5 border border-[#E5E5E5] bg-white text-black text-[9px] font-light uppercase tracking-[0.3em] hover:border-black transition-colors duration-300"
          >
            Return to Homepage
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
