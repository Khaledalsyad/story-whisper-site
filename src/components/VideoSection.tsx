import { useLang } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { useState } from "react";
import vKilani from "@/assets/video-kilani.jpg";
import vHammamMusa from "@/assets/video-hammam-musa.jpg";
import vWishwash from "@/assets/video-wishwash.jpg";
import vThreepools from "@/assets/video-threepools.jpg";
import vGnai from "@/assets/video-gnai.jpg";
import vSaladin from "@/assets/video-saladin.jpg";
import vFjord from "@/assets/video-fjord.jpg";
import vStCatherine from "@/assets/video-stcatherine.jpg";

import vHitan from "@/assets/video-hitan.jpg";
import vMagicLake from "@/assets/video-magiclake.jpg";
import vLuxorTemple from "@/assets/video-luxor-temple.jpg";
import vHatshepsut from "@/assets/video-hatshepsut.jpg";
import vAbuHaggag from "@/assets/video-abuhaggag.jpg";
import vMummification from "@/assets/video-mummification.jpg";
import vAzharComplex from "@/assets/video-azhar-complex.jpg";
import vArabicFaculty from "@/assets/video-arabic-faculty.jpg";
import vUsulDin from "@/assets/video-usuldin.jpg";
import vSharia from "@/assets/video-sharia.jpg";
import vAbduhHall from "@/assets/video-abduh-hall.jpg";
import vMashyakha from "@/assets/video-mashyakha.jpg";
import vAzharMosque from "@/assets/video-azhar-mosque.jpg";
import vHussein from "@/assets/video-hussein.jpg";

const videos = ([
  // جنوب سيناء
  {
    id: 1,
    region: "جنوب سيناء",
    regionEn: "South Sinai",
    titleAr: "البيوت اليونانية القديمة (حي الكيلاني)",
    titleEn: "Old Greek Houses (Al-Kilani District)",
    descAr: "جولة في البيوت اليونانية القديمة بحي الكيلاني في مدينة الطور.",
    descEn: "A tour of the old Greek houses in Al-Kilani district, El-Tor city.",
    fbUrl: "https://www.facebook.com/reel/2173670483450173",
    thumb: vKilani,
  },
  {
    id: 2,
    region: "جنوب سيناء",
    regionEn: "South Sinai",
    titleAr: "حمام موسى",
    titleEn: "Hammam Musa",
    descAr: "حمام موسى التاريخي بمدينة الطور.",
    descEn: "The historic Hammam Musa in El-Tor city.",
    fbUrl: "https://www.facebook.com/reel/2228951354600322",
    thumb: vHammamMusa,
  },
  {
    id: 3,
    region: "جنوب سيناء",
    regionEn: "South Sinai",
    titleAr: "وادي الوشواش",
    titleEn: "Wadi Al-Wishwash",
    descAr: "رحلة إلى وادي الوشواش في نويبع.",
    descEn: "A journey to Wadi Al-Wishwash in Nuweiba.",
    fbUrl: "https://www.facebook.com/reel/936618018735807",
    thumb: vWishwash,
  },
  {
    id: 4,
    region: "جنوب سيناء",
    regionEn: "South Sinai",
    titleAr: "محمية الثري بولز",
    titleEn: "Three Pools Reserve",
    descAr: "محمية الثري بولز الساحرة في دهب.",
    descEn: "The enchanting Three Pools reserve in Dahab.",
    fbUrl: "https://www.facebook.com/reel/1224080019469117",
    thumb: vThreepools,
  },
  {
    id: 5,
    region: "جنوب سيناء",
    regionEn: "South Sinai",
    titleAr: "وادي چني",
    titleEn: "Wadi Gnai",
    descAr: "جمال وادي چني في دهب.",
    descEn: "The beauty of Wadi Gnai in Dahab.",
    fbUrl: "https://www.facebook.com/reel/1655919219076447",
    thumb: vGnai,
  },
  {
    id: 6,
    region: "جنوب سيناء",
    regionEn: "South Sinai",
    titleAr: "قلعة صلاح الدين الأيوبي",
    titleEn: "Saladin Citadel",
    descAr: "قلعة صلاح الدين الأيوبي في طابا.",
    descEn: "Saladin Citadel in Taba.",
    fbUrl: "https://www.facebook.com/reel/1872336376787059",
    thumb: vSaladin,
  },
  {
    id: 7,
    region: "جنوب سيناء",
    regionEn: "South Sinai",
    titleAr: "خليج فيورد باي",
    titleEn: "Fjord Bay",
    descAr: "خليج فيورد باي الخلاب في طابا.",
    descEn: "The breathtaking Fjord Bay in Taba.",
    thumb: vFjord,
  },
  {
    id: 8,
    region: "جنوب سيناء",
    regionEn: "South Sinai",
    titleAr: "جبل سانت كاترين",
    titleEn: "Mount Saint Catherine",
    descAr: "أعلى قمم مصر، جبل سانت كاترين.",
    descEn: "Egypt's highest peak, Mount Saint Catherine.",
    thumb: vStCatherine,
  },
  // الفيوم
  {
    id: 10,
    region: "الفيوم",
    regionEn: "Fayoum",
    titleAr: "وادي الحيتان",
    titleEn: "Wadi Al-Hitan",
    descAr: "في قلب الصحراء حيث كانت الحيتان تسبح منذ ملايين السنين.",
    descEn: "In the heart of the desert where whales swam millions of years ago.",
    fbUrl: "https://www.facebook.com/reel/1501155804781824",
    thumb: vHitan,
  },
  {
    id: 11,
    region: "الفيوم",
    regionEn: "Fayoum",
    titleAr: "البحيرة السحرية",
    titleEn: "The Magic Lake",
    descAr: "البحيرة السحرية بألوانها المتغيرة في الفيوم.",
    descEn: "The Magic Lake with its changing colors in Fayoum.",
    fbUrl: "https://www.facebook.com/reel/1226540316312330",
    thumb: vMagicLake,
  },
  // الأقصر
  {
    id: 20,
    region: "الأقصر",
    regionEn: "Luxor",
    titleAr: "معبد الأقصر",
    titleEn: "Luxor Temple",
    descAr: "معبد الأقصر العريق على ضفاف النيل.",
    descEn: "The ancient Luxor Temple on the banks of the Nile.",
    fbUrl: "https://www.facebook.com/reel/1466742028268904",
    thumb: vLuxorTemple,
  },
  {
    id: 21,
    region: "الأقصر",
    regionEn: "Luxor",
    titleAr: "معبد حتشبسوت",
    titleEn: "Hatshepsut Temple",
    descAr: "معبد الملكة حتشبسوت في الدير البحري.",
    descEn: "Queen Hatshepsut's temple at Deir el-Bahari.",
    fbUrl: "https://www.facebook.com/reel/2200034264162286",
    thumb: vHatshepsut,
  },
  {
    id: 22,
    region: "الأقصر",
    regionEn: "Luxor",
    titleAr: "مسجد أبو الحجاج",
    titleEn: "Abu Al-Haggag Mosque",
    descAr: "مسجد أبو الحجاج الأقصري داخل معبد الأقصر.",
    descEn: "Abu Al-Haggag Mosque inside Luxor Temple.",
    fbUrl: "https://www.facebook.com/reel/974682125015256",
    thumb: vAbuHaggag,
  },
  {
    id: 23,
    region: "الأقصر",
    regionEn: "Luxor",
    titleAr: "متحف التحنيط",
    titleEn: "Mummification Museum",
    descAr: "متحف التحنيط بالأقصر وأسرار الفراعنة.",
    descEn: "The Mummification Museum in Luxor and the secrets of the Pharaohs.",
    fbUrl: "https://www.facebook.com/reel/986541337278800",
    thumb: vMummification,
  },
] as Array<{
  id: number;
  region: string;
  regionEn: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  fbUrl?: string;
  thumb: string;
}>).map((v) => ({
  ...v,
  videoUrl: v.fbUrl
    ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(v.fbUrl)}&show_text=false&autoplay=false`
    : "https://www.youtube.com/embed/dQw4w9WgXcQ",
}));

const VideoSection = () => {
  const { t } = useLang();
  const [activeVideo, setActiveVideo] = useState<(typeof videos)[0] | null>(null);

  return (
    <section id="videos" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-16"
        >
          <p className="text-accent text-xs md:text-sm tracking-[0.2em] uppercase mb-2 md:mb-3 font-cairo">
            {t("شاهد الحلقات", "Watch Episodes")}
          </p>
          <h2 className="heading-cinematic font-cairo">
            {t("حكايات من كل مكان", "Stories From Every Place")}
          </h2>
        </motion.div>

        {/* Mobile: horizontal snap scroll. Desktop: grid */}
        <div className="md:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory flex gap-3 pb-4 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {videos.map((video) => (
            <div
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="cinematic-card cursor-pointer group snap-start shrink-0 w-[72%]"
            >
              <div className="relative overflow-hidden aspect-video">
                <img src={video.thumb} alt={t(video.titleAr, video.titleEn)} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute top-2 right-2 bg-accent/90 text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded font-cairo">
                  {t(video.region, video.regionEn)}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-accent/80 flex items-center justify-center">
                    <Play className="w-4 h-4 text-accent-foreground ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold font-cairo text-foreground line-clamp-1">{t(video.titleAr, video.titleEn)}</h3>
                <p className="text-muted-foreground text-[11px] mt-0.5 line-clamp-2 font-cairo">{t(video.descAr, video.descEn)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              onClick={() => setActiveVideo(video)}
              className="cinematic-card cursor-pointer group"
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={video.thumb}
                  alt={t(video.titleAr, video.titleEn)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  width={768}
                  height={512}
                />
                <div className="absolute top-2 right-2 bg-accent/90 text-accent-foreground text-[10px] font-bold px-2 py-1 rounded font-cairo">
                  {t(video.region, video.regionEn)}
                </div>
                <div className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-accent/90 flex items-center justify-center glow-accent">
                    <Play className="w-6 h-6 text-accent-foreground ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-base font-bold font-cairo text-foreground">
                  {t(video.titleAr, video.titleEn)}
                </h3>
                <p className="text-muted-foreground text-xs mt-1 line-clamp-2 font-cairo">
                  {t(video.descAr, video.descEn)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-5xl w-full grid md:grid-cols-5 gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:col-span-3 aspect-video bg-muted rounded-lg overflow-hidden">
              <iframe
                src={activeVideo.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={t(activeVideo.titleAr, activeVideo.titleEn)}
              />
            </div>
            <div className="md:col-span-2 flex flex-col justify-center">
              <p className="text-accent text-xs tracking-widest uppercase mb-2 font-cairo">
                {t(activeVideo.region, activeVideo.regionEn)}
              </p>
              <h3 className="heading-cinematic text-2xl font-cairo mb-4">
                {t(activeVideo.titleAr, activeVideo.titleEn)}
              </h3>
              <p className="text-muted-foreground font-cairo leading-relaxed">
                {t(activeVideo.descAr, activeVideo.descEn)}
              </p>
            </div>
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default VideoSection;
