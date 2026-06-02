import { useLang } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { MapPin, Play } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import place1 from "@/assets/places/wishwash.jpg";
import place2 from "@/assets/places/hatshepsut.jpg";

const HeroSection = () => {
  const { t } = useLang();

  return (
    <section className="relative px-4 pt-4">
      {/* Rounded container with background image */}
      <div className="relative min-h-[95vh] rounded-3xl overflow-hidden">
        {/* Animated Background Image (Ken Burns effect) */}
        <motion.img
          src={heroBg}
          alt="Egyptian landscape"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
          initial={{ scale: 1.1, x: 0, y: 0 }}
          animate={{
            scale: [1.1, 1.25, 1.15, 1.1],
            x: [0, -30, 20, 0],
            y: [0, -15, 10, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Heat haze shimmer */}
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            background:
              "radial-gradient(ellipse at 30% 70%, hsl(30 90% 67% / 0.25), transparent 60%), radial-gradient(ellipse at 70% 30%, hsl(200 80% 40% / 0.15), transparent 60%)",
          }}
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Drifting sand particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-accent/40 blur-sm"
              style={{
                width: `${2 + (i % 4)}px`,
                height: `${2 + (i % 4)}px`,
                top: `${(i * 37) % 100}%`,
                left: `-5%`,
              }}
              animate={{
                x: ["0vw", "110vw"],
                y: [0, (i % 2 === 0 ? -1 : 1) * 40],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 12 + (i % 6),
                repeat: Infinity,
                delay: i * 0.7,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-background/20" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full min-h-[95vh] px-8 md:px-16 pt-24 pb-8">
          {/* Main content area */}
          <div className="flex-1 flex items-center">
            <div className="w-full flex flex-col md:flex-row items-start justify-between gap-12">
              {/* Left side - Text */}
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex items-center gap-2 mb-6"
                >
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-foreground/70 text-sm tracking-widest uppercase font-cairo">
                    {t("مصر • أماكن منسية", "Egypt • Forgotten Places")}
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-5xl md:text-7xl lg:text-8xl font-bold font-cairo leading-tight text-foreground mb-6"
                >
                  {t("كل مكان ليه\nحكاية", "The Journey\nBeyond Your\nImaginary")}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-foreground/60 text-lg md:text-xl max-w-md mb-10 font-cairo"
                >
                  {t(
                    "اكتشف آلاف الأماكن المنسية في مصر مع تجربة سينمائية لا تُنسى",
                    "Discover thousands of beautiful places around Egypt with wonderful cinematic experiences"
                  )}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="flex items-center gap-6"
                >
                  <a
                    href="#videos"
                    className="px-8 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-all duration-300"
                  >
                    {t("ابدأ الرحلة", "Explore Now")}
                  </a>
                  <a
                    href="#videos"
                    className="flex items-center gap-3 text-foreground/80 hover:text-foreground transition-colors duration-300"
                  >
                    <div className="w-12 h-12 rounded-full border border-foreground/30 flex items-center justify-center hover:border-foreground/60 transition-colors">
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                    <span className="text-sm font-cairo">{t("شاهد الفيديو", "Play the video")}</span>
                  </a>
                </motion.div>
              </div>

              {/* Right side - Location cards */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="hidden lg:flex items-end gap-4 self-center"
              >
                <div className="relative w-56 h-72 rounded-2xl overflow-hidden group">
                  <img
                    src={place1}
                    alt="Wadi Al-Wishwash"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    width={400}
                    height={500}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3 text-accent" />
                      <span className="text-foreground text-sm font-semibold font-cairo">
                        {t("وادي الوشواش", "Wadi Al-Wishwash")}
                      </span>
                    </div>
                    <span className="text-foreground/60 text-xs font-cairo">
                      {t("جنوب سيناء، مصر", "South Sinai, Egypt")}
                    </span>
                  </div>
                </div>
                <div className="relative w-44 h-56 rounded-2xl overflow-hidden group opacity-70">
                  <img
                    src={place2}
                    alt="Valley of the Queens"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    width={400}
                    height={500}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3 text-accent" />
                      <span className="text-foreground text-sm font-semibold font-cairo">
                        {t("وادي الملكات", "Valley of the Queens")}
                      </span>
                    </div>
                    <span className="text-foreground/60 text-xs font-cairo">
                      {t("الأقصر، مصر", "Luxor, Egypt")}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom bar - Feature badges + social */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex items-end justify-between mt-8"
          >
            {/* Feature badges */}
            <div className="flex gap-4">
              <div className="px-5 py-3 rounded-xl bg-foreground/10 backdrop-blur-md border border-foreground/10">
                <span className="text-accent font-bold text-sm font-cairo">
                  {t("التميز", "Excellence")}
                </span>
                <p className="text-foreground/50 text-xs mt-1 max-w-[180px] font-cairo">
                  {t("نسعى لتقديم محتوى استثنائي في كل جانب", "Striving for exceptional quality in every aspect")}
                </p>
              </div>
              <div className="hidden sm:block px-5 py-3 rounded-xl bg-foreground/10 backdrop-blur-md border border-foreground/10">
                <span className="text-accent font-bold text-sm font-cairo">
                  {t("الاستدامة", "Sustainable")}
                </span>
                <p className="text-foreground/50 text-xs mt-1 max-w-[180px] font-cairo">
                  {t("نشر الوعي بالأماكن المنسية للحفاظ عليها", "Promoting awareness of forgotten places for preservation")}
                </p>
              </div>
            </div>

            {/* Social icons */}
            <div className="hidden md:flex items-center gap-4 text-foreground/40 text-sm">
              <span className="hover:text-foreground transition-colors cursor-pointer">ig</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">fb</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">tw</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">in</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
