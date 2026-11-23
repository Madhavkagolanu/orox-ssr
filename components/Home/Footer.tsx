import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="bg-white text-black border-t border-black">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 mb-24">

          <div className="col-span-1 md:col-span-2">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-2">About Orox</h3>
            <p className="text-sm font-light leading-relaxed max-w-md text-gray-600">
              OROX specializes in crafting exclusive 24K gold iPhones and premium accessories. We transform everyday technology into luxury masterpieces.
            </p>
          </div>

          <div className="flex flex-col space-y-4 text-xs font-medium uppercase tracking-widest">
            <h3 className="text-[10px] text-gray-400 mb-2">Services</h3>
            <a href="/contact" className="hover:opacity-50 transition-opacity">Contact Us</a>
            <a href="/my-orders" className="hover:opacity-50 transition-opacity">Track Order</a>
            <a href="/cart" className="hover:opacity-50 transition-opacity">Shopping Bag</a>
            <button onClick={() => window.open('https://google.com', '_blank')} className="text-left hover:opacity-50 transition-opacity">Check Authenticity</button>
            <button onClick={() => window.open('https://google.com', '_blank')} className="text-left hover:opacity-50 transition-opacity">Warranty Info</button>
          </div>

          <div className="flex flex-col space-y-4 text-xs font-medium uppercase tracking-widest">
            <h3 className="text-[10px] text-gray-400 mb-2">Connect</h3>
            <a href="mailto:oroxlabs@gmail.com" className="hover:opacity-50 transition-opacity">Email Concierge</a>
            <a href="https://www.instagram.com/oroxofficial" target="_blank" rel="noopener noreferrer" className="hover:opacity-50 transition-opacity">Instagram</a>
            <a href="https://youtube.com/@oroxofficial" target="_blank" rel="noopener noreferrer" className="hover:opacity-50 transition-opacity">YouTube</a>
          </div>
        </div>

        <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-gray-500">
          <div className="mb-4 md:mb-0">© {new Date().getFullYear()} Orox Laboratories</div>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
          </div>
        </div>

        {/* Massive Brand Typographic Element */}
        <div className="mt-16 overflow-hidden flex justify-center">
          <h1 className="text-[15vw] leading-none font-bold tracking-tighter text-black select-none">
            OROX
          </h1>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
