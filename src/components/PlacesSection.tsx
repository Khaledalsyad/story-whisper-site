import { useLang } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, MapPin, Archive } from "lucide-react";
import imgHatshepsut from "@/assets/places/hatshepsut.jpg";
import imgMummification from "@/assets/places/mummification.jpg";
import imgWishwash from "@/assets/places/wishwash.jpg";
import imgKilani from "@/assets/places/kilani.jpg";

type Category = "natural" | "architectural" | "archaeological" | "museum";

interface Place {
  id: number;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  locationAr: string;
  locationEn: string;
  img: string;
  category: Category;
}

const categoryConfig: Record<Category, { ar: string; en: string; classes: string }> = {
  natural: {
    ar: "موقع طبيعي",
    en: "Natural Site",
    classes: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
  },
  architectural: {
    ar: "تراث معماري",
    en: "Architectural Heritage",
    classes: "bg-accent/15 text-accent border-accent/30",
  },
  archaeological: {
    ar: "موقع أثري",
    en: "Archaeological Site",
    classes: "bg-amber-500/15 text-amber-200 border-amber-500/30",
  },
  museum: {
    ar: "متحف تاريخي",
    en: "Historical Museum",
    classes: "bg-primary/20 text-primary-foreground border-primary/40",
  },
};

const places: Place[] = [
  {
    id: 1,
    titleAr: "وادي الوشواش",
    titleEn: "Wadi Al-Wishwash",
    descAr:
      "وادٍ جبلي في قلب سيناء، اتسمى بالوشواش نسبة لصوت الرياح وهي توشوش بين ممراته. الأمطار والسيول نحتت داخل صخوره أحواض وبحيرات عذبة بعمق يصل لـ 8 أمتار في قلب الصحراء.",
    descEn:
      "A mountain wadi in the heart of Sinai, named for the wind whispering through its corridors. Rains and floods carved freshwater pools reaching 8 meters deep in the middle of the desert.",
    locationAr: "جنوب سيناء، مصر",
    locationEn: "South Sinai, Egypt",
    img: imgWishwash,
    category: "natural",
  },
  {
    id: 2,
    titleAr: "البيوت اليونانية",
    titleEn: "The Greek Houses",
    descAr:
      "من أكتر من 150 سنة وصلت مراكب البحارة اليونانيين لساحل الطور، وبنوا بيوتهم من حجر المرجان بشبابيك وبلكونات بلمسة أوروبية. مسجد وكنيسة جنب بعض في مشهد نادر من التعايش.",
    descEn:
      "Over 150 years ago Greek sailors reached El-Tor's shore and built coral-stone houses with European balconies. A mosque and a church standing side by side — a rare scene of coexistence.",
    locationAr: "الطور، جنوب سيناء",
    locationEn: "El-Tor, South Sinai",
    img: imgKilani,
    category: "architectural",
  },
  {
    id: 3,
    titleAr: "وادي الملكات",
    titleEn: "Valley of the Queens",
    descAr:
      "على الضفة الغربية للنيل، اتخذه المصري القديم مقبرة لزوجات الفراعنة وأبنائهم. مقابر منحوتة في قلب الجبل بنقوش وألوان حافظت على حكاياتها أكتر من 3 آلاف سنة.",
    descEn:
      "On the West Bank of the Nile, ancient Egyptians chose this valley as the burial ground for pharaohs' queens and children. Tombs carved into the mountain with paintings preserving their stories for over 3,000 years.",
    locationAr: "الأقصر، مصر",
    locationEn: "Luxor, Egypt",
    img: imgHatshepsut,
    category: "archaeological",
  },
  {
    id: 4,
    titleAr: "متحف التحنيط",
    titleEn: "Mummification Museum",
    descAr:
      "في قلب الأقصر، يحكي المتحف رحلة المصري القديم من الفناء للخلود. أدوات سبقت عصرها، الأواني الكانوبية الأربعة، وموميا الكاهن ماسحرتي اللي لسه ملامحه واضحة بعد أكتر من 3 آلاف سنة.",
    descEn:
      "In the heart of Luxor, the museum tells the ancient Egyptian journey from death to eternity. Tools ahead of their time, the four canopic jars, and the mummy of priest Maaserty whose features remain clear after 3,000 years.",
    locationAr: "الأقصر، مصر",
    locationEn: "Luxor, Egypt",
    img: imgMummification,
    category: "museum",
  },
];

const PlacesSection = () => {
  const { t, lang } = useLang();
  const [active, setActive] = useState<Place | null>(null);

  return (
    <section id="places" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-16"
        >
          <p className="text-accent text-xs md:text-sm tracking-[0.2em] uppercase mb-2 md:mb-3 font-cairo">
            {t("أرشيف المشروع", "Project Archive")}
          </p>
          <h2 className="heading-cinematic font-cairo">
            {t("أماكن تحكي", "Places That Speak")}
          </h2>
          <p className="text-muted-foreground font-cairo mt-4 max-w-2xl mx-auto text-sm md:text-base">
            {t(
              "مواقع حقيقية وثّقها فريق حكاية مكان خلال رحلته الميدانية.",
              "Real locations documented by the Hekayet Makan field team."
            )}
          </p>
        </motion.div>

        {/* Mobile: horizontal snap scroll */}
        <div className="md:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory flex gap-3 pb-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          {places.map((place) => {
            const cat = categoryConfig[place.category];
            return (
              <div
                key={place.id}
                onClick={() => setActive(place)}
                className="cinematic-card group cursor-pointer snap-start shrink-0 w-[70%]"
              >
                <div className="relative overflow-hidden aspect-[3/4]">
                  <img src={place.img} alt={t(place.titleAr, place.titleEn)} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className={`absolute top-2 ${lang === "ar" ? "right-2" : "left-2"} px-2 py-0.5 rounded-full text-[10px] font-bold font-cairo border backdrop-blur-sm ${cat.classes}`}>
                    {t(cat.ar, cat.en)}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-sm font-bold font-cairo text-foreground line-clamp-1">{t(place.titleAr, place.titleEn)}</h3>
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground font-cairo">
                      <MapPin className="w-3 h-3 text-accent" />
                      <span className="truncate">{t(place.locationAr, place.locationEn)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {places.map((place, i) => {
            const cat = categoryConfig[place.category];
            return (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                onClick={() => setActive(place)}
                className="cinematic-card group cursor-pointer flex flex-col"
              >
                <div className="relative overflow-hidden aspect-[3/4]">
                  <img
                    src={place.img}
                    alt={t(place.titleAr, place.titleEn)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    width={768}
                    height={1024}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                  {/* Category badge */}
                  <div
                    className={`absolute top-3 ${lang === "ar" ? "right-3" : "left-3"} px-2.5 py-1 rounded-full text-[11px] font-bold font-cairo backdrop-blur-sm border shadow-lg ${cat.classes}`}
                  >
                    {t(cat.ar, cat.en)}
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold font-cairo text-foreground mb-2">
                      {t(place.titleAr, place.titleEn)}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-cairo">
                      <MapPin className="w-3.5 h-3.5 text-accent" />
                      <span>{t(place.locationAr, place.locationEn)}</span>
                    </div>
                    <p className="text-muted-foreground text-xs font-cairo mt-2 max-h-0 group-hover:max-h-24 overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100 line-clamp-3">
                      {t(place.descAr, place.descEn)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Details modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl w-full bg-card border border-border rounded-2xl overflow-hidden grid md:grid-cols-2 my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute top-4 end-4 z-10 w-10 h-10 rounded-full bg-background/70 backdrop-blur flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-square md:aspect-auto md:min-h-[500px]">
                <img
                  src={active.img}
                  alt={t(active.titleAr, active.titleEn)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent md:bg-gradient-to-r" />
                <div
                  className={`absolute top-4 start-4 px-3 py-1.5 rounded-full text-xs font-bold font-cairo border backdrop-blur-sm shadow-lg ${categoryConfig[active.category].classes}`}
                >
                  {t(categoryConfig[active.category].ar, categoryConfig[active.category].en)}
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-cairo mb-2">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  {t(active.locationAr, active.locationEn)}
                </div>
                <h3 className="heading-cinematic text-3xl font-cairo mb-4">
                  {t(active.titleAr, active.titleEn)}
                </h3>

                <p className="text-foreground/80 font-cairo leading-relaxed mb-6">
                  {t(active.descAr, active.descEn)}
                </p>

                <div className="mt-auto p-4 rounded-lg bg-muted/40 border border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center border border-accent/30">
                    <Archive className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground font-cairo">
                      {t("من أرشيف المشروع", "From the project archive")}
                    </p>
                    <p className="text-sm text-foreground font-cairo font-semibold">
                      {t("حكاية مكان — توثيق ميداني", "Hekayet Makan — Field Documentation")}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PlacesSection;
