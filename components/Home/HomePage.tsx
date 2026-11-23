"use client";
import React from "react";
import HomeBannerSlider, { Banner } from "./HomeBannerSlider";
import CraftsmanshipSection from "./CraftsmanshipSection";
import BespokeCommissionSection from "./BespokeCommissionSection";
import Footer from "./Footer";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const banners: Banner[] = [
    {
      image: "https://caviar.global/uploads/news/674/04.jpg",
      path: "/product/00000001-0001-1201-2026-867005836806",
      tag: "LIMITED EDITION · STRICTLY NUMBERED",
      title: "CYBER GOLD EDITION",
      subtitle:
        "24K Gold-Coated Aerospace Backplate & Fine Lab-Grown Diamonds. Magnetic Snap-On Fit.",
    },
    {
      image:
        "https://i0.wp.com/billionairecollections.ae/wp-content/uploads/2026/06/bitcoin01.jpg",
      path: "/product/00000001-0001-1201-2026-094308242491",
      tag: "BESPOKE COMMISSION · LIMITED EDITION",
      title: "ROYAL BITCOIN EDITION",
      subtitle:
        "Rose Gold Coating, Hand-Set Precious Gemstones & Miniature Enamel Painting.",
    },
  ];

  return (
    <div className="mt-16 lg:mt-20 bg-white">
      {/* ── 01. HERO CINEMATIC SLIDER ── */}
      <HomeBannerSlider banners={banners} />

      {/* ── 02. PRESTIGE OROX TICKER ── */}
      <div className="bg-[#0A0A0A] border-y border-[#262626] py-3.5 overflow-hidden">
        <div className="flex whitespace-nowrap gap-8 sm:gap-12 text-[9px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-light text-zinc-300 items-center justify-around px-4 sm:px-6">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A869]" />
            LIMITED EDITIONS ONLY
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A869]" />
            24K GOLD & ROSE GOLD COATING
          </span>
          <span className="hidden sm:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A869]" />
            FINE LAB-GROWN DIAMONDS
          </span>
          <span className="hidden md:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A869]" />
            MAGNETIC LUXURY BACKPLATES
          </span>
          <span className="hidden lg:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A869]" />
            WHITE-GLOVE HANDOVER
          </span>
        </div>
      </div>

      {/* ── 03. FEATURED MASTERPIECES SHOWCASE ── */}
      <section className="py-16 sm:py-20 lg:py-28 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-3"
          >
            <Sparkles size={13} className="text-[#93722B]" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#93722B] font-medium">
              Featured OROX Masterpieces
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-[0.12em] sm:tracking-[0.15em] uppercase text-black mb-4 leading-snug"
          >
            Interchangeable Fine Jewelry For iPhone
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs sm:text-sm text-zinc-500 font-light leading-relaxed tracking-wide px-2 sm:px-0"
          >
            Engineered as magnetic luxury backplates. Each creation snaps effortlessly onto your iPhone, elevating your device with gold and precious stones without permanent alterations.
          </motion.p>
        </div>

        {/* 2-Card Signature Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="group border border-[#EAE6DF] bg-[#FAF9F6] p-5 sm:p-6 lg:p-8 flex flex-col justify-between hover:border-[#93722B]/60 transition-all duration-300"
          >
            <div>
              <div className="relative overflow-hidden mb-5 sm:mb-6 aspect-[4/3] bg-black">
                <img
                  src="https://caviar.global/uploads/news/674/04.jpg"
                  alt="Cyber Gold Edition"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black/60 backdrop-blur-md px-3 py-1 border border-white/10">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A869]">
                    Limited Edition
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                <h3 className="text-base sm:text-lg font-light tracking-[0.12em] sm:tracking-[0.15em] uppercase text-black">
                  Cyber Gold Edition
                </h3>
                <span className="text-xs font-medium tracking-wider text-[#93722B]">
                  24K Gold & Diamonds
                </span>
              </div>

              <p className="text-xs text-zinc-500 font-light leading-relaxed mb-6">
                Vacuum-deposited 24K gold coating on aerospace alloy, embellished with certified brilliant-cut lab-grown diamonds. Magnetic snap-on fit.
              </p>
            </div>

            <Link
              href="/product/00000001-0001-1201-2026-867005836806"
              className="inline-flex items-center justify-between w-full pt-4 border-t border-[#EAE6DF] text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium text-black group-hover:text-[#93722B] transition-colors"
            >
              <span>Explore Edition</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="group border border-[#EAE6DF] bg-[#FAF9F6] p-5 sm:p-6 lg:p-8 flex flex-col justify-between hover:border-[#93722B]/60 transition-all duration-300"
          >
            <div>
              <div className="relative overflow-hidden mb-5 sm:mb-6 aspect-[4/3] bg-black">
                <img
                  src="https://i0.wp.com/billionairecollections.ae/wp-content/uploads/2026/06/bitcoin01.jpg"
                  alt="Royal Bitcoin Edition"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black/60 backdrop-blur-md px-3 py-1 border border-white/10">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF98]">
                    Bespoke Allocation
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                <h3 className="text-base sm:text-lg font-light tracking-[0.12em] sm:tracking-[0.15em] uppercase text-black">
                  Royal Bitcoin Edition
                </h3>
                <span className="text-xs font-medium tracking-wider text-[#93722B]">
                  Rose Gold & Enamel
                </span>
              </div>

              <p className="text-xs text-zinc-500 font-light leading-relaxed mb-6">
                Handcrafted rose gold metalwork paired with heritage miniature enamel painting and fine gemstones. Seamless magnetic fit.
              </p>
            </div>

            <Link
              href="/product/00000001-0001-1201-2026-094308242491"
              className="inline-flex items-center justify-between w-full pt-4 border-t border-[#EAE6DF] text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium text-black group-hover:text-[#93722B] transition-colors"
            >
              <span>Explore Edition</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 04. CRAFTSMANSHIP & MATERIALITY (ON-SCROLL ANIMATIONS) ── */}
      <CraftsmanshipSection />

      {/* ── 05. BESPOKE COMMISSION SECTION (CUSTOM DESIGNS FOR YOUR MOBILE) ── */}
      <BespokeCommissionSection />

      {/* ── 06. FOOTER ── */}
      <Footer />
    </div>
  );
}
