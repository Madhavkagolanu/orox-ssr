"use client";
import React from "react";
import Footer from "@/components/Home/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function WarrantyPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="flex-1 max-w-5xl w-full mx-auto px-6 lg:px-12 pt-28 lg:pt-36 pb-24">
        {/* Header */}
        <div className="max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-light block mb-4">
            OROX Standards
          </span>
          <h1 className="text-3xl md:text-4xl font-light uppercase tracking-[0.2em] text-black leading-tight mb-6">
            Warranty & Care
          </h1>
          <div className="h-[1px] w-12 bg-black mb-8" />
          <p className="text-xs text-zinc-500 font-light leading-relaxed tracking-wide">
            Each OROX backpanel is conceived as an interchangeable decorative jewelry piece and collectible objet d'art—sculpted from gold-coated aerospace aluminum, precious gems, and hand-applied enamel.
          </p>
        </div>

        {/* Content Sections */}
        <div className="mt-16 lg:mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 border-t border-zinc-100 pt-16">
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-black mb-4">
              01 / Decorative Jewelry Nature
            </h2>
            <p className="text-xs text-zinc-600 font-light leading-relaxed">
              OROX MagSafe backpanels are fine adornments designed to elevate the aesthetic of your device through bespoke jewelry craftsmanship. They are decorative luxury pieces and are not intended as rugged shockproof or impact-resistant cases.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-black mb-4">
              02 / MagSafe & Wireless Charging
            </h2>
            <p className="text-xs text-zinc-600 font-light leading-relaxed">
              The backpanel attaches firmly via integrated MagSafe magnetic alignment. Please note that because our panels are crafted from solid aerospace-grade aluminum and precious gold coating, inductive wireless charging cannot pass through the metal panel while attached.
            </p>
            <p className="text-xs text-zinc-600 font-light leading-relaxed mt-2">
              To charge wirelessly, simply detach the magnetic backpanel with a gentle slide, place your device on your wireless charger, and snap the backpanel back on when charged. Cable charging remains completely unobstructed at all times.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-black mb-4">
              03 / 30–60 Days Crafting Period
            </h2>
            <p className="text-xs text-zinc-600 font-light leading-relaxed">
              Every OROX piece is individually made to order. Casting, gemstone handset setting, high-detail enamel work, and multi-layer gold plating require a 30 to 60 days crafting and inspection window prior to white-glove handover.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-black mb-4">
              04 / Warranty Disclaimer
            </h2>
            <p className="text-xs text-zinc-600 font-light leading-relaxed">
              Because each piece is wearable decorative jewelry subject to personal handling and surface contact, OROX products do not carry a conventional commercial warranty. Surface wear, hairline scratches, accidental drops, or gemstone impacts sustained after delivery are not covered.
            </p>
          </div>

          <div className="md:col-span-2 border-t border-zinc-100 pt-8">
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-black mb-4">
              05 / Care & Preservation
            </h2>
            <p className="text-xs text-zinc-600 font-light leading-relaxed mb-3">
              To preserve the luster of the gold coating and enamel work:
            </p>
            <ul className="space-y-2 text-xs text-zinc-500 font-light">
              <li className="flex items-start gap-2">
                <span className="text-black font-semibold">•</span>
                <span>Clean gently using only a dry, ultra-soft microfibre cloth.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black font-semibold">•</span>
                <span>Avoid contact with perfumes, sanitizers, abrasive chemicals, and seawater.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black font-semibold">•</span>
                <span>Detach along the magnetic plane without levering or prying corners.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Inquiries Footnote */}
        <div className="mt-20 border-t border-zinc-100 pt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-light block mb-1">
              Have a Care Inquiry?
            </span>
            <p className="text-xs text-black font-light tracking-wide">
              Direct all inquiries to{" "}
              <a href="mailto:hello@orox.in" className="underline underline-offset-4 hover:opacity-60 transition-opacity font-medium">
                hello@orox.in
              </a>
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-light text-black hover:opacity-60 transition-opacity"
          >
            <span>Contact Concierge</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
