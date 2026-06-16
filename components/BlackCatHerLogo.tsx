import { motion } from "framer-motion";

export default function BlackCatHeroLogo() {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0, y: -20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center mb-10 relative"
    >
      <div className="absolute w-52 h-52 bg-teal-400/20 blur-3xl rounded-full animate-pulse" />

      <motion.svg
        width="160"
        height="160"
        viewBox="0 0 64 64"
        fill="none"
        className="relative z-10 text-teal-400 drop-shadow-[0_0_30px_rgba(45,212,191,0.7)]"
        animate={{
          y: [0, -6, 0],
          rotate: [-1, 1, -1],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
        }}
      >
        <path d="M10 18 L18 6 L24 18" stroke="currentColor" strokeWidth="2" />
        <path d="M40 18 L46 6 L54 18" stroke="currentColor" strokeWidth="2" />
        <path
          d="M16 22 Q32 10 48 22 Q52 34 46 46 Q32 54 18 46 Q12 34 16 22Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="26" cy="32" r="2" fill="currentColor" />
        <circle cx="38" cy="32" r="2" fill="currentColor" />
        <path d="M32 36 L30 38 L34 38 Z" fill="currentColor" />
        <path d="M30 40 Q32 42 34 40" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 34 L10 32" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 38 L10 38" stroke="currentColor" strokeWidth="1.5" />
        <path d="M46 34 L54 32" stroke="currentColor" strokeWidth="1.5" />
        <path d="M46 38 L54 38" stroke="currentColor" strokeWidth="1.5" />
      </motion.svg>

      <motion.h1
        className="text-3xl font-black tracking-[0.4em] text-teal-400 mt-4"
        animate={{
          textShadow: [
            "0 0 10px #14b8a6",
            "0 0 25px #14b8a6",
            "0 0 10px #14b8a6",
          ],
        }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        BLACKCAT
      </motion.h1>

      <p className="text-xs text-gray-400 tracking-[0.3em] mt-2">
        SECURITY ENGINE v1.0
      </p>
    </motion.div>
  );
}