"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Banner {
  image: string;
  path: string;
}

interface BannerSliderProps {
  banners: Banner[];
}

export default function HomeBannerSlider({ banners }: BannerSliderProps) {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  const next = () => setIndex((prev) => (prev + 1) % banners.length);

  const prev = () =>
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);

  useEffect(() => {
    if (!banners.length) return;
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="relative w-full overflow-hidden h-[50vh]">
      <AnimatePresence>
        <motion.img
          key={index}
          src={banners[index].image}
          alt="Home Banner"
          className="absolute w-full h-full object-cover cursor-pointer"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) next();
            if (info.offset.x > 50) prev();
          }}
          onClick={() => router.push(banners[index].path)}
        />
      </AnimatePresence>

      <div className="absolute bottom-3 w-full flex justify-center gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
