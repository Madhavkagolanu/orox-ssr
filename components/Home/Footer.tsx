import { FC } from "react";
import Link from "next/link";

const Footer: FC = () => {
  return (
    <footer className="bg-white text-black border-t border-black/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          {/* Brand Introduction */}
          <div className="col-span-1 md:col-span-2 pr-0 md:pr-12">
            <h3 className="text-[10px] uppercase tracking-[0.25em] font-medium text-black mb-3">
              OROX
            </h3>
            <p className="text-xs font-light leading-relaxed text-zinc-600 max-w-md">
              OROX crafts detachable MagSafe luxury backpanels in gold-coated aerospace aluminum, fine gemstones, and hand-applied enamel. Each piece is made to order with a 30–60 day crafting period, delivered securely via internal white-glove open-box verification.
            </p>
          </div>

          {/* Client Relations */}
          <div className="flex flex-col space-y-3 text-[11px] font-light uppercase tracking-[0.18em]">
            <h3 className="text-[10px] text-zinc-400 tracking-[0.25em] font-medium mb-1">
              Client Service
            </h3>
            <Link href="/contact" className="text-zinc-800 hover:text-black transition-colors">
              Contact Concierge
            </Link>
            <Link href="/my-orders" className="text-zinc-800 hover:text-black transition-colors">
              Track Order
            </Link>
            <Link href="/cart" className="text-zinc-800 hover:text-black transition-colors">
              Shopping Bag
            </Link>
            <Link href="/warranty" className="text-zinc-800 hover:text-black transition-colors">
              Warranty & Care
            </Link>
            <Link href="/returns" className="text-zinc-800 hover:text-black transition-colors">
              Handover & Replacements
            </Link>
          </div>

          {/* Connect */}
          <div className="flex flex-col space-y-3 text-[11px] font-light uppercase tracking-[0.18em]">
            <h3 className="text-[10px] text-zinc-400 tracking-[0.25em] font-medium mb-1">
              Connect
            </h3>
            <a
              href="mailto:hello@orox.in"
              className="text-zinc-800 hover:text-black transition-colors"
            >
              hello@orox.in
            </a>
            <a
              href="https://www.instagram.com/oroxofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-800 hover:text-black transition-colors"
            >
              Instagram
            </a>
            {/* YouTube temporarily commented as requested */}
            {/* <a href="https://youtube.com/@oroxofficial" target="_blank" rel="noopener noreferrer" className="text-zinc-800 hover:text-black transition-colors">YouTube</a> */}
          </div>
        </div>

        {/* Legal Bar */}
        <div className="border-t border-zinc-100 pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-zinc-400">
          <div className="mb-4 sm:mb-0">
            © {new Date().getFullYear()} OROX · CRAFTED IN INDIA
          </div>
          <div className="flex space-x-8">
            <Link href="/returns" className="hover:text-black transition-colors">
              Handover & Replacements
            </Link>
            <Link href="/warranty" className="hover:text-black transition-colors">
              Warranty & Care
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
