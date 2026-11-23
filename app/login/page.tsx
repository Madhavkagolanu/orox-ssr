"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { logEvent } from "@/utils/analytics";

const floatingImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
    delay: 0,
    duration: 25,
    rotation: -8,
    xDirection: "20vw",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    delay: 3,
    duration: 30,
    rotation: 12,
    xDirection: "-15vw",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    delay: 6,
    duration: 28,
    rotation: -15,
    xDirection: "25vw",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80",
    delay: 9,
    duration: 32,
    rotation: 18,
    xDirection: "-20vw",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
    delay: 12,
    duration: 26,
    rotation: -10,
    xDirection: "18vw",
  },
];

export default function LoginPage() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      logEvent("User", "Login", "Google");
      router.replace("/");
    }
  }, [user, router]);

  return (
    <motion.div
      className="relative h-screen w-full overflow-hidden bg-[#0A0A0A]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 bg-[#0A0A0A]/60 backdrop-blur-md z-0" />

      {floatingImages.map((image) => {
        const size = Math.floor(Math.random() * 150 + 150);
        return (
          <motion.div
            key={image.id}
            className="absolute overflow-hidden opacity-10 mix-blend-screen grayscale"
            initial={{
              y: "110vh",
              x: `${Math.floor(Math.random() * 100 - 50)}vw`,
              rotate: Math.floor(Math.random() * 20 - 10),
            }}
            animate={{
              y: "-60vh",
              x: image.xDirection,
              rotate: image.rotation,
            }}
            transition={{
              duration: image.duration,
              delay: image.delay,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
            style={{ width: `${size}px`, height: `${size}px` }}
          >
            <img src={image.src} alt="" className="w-full h-full object-cover rounded-sm" />
          </motion.div>
        );
      })}

      <div className="relative z-10 h-full flex flex-col justify-center items-center px-6">
        <motion.div
          className="text-center mb-16 flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <motion.h1
            className="text-3xl md:text-4xl font-light text-white mb-6 tracking-[0.3em] uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            Client Access
          </motion.h1>
          
          <div className="w-8 h-[1px] bg-white/30 mb-8"></div>

          <motion.p
            className="text-[#A0A0A0] text-[10px] font-light tracking-[0.2em] uppercase max-w-sm leading-loose"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Sign in to track your premium devices, check authenticity, and manage your warranty.
          </motion.p>
        </motion.div>

        <motion.button
          onClick={signInWithGoogle}
          className="bg-transparent text-white px-10 py-4 font-light text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-500 border border-white/20 hover:border-white hover:bg-white hover:text-black group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </motion.button>
      </div>
    </motion.div>
  );
}
