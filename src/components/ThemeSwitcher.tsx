import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check } from "lucide-react";
import { useTheme, Theme } from "@/contexts/ThemeContext";
import { useLang } from "@/contexts/LanguageContext";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const themes: { id: Theme; label: string; swatch: string[] }[] = [
    { id: "classic", label: t("الكلاسيكي", "Classic"), swatch: ["#0a1530", "#1e3a5f", "#e8a13a"] },
    { id: "cinematic", label: t("السينمائي", "Cinematic"), swatch: ["#070d1a", "#0a4a8a", "#f08a2e"] },
    { id: "heritage", label: t("التراث", "Heritage"), swatch: ["#1f1610", "#7a4a22", "#e8b84a"] },
    { id: "light", label: t("الفاتح", "Light"), swatch: ["#ffffff", "#1e3a5f", "#e8a13a"] },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Theme"
        className="flex items-center gap-1.5 text-foreground/70 hover:text-foreground transition-colors duration-300 p-1.5 rounded-lg hover:bg-foreground/10"
      >
        <Palette className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 rounded-xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl overflow-hidden z-50"
          >
            <div className="p-2">
              <div className="px-2 py-1.5 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                {t("الهوية البصرية", "Visual Identity")}
              </div>
              {themes.map((tm) => (
                <button
                  key={tm.id}
                  onClick={() => {
                    setTheme(tm.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm hover:bg-foreground/5 transition-colors ${
                    theme === tm.id ? "bg-accent/10 ring-1 ring-accent/50" : ""
                  }`}
                >
                  <div className="flex -space-x-1">
                    {tm.swatch.map((c, i) => (
                      <span
                        key={i}
                        className="w-4 h-4 rounded-full border border-foreground/20"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span className="flex-1 text-start text-foreground/90 font-cairo">{tm.label}</span>
                  {theme === tm.id && <Check className="w-4 h-4 text-accent" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;
