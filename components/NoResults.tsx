"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function NoResults({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-md flex flex-col items-center"
      >
        <Search className="w-12 h-12 text-black mb-6" strokeWidth={1} />

        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-black">
          No Results for &quot;{query}&quot;
        </h2>

        <p className="mt-4 text-[10px] sm:text-xs font-light text-zinc-500 uppercase tracking-widest leading-relaxed max-w-[280px]">
          Refine your search or explore our curation
        </p>

        <Link
          href="/"
          className="mt-10 px-8 py-4 border border-black bg-white text-black text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors duration-300"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}
