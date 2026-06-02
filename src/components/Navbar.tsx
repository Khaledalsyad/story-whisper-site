import { useLang } from "@/contexts/LanguageContext";
import { Globe, Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "@/assets/logo-transparent.png";
import ThemeSwitcher from "./ThemeSwitcher";

const Navbar = () => {
  const { lang, toggleLang, t } = useLang();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/#videos", label: t("الحلقات", "Episodes") },
    { to: "/#places", label: t("الأماكن", "Places") },
    { to: "/stats", label: t("الإحصائيات", "Statistics") },
    { to: "/#team", label: t("الفريق", "Team") },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl rounded-2xl bg-foreground/10 backdrop-blur-xl border border-foreground/15 px-4 md:px-8 py-3"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative"
          >
            {/* Ambient glows */}
            <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-accent/30 blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
            <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[hsl(207_80%_45%/0.35)] blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
            <motion.img
              src={logo}
              alt={t("حكاية مكان", "Hekayet Makan")}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-[0_0_18px_hsl(30_90%_67%/0.45)] transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="text-foreground text-base md:text-lg font-bold font-cairo tracking-wide"
          >
            {t("حكاية مكان", "Hekayet Makan")}
          </motion.span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-xs lg:text-sm text-foreground/70">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-foreground transition-colors duration-300">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-foreground/70 hover:text-foreground transition-colors duration-300 text-sm"
          >
            <Globe className="w-4 h-4" />
            {lang === "ar" ? "EN" : "عربي"}
          </button>
          <ThemeSwitcher />
          <Link
            to="/present"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-accent to-[hsl(35_80%_55%)] text-background text-sm font-semibold shadow-[0_0_25px_hsl(30_90%_67%/0.4)] hover:shadow-[0_0_40px_hsl(30_90%_67%/0.7)] transition-all duration-300"
          >
            <Sparkles className="w-4 h-4" />
            {t("وضع العرض", "Presentation")}
          </Link>
          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="sm:hidden text-foreground/80 hover:text-foreground p-1.5 rounded-lg hover:bg-foreground/10 transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="sm:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-1 pt-3 pb-1 mt-3 border-t border-foreground/10">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm text-foreground/80 hover:text-foreground hover:bg-foreground/5 transition-colors font-cairo"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/present"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-gradient-to-r from-accent to-[hsl(35_80%_55%)] text-background text-sm font-semibold shadow-[0_0_25px_hsl(30_90%_67%/0.4)] font-cairo"
              >
                <Sparkles className="w-4 h-4" />
                {t("وضع العرض", "Presentation")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
