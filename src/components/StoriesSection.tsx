import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Heart, Eye, Users, Film } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Testimonial {
  quote: string;
  author: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "المشروع الوحيد اللي قد إيه بلدنا فيها أماكن تحفة عاش بجد ❤️",
    author: "ياسمين أشرف",
  },
  {
    quote: "ما شاء الله عليكم ربنا يوفقكم وبجد أماكن جديدة أول مرة نعرفها عن طريقكم ❤️",
    author: "Princess Zoza",
  },
  {
    quote: "السياحة في أمان لسنين قدام ❤️",
    author: "محمد غازي",
  },
  {
    quote: "كل الدعم لشباب حكاية مكان ❤️",
    author: "سلوى شريف",
  },
  {
    quote: "عاش يا شباب ❤️",
    author: "أحمد فهمي",
  },
];

const StoriesSection = () => {
  const { t } = useLang();
  const [index, setIndex] = useState(0);

  const stats = [
    { icon: Heart, value: "+72K", labelAr: "تفاعل", labelEn: "Interactions" },
    { icon: Eye, value: "+1M", labelAr: "مشاهدة", labelEn: "Views" },
    { icon: Users, value: "+2K", labelAr: "متابع", labelEn: "Followers" },
    { icon: Film, value: "19", labelAr: "حلقة منشورة", labelEn: "Published Episodes" },
  ];

  const next = () => setIndex((i) => (i + 1) % TESTIMONIALS.length);
  const prev = () => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  useEffect(() => {
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, []);

  const current = TESTIMONIALS[index];

  return (
    <section id="stories" className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t("ماذا قال الجمهور عن حكاية مكان؟", "What the audience said about Hekayet Makan")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t(
              "آراء حقيقية من متابعينا الذين تفاعلوا مع محتوى المشروع.",
              "Real reactions from our followers who engaged with the project."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          {/* Testimonial carousel */}
          <div className="lg:col-span-3">
            <Card className="relative h-full overflow-hidden border-accent/30 bg-gradient-to-br from-card via-card to-accent/5">
              <CardContent className="p-8 md:p-12 flex flex-col justify-between min-h-[360px]">
                <Quote className="h-12 w-12 text-accent/40 mb-6" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="flex-1"
                  >
                    <p className="text-xl md:text-2xl leading-relaxed font-medium mb-8">
                      {current.quote}
                    </p>
                    <p className="text-accent font-semibold text-lg">
                      — {current.author}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <div className="flex gap-2">
                    {TESTIMONIALS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setIndex(i)}
                        aria-label={`Go to testimonial ${i + 1}`}
                        className={`h-2 rounded-full transition-all ${
                          i === index ? "w-8 bg-accent" : "w-2 bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={prev} aria-label="Previous">
                      <ChevronRight className="h-4 w-4 rtl:hidden" />
                      <ChevronLeft className="h-4 w-4 ltr:hidden" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={next} aria-label="Next">
                      <ChevronLeft className="h-4 w-4 rtl:hidden" />
                      <ChevronRight className="h-4 w-4 ltr:hidden" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Community stats panel */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.value}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Card className="h-full border-border hover:border-accent/50 transition-colors">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3 h-full">
                      <div className="p-3 rounded-full bg-accent/10">
                        <Icon className="h-6 w-6 text-accent" />
                      </div>
                      <div className="text-3xl md:text-4xl font-bold">{s.value}</div>
                      <div className="text-sm text-muted-foreground">
                        {t(s.labelAr, s.labelEn)}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoriesSection;
