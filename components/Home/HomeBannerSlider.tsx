"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export interface Banner {
  image: string;
  path: string;
  tag?: string;
  title?: string;
  subtitle?: string;
}

interface BannerSliderProps {
  banners: Banner[];
}

export default function HomeBannerSlider({ banners }: BannerSliderProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();

  const next = () => setIndex((prev) => (prev + 1) % banners.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);

  useEffect(() => {
    if (!banners.length || isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [banners.length, isPaused]);

  if (!banners.length) return null;

  const current = banners[index];

  return (
    <div
      className="relative w-full overflow-hidden h-[60vh] sm:h-[72vh] lg:h-[84vh] bg-black select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0 cursor-pointer"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          onClick={() => router.push(current.path)}
        >
          {/* Background Image */}
          <img
            src={current.image}
            alt={current.title || "OROX Luxury Backplate"}
            className="w-full h-full object-cover object-center"
          />

          {/* Luxury Multi-layer Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/30" />
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60" />

          {/* Slide Editorial Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-20 max-w-5xl">
            {current.tag && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 mb-2 sm:mb-3"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A869]" />
                <span className="text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#E5D2A8] font-medium">
                  {current.tag}
                </span>
              </motion.div>
            )}

            {current.title && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-2xl sm:text-4xl lg:text-5xl font-light tracking-[0.12em] sm:tracking-[0.15em] uppercase text-white mb-2 sm:mb-3 leading-tight"
              >
                {current.title}
              </motion.h2>
            )}

            {current.subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-[11px] sm:text-xs lg:text-sm text-zinc-300 font-light tracking-wide max-w-xl mb-4 sm:mb-6 leading-relaxed line-clamp-2 sm:line-clamp-none"
              >
                {current.subtitle}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="inline-flex items-center gap-2.5 sm:gap-3 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white border-b border-[#C5A869] pb-1 w-max group-hover:border-white transition-colors"
            >
              <span>Explore Edition</span>
              <ArrowRight size={13} className="text-[#C5A869] group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
        aria-label="Previous Creation"
      >
        <ChevronLeft size={20} strokeWidth={1.5} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
        aria-label="Next Creation"
      >
        <ChevronRight size={20} strokeWidth={1.5} />
      </button>

      {/* Minimal Architectural Line Indicators */}
      <div className="absolute bottom-6 right-8 lg:bottom-10 lg:right-16 flex items-center gap-2.5 z-20">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setIndex(i);
            }}
            className={`h-0.5 transition-all duration-300 ${
              i === index ? "w-8 bg-[#C5A869]" : "w-4 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
