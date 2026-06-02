import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo-transparent.png";
import { Sparkles } from "lucide-react";

const Present = () => {
  const navigate = useNavigate();
  const { t } = useLang();

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      <motion.img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1.3 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_80%)]" />

      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        {/* Logo reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-10"
        >
          <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-accent/30 blur-[80px]" />
          <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[hsl(207_80%_45%/0.35)] blur-[100px]" />
          <motion.img
            src={logo}
            alt="حكاية مكان"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-[0_0_40px_hsl(30_90%_67%/0.55)]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-foreground/10 mb-8 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-foreground/70 text-sm font-cairo tracking-widest">
            {t("عرض تقديمي", "Presentation")}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.6 }}
          className="text-6xl md:text-8xl lg:text-9xl font-black font-cairo text-gradient-accent mb-6 leading-none drop-shadow-[0_0_40px_hsl(30_90%_67%/0.4)]"
        >
          حكاية مكان
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 2.1 }}
          className="text-xl md:text-3xl font-cairo text-foreground/80 mb-16"
        >
          كل مكان ليه حكاية
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 2.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/present/menu")}
          className="relative group px-12 py-5 rounded-full font-cairo font-bold text-lg md:text-xl text-background bg-gradient-to-r from-accent to-[hsl(35_80%_55%)] shadow-[0_0_60px_hsl(30_90%_67%/0.6)] hover:shadow-[0_0_90px_hsl(30_90%_67%/0.9)] transition-shadow"
        >
          <span className="absolute inset-0 rounded-full bg-accent/40 blur-xl group-hover:blur-2xl transition-all" />
          <span className="relative">ابدأ الرحلة</span>
        </motion.button>
      </div>
    </div>
  );
};

export default Present;
