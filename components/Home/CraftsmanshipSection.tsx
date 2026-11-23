"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Shield, Gem, Layers } from "lucide-react";

export default function CraftsmanshipSection() {
  const pillars = [
    {
      num: "01",
      title: "24K Gold & Rose Gold",
      subtitle: "Precious Metal Deposition",
      icon: Layers,
      description:
        "Sculpted from aerospace-grade alloy, each backplate receives multi-layer vacuum electroplating in pure 24K yellow gold and warm rose gold for enduring luster.",
    },
    {
      num: "02",
      title: "Lab-Grown Diamonds",
      subtitle: "Hand-Set Brilliant Cut Diamonds",
      icon: Gem,
      description:
        "Select creations feature certified brilliant-cut lab-grown diamonds and genuine precious gemstones, handset by heritage Indian master jewellers under microscope precision.",
    },
    {
      num: "03",
      title: "Artisanal Enamel Painting",
      subtitle: "Kiln-Fired Miniature Art",
      icon: Sparkles,
      description:
        "Rooted in centuries-old royal Indian enamel arts, intricate motifs are painted by hand with fine sable brushes and kiln-fired into a glass-hard, permanent gemstone finish.",
    },
    {
      num: "04",
      title: "Magnetic Snap-On Fit",
      subtitle: "Instant Magnetic Lock",
      icon: Shield,
      description:
        "Engineered with integrated neodymium magnetic arrays. Snaps securely onto your iPhone in a single second—no adhesives, no tools, and zero residue on your phone.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-[#FAF9F6] border-y border-[#EAE6DF] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-3"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#93722B]" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#93722B] font-medium">
              Savoir-Faire & Craftsmanship
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-light tracking-[0.1em] uppercase text-black leading-tight mb-4 sm:mb-6"
          >
            The Alchemy of High Jewelry & Tech
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs sm:text-sm text-zinc-600 font-light leading-relaxed tracking-wide"
          >
            OROX bridges royal Indian jewelry traditions with modern device geometry. We do not manufacture ordinary protective cases; we forge collectible luxury magnetic backplates.
          </motion.p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className="bg-white p-6 sm:p-8 lg:p-10 border border-[#EAE6DF] hover:border-[#93722B]/60 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-center mb-6 sm:mb-8">
                    <span className="text-[11px] font-mono tracking-widest text-[#93722B] font-light">
                      {item.num}
                    </span>
                    <Icon
                      size={20}
                      strokeWidth={1}
                      className="text-zinc-400 group-hover:text-[#93722B] transition-colors"
                    />
                  </div>

                  <h3 className="text-base font-light uppercase tracking-[0.12em] sm:tracking-[0.15em] text-black mb-1">
                    {item.title}
                  </h3>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 block mb-3 sm:mb-4 font-light">
                    {item.subtitle}
                  </span>

                  <p className="text-xs text-zinc-500 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[8px] uppercase tracking-[0.25em] text-zinc-400 font-light">
                    Limited Allocation
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 group-hover:bg-[#93722B] transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
