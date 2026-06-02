import { useLang } from "@/contexts/LanguageContext";
import { motion, useScroll, useTransform } from "framer-motion";
import { Lightbulb, Camera, Mountain, Sparkles, MapPin } from "lucide-react";
import { useRef } from "react";
import journeyIdea from "@/assets/journey-idea.jpg";
import journeyFilming from "@/assets/journey-filming.png";
import journeyChallenges from "@/assets/journey-challenges.png";
import journeyResult from "@/assets/journey-result.png";

interface Step {
  icon: typeof Lightbulb;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  image: string;
  tagAr: string;
  tagEn: string;
}

const steps: Step[] = [
  {
    icon: Lightbulb,
    titleAr: "البداية",
    titleEn: "The Idea",
    descAr:
      "بدأت حكاية مكان من شغف بسيط… رغبة في إعادة الحياة لأماكن نسيها الزمن، وحكاية لا يعرفها إلا قلب من عاشها. فكرة وُلدت من حُبّ الوطن، ومن إيمان أن لكل حجر قصة تستحق أن تُروى.",
    descEn:
      "Hekayet Makan began with a simple passion — a desire to revive forgotten places and untold stories. An idea born from love for the homeland, believing every stone holds a tale worth telling.",
    image: journeyIdea,
    tagAr: "الفكرة",
    tagEn: "Concept",
  },
  {
    icon: Camera,
    titleAr: "رحلة التصوير",
    titleEn: "The Journey",
    descAr:
      "سافرنا إلى سيوة، الفيوم، ودهب… حملنا الكاميرات على أكتافنا، ومشينا بين الرمال والجبال. كل لقطة كانت مغامرة، وكل غروب شمس كان يهمس لنا بحكاية جديدة.",
    descEn:
      "We traveled to Siwa, Fayoum, and Dahab — carrying cameras across sands and mountains. Every shot was an adventure, every sunset whispered a new story.",
    image: journeyFilming,
    tagAr: "الترحال",
    tagEn: "On the road",
  },
  {
    icon: Mountain,
    titleAr: "التحديات",
    titleEn: "Challenges",
    descAr:
      "الصحراء لا ترحم، والحرارة تُذيب الصبر قبل المعدن. مسافات طويلة، معدات ثقيلة، وليالي بلا نوم… لكن كل تحدٍّ كان وقودًا لشغفنا، ودرسًا لا تنساه الذاكرة.",
    descEn:
      "The desert is unforgiving — heat melted patience before metal. Long distances, heavy gear, sleepless nights… yet every challenge fueled our passion.",
    image: journeyChallenges,
    tagAr: "الصمود",
    tagEn: "Resilience",
  },
  {
    icon: Sparkles,
    titleAr: "النتيجة",
    titleEn: "The Result",
    descAr:
      "من كل تلك اللحظات، وُلد هذا الموقع… مجموعة فيديوهات سينمائية وحكايات تنبض بالحياة، تدعوك لترى مصر بعين جديدة، وتشعر بكل مكان كأنك جزء منه.",
    descEn:
      "From all those moments, this site was born — cinematic videos and living stories inviting you to see Egypt anew, and feel each place as if you belong to it.",
    image: journeyResult,
    tagAr: "الإبداع",
    tagEn: "Creation",
  },
];

const TimelineStep = ({ step, index }: { step: Step; index: number }) => {
  const { t, isRTL } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const Icon = step.icon;
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center mb-24 md:mb-40"
    >
      {/* Timeline node */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-accent/40 blur-xl animate-glow-pulse" />
          <div className="relative w-14 h-14 rounded-full bg-background border-2 border-accent flex items-center justify-center shadow-[0_0_30px_hsl(30_90%_67%/0.5)]">
            <Icon className="w-6 h-6 text-accent" />
          </div>
        </motion.div>
      </div>

      {/* Image side */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? (isRTL ? 60 : -60) : isRTL ? -60 : 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`relative ${isEven ? "md:order-1" : "md:order-2"}`}
      >
        <div className="relative rounded-3xl overflow-hidden group aspect-[4/3] shadow-2xl">
          <motion.img
            src={step.image}
            alt={t(step.titleAr, step.titleEn)}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ y }}
            loading="lazy"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-primary/30 mix-blend-overlay" />
          {/* Glow border */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-accent/20 group-hover:ring-accent/60 transition-all duration-500" />

          {/* Tag */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-md border border-foreground/10">
            <MapPin className="w-3 h-3 text-accent" />
            <span className="text-foreground text-xs font-cairo">
              {t(step.tagAr, step.tagEn)}
            </span>
          </div>

          {/* Step number */}
          <div className="absolute bottom-4 right-4 text-6xl font-bold text-foreground/20 font-cairo leading-none">
            0{index + 1}
          </div>
        </div>
      </motion.div>

      {/* Text side */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className={`${isEven ? "md:order-2 md:pl-8" : "md:order-1 md:pr-8 md:text-right"}`}
      >
        {/* Mobile icon */}
        <div className="md:hidden flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-background border-2 border-accent flex items-center justify-center">
            <Icon className="w-5 h-5 text-accent" />
          </div>
          <span className="text-accent/70 text-sm font-cairo tracking-widest">
            0{index + 1}
          </span>
        </div>

        <span className="hidden md:inline-block text-accent/70 text-sm font-cairo tracking-[0.3em] uppercase mb-3">
          {t(`المرحلة ${index + 1}`, `Stage ${index + 1}`)}
        </span>

        <h3 className="text-4xl md:text-5xl font-bold font-cairo text-foreground mt-2 mb-5 leading-tight">
          {t(step.titleAr, step.titleEn)}
          <span className="block text-accent/60 text-lg font-normal mt-2">
            {t(step.titleEn, step.titleAr)}
          </span>
        </h3>

        <p className="text-foreground/70 text-base md:text-lg leading-relaxed font-cairo">
          {t(step.descAr, step.descEn)}
        </p>
      </motion.div>
    </div>
  );
};

const JourneySection = () => {
  const { t } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="journey"
      className="relative py-24 md:py-40 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-background via-card/40 to-background"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full bg-primary/30 blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 md:mb-32"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-foreground/10 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-foreground/70 text-sm font-cairo tracking-widest uppercase">
              {t("رحلة المشروع", "Project Journey")}
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold font-cairo leading-tight mb-6">
            <span className="text-foreground">
              {t("رحلتنا من ", "Our Journey from ")}
            </span>
            <span className="text-gradient-accent">
              {t("فكرة", "an Idea")}
            </span>
            <span className="text-foreground">
              {t(" إلى ", " to a ")}
            </span>
            <span className="text-gradient-accent">
              {t("تجربة", "Living Experience")}
            </span>
          </h2>

          <p className="max-w-2xl mx-auto text-foreground/60 text-lg md:text-xl font-cairo leading-relaxed">
            {t(
              "قصة وُلدت من شغف، صنعتها أقدامنا في الصحراء، وعدساتنا أمام الغروب… هذه ليست مجرد حكاية مكان، بل حكاية كل لحظة عشناها لنصنعها لك.",
              "A story born from passion, shaped by footsteps in the desert and lenses facing the sunset — not just a tale of a place, but every moment we lived to create it for you."
            )}
          </p>
        </motion.div>

        {/* Timeline */}
        <div ref={containerRef} className="relative">
          {/* Center line - background */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-foreground/10" />
          {/* Center line - progress */}
          <motion.div
            style={{ height: lineHeight }}
            className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 w-px bg-gradient-to-b from-accent via-accent/60 to-transparent shadow-[0_0_20px_hsl(30_90%_67%/0.6)]"
          />

          {steps.map((step, i) => (
            <TimelineStep key={i} step={step} index={i} />
          ))}
        </div>

        {/* Closing */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16 md:mt-24"
        >
          <p className="text-foreground/50 text-base md:text-lg italic font-cairo max-w-xl mx-auto">
            {t(
              "“كل مكان زرناه ترك فينا أثرًا… وكل أثر صار جزءًا من هذه الحكاية.”",
              "“Every place we visited left a mark… and every mark became part of this story.”"
            )}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default JourneySection;
