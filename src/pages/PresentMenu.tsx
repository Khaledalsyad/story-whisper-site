import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";
import { Film, MapPin, Video, BarChart3, Users, ArrowLeft, Sparkles } from "lucide-react";

const cards = [
  { id: "journey", icon: Film, ar: "رحلة المشروع", en: "Project Journey" },
  { id: "places", icon: MapPin, ar: "الأماكن", en: "Places" },
  { id: "videos", icon: Video, ar: "الفيديوهات", en: "Videos" },
  { id: "impact", icon: BarChart3, ar: "الأثر", en: "Impact" },
  { id: "team", icon: Users, ar: "الفريق", en: "Team" },
];

const PresentMenu = () => {
  const navigate = useNavigate();
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-0 -left-40 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] rounded-full bg-primary/30 blur-[120px] pointer-events-none" />

      <button
        onClick={() => navigate("/present")}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-foreground/10 backdrop-blur-md text-foreground/80 hover:text-accent hover:border-accent/40 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-cairo text-sm">{t("رجوع", "Back")}</span>
      </button>

      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-foreground/10 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-foreground/70 text-sm font-cairo tracking-widest">
              {t("القائمة", "Menu")}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-cairo text-foreground mb-4">
            {t("اختر فصلاً من الحكاية", "Choose a Chapter")}
          </h1>
          <p className="text-foreground/60 font-cairo text-lg">
            {t("تجربة عرض تفاعلية", "An interactive presentation experience")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/present/${card.id}`)}
                className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-card/40 backdrop-blur-xl border border-foreground/10 hover:border-accent/50 transition-all p-8 flex flex-col items-center justify-center text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/10 group-hover:from-accent/10 group-hover:to-accent/30 transition-all duration-500" />
                <div className="absolute -inset-1 rounded-3xl bg-accent/0 group-hover:bg-accent/20 blur-2xl transition-all duration-500 -z-10" />

                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 flex items-center justify-center mb-6 group-hover:shadow-[0_0_40px_hsl(30_90%_67%/0.5)] transition-all">
                  <Icon className="w-10 h-10 text-accent" />
                </div>

                <span className="relative text-2xl md:text-3xl font-bold font-cairo text-foreground mb-2">
                  {t(card.ar, card.en)}
                </span>
                <span className="relative text-sm text-foreground/50 font-cairo uppercase tracking-widest">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PresentMenu;
