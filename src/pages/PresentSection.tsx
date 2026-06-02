import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import JourneySection from "@/components/JourneySection";
import PlacesSection from "@/components/PlacesSection";
import VideoSection from "@/components/VideoSection";
import ImpactSection from "@/components/ImpactSection";
import TeamSection from "@/components/TeamSection";

const order = ["journey", "places", "videos", "impact", "team"] as const;
type SectionId = (typeof order)[number];

const sectionMap: Record<SectionId, { ar: string; en: string; Comp: React.FC }> = {
  journey: { ar: "رحلة المشروع", en: "Project Journey", Comp: JourneySection },
  places: { ar: "الأماكن", en: "Places", Comp: PlacesSection },
  videos: { ar: "الفيديوهات", en: "Videos", Comp: VideoSection },
  impact: { ar: "الأثر", en: "Impact", Comp: ImpactSection },
  team: { ar: "الفريق", en: "Team", Comp: TeamSection },
};

const PresentSection = () => {
  const { section } = useParams<{ section: SectionId }>();
  const navigate = useNavigate();
  const { t, isRTL } = useLang();

  const current = section && sectionMap[section as SectionId] ? (section as SectionId) : "journey";
  const { Comp, ar, en } = sectionMap[current];
  const idx = order.indexOf(current);
  const prev = idx > 0 ? order[idx - 1] : null;
  const next = idx < order.length - 1 ? order[idx + 1] : null;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Top bar */}
      <div className="fixed top-0 inset-x-0 z-50 px-4 py-3 flex items-center justify-between bg-gradient-to-b from-background/90 to-transparent backdrop-blur-md">
        <button
          onClick={() => navigate("/present/menu")}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-foreground/10 backdrop-blur-md text-foreground/80 hover:text-accent hover:border-accent/40 transition"
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="font-cairo text-sm">{t("القائمة", "Menu")}</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-foreground/10 backdrop-blur-md">
          <span className="text-accent font-cairo text-sm">{String(idx + 1).padStart(2, "0")}</span>
          <span className="text-foreground/40">/</span>
          <span className="text-foreground/60 font-cairo text-sm">{String(order.length).padStart(2, "0")}</span>
          <span className="text-foreground/30 mx-2">·</span>
          <span className="text-foreground font-cairo text-sm font-semibold">{t(ar, en)}</span>
        </div>

        <div className="flex items-center gap-2">
          {prev && (
            <button
              onClick={() => navigate(`/present/${prev}`)}
              className="p-2 rounded-full bg-foreground/5 border border-foreground/10 backdrop-blur-md text-foreground/80 hover:text-accent hover:border-accent/40 transition"
              aria-label={t("السابق", "Previous")}
            >
              {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            </button>
          )}
          {next && (
            <button
              onClick={() => navigate(`/present/${next}`)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent to-[hsl(35_80%_55%)] text-background font-cairo font-semibold text-sm shadow-[0_0_30px_hsl(30_90%_67%/0.4)] hover:shadow-[0_0_50px_hsl(30_90%_67%/0.7)] transition"
            >
              <span>{t("التالي", "Next")}</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="pt-16"
        >
          <Comp />
        </motion.div>
      </AnimatePresence>

      {/* Bottom next CTA */}
      {next && (
        <div className="flex justify-center py-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/present/${next}`)}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-accent to-[hsl(35_80%_55%)] text-background font-cairo font-bold shadow-[0_0_50px_hsl(30_90%_67%/0.5)]"
          >
            {t(`التالي: ${sectionMap[next].ar}`, `Next: ${sectionMap[next].en}`)}
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default PresentSection;
