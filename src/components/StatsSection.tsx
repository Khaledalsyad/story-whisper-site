import { useLang } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Eye, Heart, TrendingUp, Star } from "lucide-react";

const stats = [
  {
    titleAr: "الأكثر مشاهدة",
    titleEn: "Most Viewed",
    placeAr: "وادي الحيتان",
    placeEn: "Wadi Al-Hitan",
    value: "2.4M",
    icon: Eye,
    percent: 92,
  },
  {
    titleAr: "الأجمل",
    titleEn: "Most Beautiful",
    placeAr: "واحة سيوة",
    placeEn: "Siwa Oasis",
    value: "1.8M",
    icon: Heart,
    percent: 85,
  },
  {
    titleAr: "الأكثر نمواً",
    titleEn: "Fastest Growing",
    placeAr: "الصحراء البيضاء",
    placeEn: "White Desert",
    value: "+340%",
    icon: TrendingUp,
    percent: 78,
  },
  {
    titleAr: "اختيار الشهر",
    titleEn: "Monthly Pick",
    placeAr: "دهب",
    placeEn: "Dahab",
    value: "⭐ 4.9",
    icon: Star,
    percent: 95,
  },
];

const StatsSection = () => {
  const { t } = useLang();

  return (
    <section id="stats" className="section-padding relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-accent text-sm tracking-[0.2em] uppercase mb-3 font-cairo">
            {t("أرقام وحكايات", "Numbers & Stories")}
          </p>
          <h2 className="heading-cinematic font-cairo">
            {t("تصنيفات الأماكن", "Place Rankings")}
          </h2>
        </motion.div>

        <div className="space-y-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="cinematic-card p-6 flex items-center gap-6"
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <stat.icon className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-muted-foreground font-cairo">
                      {t(stat.titleAr, stat.titleEn)}
                    </p>
                    <h3 className="text-lg font-bold font-cairo text-foreground">
                      {t(stat.placeAr, stat.placeEn)}
                    </h3>
                  </div>
                  <span className="text-2xl font-bold text-accent font-cairo">{stat.value}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${stat.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: i * 0.15 + 0.3, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg, hsl(30, 90%, 67%), hsl(35, 60%, 50%))",
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
