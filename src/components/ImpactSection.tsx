import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MapPin, Film, Clock, Users, TrendingUp, Activity, Eye, Heart } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

// Animated counter
const Counter = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 2000, bounce: 0 });
  const display = useTransform(spring, (v) => Math.floor(v).toString());
  const [val, setVal] = useState("0");

  useEffect(() => {
    if (inView) mv.set(to);
    const unsub = display.on("change", (v) => setVal(v));
    return () => unsub();
  }, [inView, to, mv, display]);

  return (
    <span ref={ref} className="tabular-nums">
      {val}
      {suffix}
    </span>
  );
};

// Radial / circular progress
const RadialCard = ({ value, label, max = 100 }: { value: number; label: string; max?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center gap-2">
      <div className="relative w-20 h-20 md:w-32 md:h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} stroke="hsl(var(--muted))" strokeWidth="8" fill="none" opacity="0.3" />
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            stroke="url(#radialGrad)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={inView ? { strokeDashoffset: circ - circ * pct } : {}}
            transition={{ duration: 1.8, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="radialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(30 90% 67%)" />
              <stop offset="100%" stopColor="hsl(35 80% 45%)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl md:text-3xl font-bold text-foreground font-cairo">
            <Counter to={value} />
          </span>
        </div>
      </div>
      <p className="text-[11px] md:text-sm text-muted-foreground font-cairo text-center line-clamp-1">{label}</p>
    </div>
  );
};

// Mini line chart (sparkline)
const SparkLine = () => {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });
  const points = [10, 25, 18, 40, 32, 55, 48, 70, 62, 85];
  const w = 220;
  const h = 70;
  const step = w / (points.length - 1);
  const max = Math.max(...points);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * h}`)
    .join(" ");
  const areaPath = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg ref={ref} viewBox={`0 0 ${w} ${h}`} className="w-full h-20">
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(30 90% 67%)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(30 90% 67%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={areaPath}
        fill="url(#lineGrad)"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.5 }}
      />
      <motion.path
        d={path}
        stroke="hsl(30 90% 67%)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
    </svg>
  );
};

const glass =
  "relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden";

const ImpactSection = () => {
  const { t } = useLang();

  const cardEnter = (delay: number) => ({
    initial: { opacity: 0, y: 40, scale: 0.92 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section
      id="impact"
      className="section-padding relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at top, hsl(215 40% 10%) 0%, hsl(222 50% 4%) 50%, hsl(222 60% 3%) 100%)",
      }}
    >
      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-primary/30 blur-[120px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-20"
        >
          <p className="text-accent text-xs md:text-sm tracking-[0.3em] uppercase mb-4 font-cairo">
            {t("الإحصائيات", "Statistics")}
          </p>
          <h2 className="heading-cinematic font-cairo mb-4">
            <span className="text-gradient-accent">{t("أثر المشروع", "Project Impact")}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg font-cairo">
            {t("أرقام تعكس رحلتنا", "Numbers that reflect our journey")}
          </p>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 auto-rows-auto gap-3 md:gap-6">
          {/* Card 1 - Big Number: Places */}
          <motion.div
            {...cardEnter(0)}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`${glass} col-span-2 md:col-span-2 md:row-span-2 p-4 md:p-7 group hover:border-accent/40 transition-all duration-500 hover:shadow-[0_0_40px_hsl(30_90%_67%/0.25)] md:rotate-[-1deg]`}
          >
            <div className="flex items-start justify-between mb-3 md:mb-6">
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                <MapPin className="w-4 h-4 md:w-6 md:h-6 text-accent" />
              </div>
              <span className="text-[10px] md:text-xs text-accent/70 font-cairo tracking-wider">
                {t("أماكن", "PLACES")}
              </span>
            </div>
            <div className="text-5xl md:text-8xl font-black text-gradient-accent font-cairo leading-none mb-2 md:mb-3">
              <Counter to={4} />
            </div>
            <p className="text-foreground/80 font-cairo text-sm md:text-lg mb-1 md:mb-2 line-clamp-1">
              {t("أماكن تم استكشافها", "Places Explored")}
            </p>
            <p className="text-[11px] md:text-sm text-muted-foreground font-cairo line-clamp-2">
              {t("سيوة، الفيوم، دهب، وادي الحيتان", "Siwa, Fayoum, Dahab, Wadi Al-Hitan")}
            </p>
            {/* corner glow */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl group-hover:bg-accent/20 transition-all" />
          </motion.div>

          {/* Card 2 - Videos with Sparkline */}
          <motion.div
            {...cardEnter(0.1)}
            whileHover={{ y: -8 }}
            className={`${glass} col-span-2 md:col-span-4 p-3 md:p-7 group hover:border-accent/40 transition-all duration-500`}
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                  <Film className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-muted-foreground font-cairo tracking-wider uppercase">
                    {t("الفيديوهات المنتجة", "Videos Produced")}
                  </p>
                  <p className="text-2xl md:text-4xl font-bold text-foreground font-cairo">
                    <Counter to={19} />
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-accent text-xs md:text-sm font-cairo">
                <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>+24%</span>
              </div>
            </div>
            <SparkLine />
          </motion.div>

          {/* Card 3 - Hours / Progress Bar */}
          <motion.div
            {...cardEnter(0.2)}
            whileHover={{ y: -8 }}
            className={`${glass} col-span-1 md:col-span-2 p-3 md:p-6 group hover:border-accent/40 transition-all duration-500 md:rotate-[1deg]`}
          >
            <div className="flex items-center gap-2 mb-2 md:mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-accent" />
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground font-cairo tracking-wider uppercase line-clamp-1">
                {t("ساعات تصوير", "Filming Hours")}
              </p>
            </div>
            <div className="text-2xl md:text-4xl font-bold text-foreground font-cairo mb-2 md:mb-3">
              <Counter to={120} suffix="+" />
            </div>
            <div className="w-full h-1.5 md:h-2 rounded-full bg-muted/50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "85%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, hsl(30 90% 67%), hsl(35 80% 45%))" }}
              />
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground font-cairo mt-2 line-clamp-1">
              {t("من الإنتاج الميداني", "of field production")}
            </p>
          </motion.div>

          {/* Card 4 - Radial: Team */}
          <motion.div
            {...cardEnter(0.3)}
            whileHover={{ y: -8 }}
            className={`${glass} col-span-1 md:col-span-2 p-3 md:p-6 group hover:border-accent/40 transition-all duration-500 flex items-center justify-center`}
          >
            <RadialCard value={10} max={10} label={t("أعضاء الفريق", "Team Members")} />
          </motion.div>

          {/* Card 5 - Total Views Across Platforms */}
          <motion.div
            {...cardEnter(0.4)}
            whileHover={{ y: -8 }}
            className={`${glass} col-span-2 md:col-span-3 p-3 md:p-6 group hover:border-accent/40 transition-all duration-500`}
          >
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                <Eye className="w-4 h-4 md:w-5 md:h-5 text-accent" />
              </div>
              <span className="text-[10px] text-accent/70 font-cairo tracking-wider">
                {t("منصات", "PLATFORMS")}
              </span>
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground font-cairo uppercase tracking-wider mb-1 md:mb-2 line-clamp-1">
              {t("إجمالي المشاهدات", "Total Views")}
            </p>
            <p className="text-3xl md:text-5xl font-bold text-gradient-accent font-cairo">
              <Counter to={1} suffix="M+" />
            </p>
            <div className="flex items-center gap-1 mt-2 text-[10px] md:text-xs text-accent font-cairo">
              <TrendingUp className="w-3 h-3" />
              <span>{t("عبر كل المنصات", "Across all platforms")}</span>
            </div>
          </motion.div>

          {/* Card 6 - Audience Interactions */}
          <motion.div
            {...cardEnter(0.5)}
            whileHover={{ y: -8 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
            className={`${glass} col-span-2 md:col-span-3 p-3 md:p-6 group hover:border-accent/40 transition-all duration-500 md:-rotate-[1deg]`}
          >
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                <Heart className="w-4 h-4 md:w-5 md:h-5 text-accent" />
              </div>
              <span className="text-[10px] text-accent/70 font-cairo tracking-wider">
                {t("جمهور", "AUDIENCE")}
              </span>
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground font-cairo uppercase tracking-wider mb-1 md:mb-2 line-clamp-1">
              {t("تفاعلات الجمهور", "Audience Interactions")}
            </p>
            <p className="text-3xl md:text-5xl font-bold text-foreground font-cairo">
              <Counter to={12} suffix="K+" />
            </p>
            <div className="flex items-center gap-1 mt-2 text-[10px] md:text-xs text-accent font-cairo">
              <Activity className="w-3 h-3" />
              <span>{t("إعجابات، تعليقات ومشاركات", "Likes, comments & shares")}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
