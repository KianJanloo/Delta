"use client";
import { UserCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, easeOut } from "framer-motion";

const container = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
      duration: 0.8,
      ease: easeOut,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOut },
  },
};


export default function AboutComponent() {
  const t = useTranslations("about");
  const teamMembers = t.raw("teamMembers") as string[];

  return (
    <div className="relative min-h-screen bg-gradient-to-br px-6 py-20 text-white overflow-hidden">
      <div className="absolute bottom-0 left-1/2 w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[120px] -translate-x-1/2 z-0" />
      <div className="absolute bottom-0 left-1/2 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px] z-0" />

      <motion.div
        className="relative max-w-5xl mx-auto text-center z-10"
        initial="hidden"
        animate="show"
        variants={container}
      >
        <motion.h1
          className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-primary to-cyan-400 text-transparent bg-clip-text drop-shadow-lg"
        >
          {t("title")}
        </motion.h1>

        <motion.p
          className="text-lg leading-relaxed mb-14 text-gray-300 max-w-3xl mx-auto"
          variants={item}
        >
          {t("desc")}
        </motion.p>

        <motion.h2
          className="text-2xl font-semibold text-white mb-10 tracking-widest uppercase"
          variants={item}
        >
          {t("teamTitle")}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
          {teamMembers.map((name, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 12 }}
              className="relative rounded-3xl bg-white/10 border border-white/20 p-6 backdrop-blur-lg shadow-xl hover:shadow-cyan-800 transition-all duration-300"
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <UserCircle2 className="w-16 h-16 text-primary drop-shadow-md" />
                <p className="text-xl font-bold text-white tracking-wide">{name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}