"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function BespokeCommissionSection() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-black text-white relative overflow-hidden">
      {/* Decorative gold ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-[#93722B]/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Heading & Narrative */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-3 py-1 bg-white/5 border border-[#93722B]/30"
            >
              <Sparkles size={12} className="text-[#C5A869]" />
              <span className="text-[9px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#E5D2A8] font-medium">
                Limited Editions Only · Strictly Allocated
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl sm:text-4xl lg:text-5xl font-light tracking-[0.1em] uppercase text-white leading-tight mb-4 sm:mb-6"
            >
              Custom Designs For Your Mobile
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed tracking-wide max-w-xl mb-6 sm:mb-8"
            >
              Transform your smartphone into an unmistakable signature piece. OROX accepts a strictly limited number of private bespoke commissions each season. Work directly with our master designers to sculpt custom gold backplates featuring personalized monograms, family emblems, and certified lab-grown diamonds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 bg-[#C5A869] text-black px-6 sm:px-8 py-3.5 sm:py-4 text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors"
              >
                <span>Commission Bespoke Piece</span>
                <ArrowRight size={14} />
              </Link>

              <Link
                href="/warranty"
                className="inline-flex items-center justify-center gap-3 border border-white/20 text-white px-6 sm:px-8 py-3.5 sm:py-4 text-[11px] sm:text-xs uppercase tracking-[0.2em] font-light hover:border-white transition-colors"
              >
                <span>OROX Standards</span>
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Design Specifications */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 sm:p-10 divide-y divide-white/10"
            >
              <div className="pb-5 sm:pb-6">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A869] block mb-1">
                  Commission Allocation
                </span>
                <h4 className="text-lg sm:text-xl font-light tracking-wider text-white">
                  Certificate of Authenticity
                </h4>
                <p className="text-xs text-zinc-400 font-light mt-1 leading-relaxed">
                  Each bespoke creation is accompanied by an official registered Certificate of Authenticity confirming its unique limited edition allocation.
                </p>
              </div>

              <div className="py-5 sm:py-6">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A869] block mb-1">
                  Precious Metals & Stones
                </span>
                <h4 className="text-lg sm:text-xl font-light tracking-wider text-white">
                  24K Gold, Rose Gold & Gems
                </h4>
                <p className="text-xs text-zinc-400 font-light mt-1 leading-relaxed">
                  Choice of pure 24K yellow gold or warm rose gold coating, embellished with certified lab-grown diamonds or precious gemstone inlays.
                </p>
              </div>

              <div className="pt-5 sm:pt-6">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A869] block mb-1">
                  Delivery Protocol
                </span>
                <h4 className="text-lg sm:text-xl font-light tracking-wider text-white">
                  White-Glove Handover
                </h4>
                <p className="text-xs text-zinc-400 font-light mt-1 leading-relaxed">
                  30–60 days bespoke handcrafting period followed by supervised open-box personal delivery handover.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
