"use client";
import React from "react";
import Footer from "@/components/Home/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="flex-1 max-w-5xl w-full mx-auto px-6 lg:px-12 pt-28 lg:pt-36 pb-24">
        {/* Header */}
        <div className="max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-light block mb-4">
            OROX Policy
          </span>
          <h1 className="text-3xl md:text-4xl font-light uppercase tracking-[0.2em] text-black leading-tight mb-6">
            Handover & Replacements
          </h1>
          <div className="h-[1px] w-12 bg-black mb-8" />
          <p className="text-xs text-zinc-500 font-light leading-relaxed tracking-wide">
            Due to the individual hand-crafting, gold coating, and limited allocations of OROX MagSafe jewelry backpanels, every piece is made to order with dedicated white-glove security.
          </p>
        </div>

        {/* Content Sections */}
        <div className="mt-16 lg:mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 border-t border-zinc-100 pt-16">
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-black mb-4">
              01 / 30–60 Days Crafting Window
            </h2>
            <p className="text-xs text-zinc-600 font-light leading-relaxed">
              All OROX pieces are produced individually upon order. From initial metal sculpt to gemstone pavé setting and multi-step enamel firing, each creation requires a 30 to 60 days crafting window before dispatch.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-black mb-4">
              02 / White-Glove Handover & Open-Box Verification
            </h2>
            <p className="text-xs text-zinc-600 font-light leading-relaxed">
              To ensure unmatched safety and authenticity, deliveries are directly handled by OROX's dedicated internal logistics personnel under rigorous security measures.
            </p>
            <p className="text-xs text-zinc-600 font-light leading-relaxed mt-2">
              We conduct a supervised open-box handover at your premises, allowing you to physically inspect the pristine gemstone settings, gold finish, and test the MagSafe magnetic snap prior to formal acceptance.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-black mb-4">
              03 / Defective or Inoperable Replacement
            </h2>
            <p className="text-xs text-zinc-600 font-light leading-relaxed">
              If your piece is found to have any manufacturing defect, transit flaw, or does not function properly (such as defective magnetic alignment) during handover, our delivery concierge will immediately record the verification and initiate an expedited priority replacement.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-black mb-4">
              04 / Final Sale & Exclusions
            </h2>
            <p className="text-xs text-zinc-600 font-light leading-relaxed">
              Because all pieces are customized and crafted to order, acquisitions are final. We do not offer cancellations, refunds, or exchanges for change of mind once production has commenced. Post-handover damage resulting from drops, abrasions, or chemical exposure is excluded.
            </p>
          </div>
        </div>

        {/* Inquiries Footnote */}
        <div className="mt-20 border-t border-zinc-100 pt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-light block mb-1">
              Need Delivery Assistance?
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
