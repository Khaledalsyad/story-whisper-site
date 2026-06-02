import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars as DreiStars } from "@react-three/drei";
import * as THREE from "three";
import {
  Eye,
  Users,
  Heart,
  Layers,
  MapPin,
  Quote,
  ChevronLeft,
  ChevronRight,
  Play,
  ImageIcon,
  type LucideIcon,
} from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import analyticsTiktok from "@/assets/analytics-tiktok.jpg";
import analyticsInstagram from "@/assets/analytics-instagram.jpg";
import analyticsFacebook from "@/assets/analytics-facebook.jpg";
import analyticsTopContent from "@/assets/analytics-top-content.jpg";
import vHitan from "@/assets/video-hitan.jpg";
import vMagicLake from "@/assets/video-magiclake.jpg";
import vLuxorTemple from "@/assets/video-luxor-temple.jpg";
import vHatshepsut from "@/assets/video-hatshepsut.jpg";
import vKilani from "@/assets/video-kilani.jpg";
import analyticsAudience from "@/assets/analytics-audience.jpg";

type Mood = "mystery" | "calm" | "adventure" | "history";

interface Place {
  id: string;
  name_ar: string;
  name_en: string;
  region_ar: string;
  region_en: string;
  mood: Mood;
  views: number;
  rating: number;
  reviews_count: number;
  map_x: number;
  map_y: number;
}

const moodHex: Record<Mood, string> = {
  mystery: "#a855f7",
  calm: "#10b981",
  adventure: "#f97316",
  history: "#d97706",
};

const formatNumber = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
};

const formatFull = (n: number) => n.toLocaleString("en-US");

// Convert map_x/map_y (% of Egypt box) to 3D sphere coords
const latLngToVec3 = (mapX: number, mapY: number, radius: number) => {
  const lat = 32 - (mapY / 100) * 10;
  const lng = 25 + (mapX / 100) * 10;
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z] as [number, number, number];
};

// City lat/lng → 3D
const cityToVec3 = (lat: number, lng: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z] as [number, number, number];
};

const Marker = ({
  position,
  color,
  isActive,
  onClick,
}: {
  position: [number, number, number];
  color: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const rotation = useMemo<[number, number, number]>(() => {
    const dir = new THREE.Vector3(...position).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    const e = new THREE.Euler().setFromQuaternion(q);
    return [e.x, e.y, e.z];
  }, [position]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = (t % 2) / 2;
    if (ringRef.current) {
      const s = 0.5 + pulse * 2.5;
      ringRef.current.scale.set(s, s, s);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - pulse);
    }
    const pulse2 = ((t + 1) % 2) / 2;
    if (ring2Ref.current) {
      const s = 0.5 + pulse2 * 2.5;
      ring2Ref.current.scale.set(s, s, s);
      (ring2Ref.current.material as THREE.MeshBasicMaterial).opacity = 0.4 * (1 - pulse2);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <sphereGeometry args={[isActive ? 0.13 : 0.1, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>
      <mesh
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        <sphereGeometry args={[isActive ? 0.06 : 0.045, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh>
        <ringGeometry args={[0.07, 0.085, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.08, 0.1, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring2Ref}>
        <ringGeometry args={[0.08, 0.1, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const EarthMaterial = () => {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal; varying vec3 vPos;
        void main(){ vNormal=normalize(normalMatrix*normal); vPos=position;
          gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }
      `,
      fragmentShader: `
        varying vec3 vNormal; varying vec3 vPos;
        float hash(vec3 p){ p=fract(p*0.3183099+0.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
        float noise(vec3 x){ vec3 p=floor(x); vec3 f=fract(x); f=f*f*(3.0-2.0*f);
          return mix(mix(mix(hash(p+vec3(0,0,0)),hash(p+vec3(1,0,0)),f.x),
                         mix(hash(p+vec3(0,1,0)),hash(p+vec3(1,1,0)),f.x),f.y),
                     mix(mix(hash(p+vec3(0,0,1)),hash(p+vec3(1,0,1)),f.x),
                         mix(hash(p+vec3(0,1,1)),hash(p+vec3(1,1,1)),f.x),f.y),f.z); }
        float fbm(vec3 p){ float v=0.0; float a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.0; a*=0.5;} return v; }
        void main(){
          float n=fbm(vPos*1.4);
          float land=smoothstep(0.48,0.55,n);
          vec3 ocean=mix(vec3(0.02,0.05,0.12),vec3(0.05,0.12,0.22),n);
          float detail=fbm(vPos*6.0);
          vec3 landCol=mix(vec3(0.12,0.18,0.10),vec3(0.25,0.22,0.14),detail);
          vec3 base=mix(ocean,landCol,land);
          vec3 lightDir=normalize(vec3(0.6,0.4,0.8));
          float diff=max(dot(vNormal,lightDir),0.0);
          vec3 color=base*(0.25+diff*0.9);
          float rim=pow(1.0-max(dot(vNormal,vec3(0.0,0.0,1.0)),0.0),2.5);
          color+=vec3(0.2,0.7,0.8)*rim*0.4;
          gl_FragColor=vec4(color,1.0);
        }
      `,
    });
  }, []);
  return <primitive object={material} attach="material" />;
};

const Atmosphere = ({ radius }: { radius: number }) => {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {},
      vertexShader: `varying vec3 vNormal; void main(){ vNormal=normalize(normalMatrix*normal);
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader: `varying vec3 vNormal; void main(){
        float i=pow(0.65-dot(vNormal,vec3(0.0,0.0,1.0)),2.5);
        gl_FragColor=vec4(0.36,0.85,0.95,1.0)*i; }`,
    });
  }, []);
  return (
    <mesh scale={radius}>
      <sphereGeometry args={[1, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

interface CityPoint {
  nameAr: string;
  nameEn: string;
  lat: number;
  lng: number;
  share: number; // % of audience
}

const audienceCities: CityPoint[] = [
  { nameAr: "القاهرة", nameEn: "Cairo", lat: 30.0444, lng: 31.2357, share: 38 },
  { nameAr: "شبرا الخيمة", nameEn: "Shubra El Kheima", lat: 30.1286, lng: 31.2422, share: 21 },
  { nameAr: "الإسكندرية", nameEn: "Alexandria", lat: 31.2001, lng: 29.9187, share: 18 },
  { nameAr: "كفر الدوار", nameEn: "Kafr El-Dawar", lat: 31.1341, lng: 30.1296, share: 13 },
  { nameAr: "الحسينية", nameEn: "El-Husseiniya", lat: 30.8667, lng: 31.9167, share: 10 },
];

const RotatingGlobe = ({
  places,
  cities,
  onSelectPlace,
  selectedPlaceId,
  radius,
}: {
  places: Place[];
  cities: CityPoint[];
  onSelectPlace: (p: Place) => void;
  selectedPlaceId: string | null;
  radius: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.08;
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[radius, 96, 96]}>
        <EarthMaterial />
      </Sphere>
      <Sphere args={[radius * 1.001, 24, 24]}>
        <meshBasicMaterial color="#5eead4" wireframe transparent opacity={0.08} />
      </Sphere>

      {places.map((p) => {
        const pos = latLngToVec3(p.map_x, p.map_y, radius * 1.015);
        return (
          <Marker
            key={p.id}
            position={pos}
            color={moodHex[p.mood]}
            isActive={selectedPlaceId === p.id}
            onClick={() => onSelectPlace(p)}
          />
        );
      })}

      {cities.map((c, i) => {
        const pos = cityToVec3(c.lat, c.lng, radius * 1.015);
        return (
          <Marker
            key={`city-${i}`}
            position={pos}
            color="hsl(30, 90%, 67%)"
            isActive={false}
            onClick={() => {}}
          />
        );
      })}
    </group>
  );
};

const Globe = ({
  places,
  cities,
  onSelectPlace,
  selectedPlaceId,
}: {
  places: Place[];
  cities: CityPoint[];
  onSelectPlace: (p: Place) => void;
  selectedPlaceId: string | null;
}) => {
  const radius = 2;
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 3, 5]} intensity={1.1} color="#ffffff" />
      <directionalLight position={[-5, -2, -3]} intensity={0.3} color="#5eead4" />
      <DreiStars radius={80} depth={60} count={3500} factor={4} fade speed={1} />

      <RotatingGlobe
        places={places}
        cities={cities}
        onSelectPlace={onSelectPlace}
        selectedPlaceId={selectedPlaceId}
        radius={radius}
      />

      <Atmosphere radius={radius * 1.15} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
      />
    </>
  );
};

// ---------- Static content ----------

interface ImpactCard {
  ar: string;
  en: string;
  value: string;
  full: string;
  icon: LucideIcon;
  trend: string;
}

const impactCards: ImpactCard[] = [
  {
    ar: "إجمالي المشاهدات",
    en: "Total Views",
    value: "1.05M",
    full: "1,053,709+",
    icon: Eye,
    trend: "+24%",
  },
  {
    ar: "إجمالي التفاعلات",
    en: "Total Engagements",
    value: "72K",
    full: "72,000+",
    icon: Heart,
    trend: "+18%",
  },
  {
    ar: "نطاق الجمهور",
    en: "Audience Reach",
    value: "190K",
    full: "190,000+",
    icon: Users,
    trend: "+31%",
  },
  {
    ar: "المنصات النشطة",
    en: "Active Platforms",
    value: "4",
    full: "4 platforms",
    icon: Layers,
    trend: "live",
  },
];

interface TopPost {
  titleAr: string;
  titleEn: string;
  platformAr: string;
  platformEn: string;
  views: number;
  thumb: string;
  isVideo?: boolean;
}

const topPosts: TopPost[] = [
  {
    titleAr: "وادي الحيتان",
    titleEn: "Wadi Al-Hitan",
    platformAr: "تيك توك",
    platformEn: "TikTok",
    views: 412_000,
    thumb: vHitan,
    isVideo: true,
  },
  {
    titleAr: "البحيرة السحرية",
    titleEn: "The Magic Lake",
    platformAr: "إنستجرام",
    platformEn: "Instagram",
    views: 287_500,
    thumb: vMagicLake,
    isVideo: true,
  },
  {
    titleAr: "معبد الأقصر",
    titleEn: "Luxor Temple",
    platformAr: "فيسبوك",
    platformEn: "Facebook",
    views: 184_200,
    thumb: vLuxorTemple,
    isVideo: true,
  },
  {
    titleAr: "معبد حتشبسوت",
    titleEn: "Hatshepsut Temple",
    platformAr: "تيك توك",
    platformEn: "TikTok",
    views: 96_400,
    thumb: vHatshepsut,
    isVideo: true,
  },
  {
    titleAr: "البيوت اليونانية القديمة (حي الكيلاني)",
    titleEn: "Old Greek Houses (Al-Kilani District)",
    platformAr: "إنستجرام",
    platformEn: "Instagram",
    views: 73_609,
    thumb: vKilani,
    isVideo: true,
  },
];

interface Testimonial {
  nameAr: string;
  nameEn: string;
  handle: string;
  platformAr: string;
  platformEn: string;
  textAr: string;
  textEn: string;
}

const testimonials: Testimonial[] = [
  {
    nameAr: "مريم حسن",
    nameEn: "Mariam Hassan",
    handle: "@mariam.travels",
    platformAr: "إنستجرام",
    platformEn: "Instagram",
    textAr: "أول مرة أشوف مصر بالشكل ده. حسيت إن البلد بتتكلم معايا.",
    textEn: "First time I see Egypt this way. I felt the country was speaking to me.",
  },
  {
    nameAr: "أحمد سامي",
    nameEn: "Ahmed Samy",
    handle: "@ahmed.s",
    platformAr: "تيك توك",
    platformEn: "TikTok",
    textAr: "المونتاج سينمائي والصوت كأنه فيلم. حجزت رحلة لسيوة بعد الفيديو ده.",
    textEn: "Cinematic editing and the sound feels like a film. I booked a Siwa trip after this.",
  },
  {
    nameAr: "ليلى عبدالله",
    nameEn: "Laila Abdullah",
    handle: "@laila.notes",
    platformAr: "فيسبوك",
    platformEn: "Facebook",
    textAr: "محتوى يحترم العقل ويخلّيك فخور إنك مصري.",
    textEn: "Content that respects your mind and makes you proud to be Egyptian.",
  },
  {
    nameAr: "كريم منير",
    nameEn: "Kareem Mounir",
    handle: "@kareem.m",
    platformAr: "يوتيوب",
    platformEn: "YouTube",
    textAr: "بجد عمل محترم. الكاميرا، الموسيقى، السرد — كل حاجة في مكانها.",
    textEn: "Truly professional work. Camera, music, narration — everything in place.",
  },
  {
    nameAr: "نور الدين",
    nameEn: "Nour El-Din",
    handle: "@nour.eldin",
    platformAr: "إنستجرام",
    platformEn: "Instagram",
    textAr: "بنتظر كل بوست جديد. ده مش محتوى سياحي، ده وثائقي حقيقي.",
    textEn: "I wait for every new post. This isn't tourism content — it's a real documentary.",
  },
];

interface DocItem {
  labelAr: string;
  labelEn: string;
  metricAr: string;
  metricEn: string;
  src?: string;
  collage?: boolean;
}

const docs: DocItem[] = [
  {
    labelAr: "تحليلات تيك توك — لقطة رسمية",
    labelEn: "TikTok Analytics — official snapshot",
    metricAr: "650K مشاهدة • 60K إعجاب",
    metricEn: "650K views • 60K likes",
    src: analyticsTiktok,
  },
  {
    labelAr: "تحليلات إنستجرام — نظرة على المحتوى",
    labelEn: "Instagram Analytics — content overview",
    metricAr: "114.7K مشاهدة • 42.3K وصول",
    metricEn: "114.7K views • 42.3K reach",
    src: analyticsInstagram,
  },
  {
    labelAr: "تحليلات فيسبوك — نظرة على المحتوى",
    labelEn: "Facebook Analytics — content overview",
    metricAr: "289K مشاهدة • 12K تفاعل",
    metricEn: "289K views • 12K interactions",
    src: analyticsFacebook,
  },
  {
    labelAr: "أفضل المحتوى أداءً — تيك توك",
    labelEn: "Top performing content — TikTok",
    metricAr: "124.8K • 59.7K • 35.2K مشاهدة",
    metricEn: "124.8K • 59.7K • 35.2K views",
    src: analyticsTopContent,
  },
  {
    labelAr: "ديموغرافيا الجمهور — العمر والنوع",
    labelEn: "Audience demographics — age & gender",
    metricAr: "18-24 الأعلى • 67% رجال",
    metricEn: "18–24 top • 67% men",
    src: analyticsAudience,
  },
  {
    labelAr: "أصوات الجمهور — كولاج تعليقات",
    labelEn: "Audience voices — comments collage",
    metricAr: "تعليقات حقيقية من المنصات",
    metricEn: "Real comments from platforms",
    collage: true,
  },
];

const collageQuotes: { textAr: string; textEn: string }[] = [
  { textAr: "محتوى يلمس القلب ❤️", textEn: "Content that touches the heart ❤️" },
  { textAr: "أول مرة أحس مصر كده 🇪🇬", textEn: "First time I feel Egypt like this 🇪🇬" },
  { textAr: "تصوير سينمائي رهيب", textEn: "Cinematic shots, incredible" },
  { textAr: "كملوا، إحنا متابعين 🔥", textEn: "Keep going, we're watching 🔥" },
  { textAr: "وثائقي حقيقي مش سياحي", textEn: "A real documentary, not tourism" },
  { textAr: "صوت الراوي ساحر", textEn: "The narrator's voice is magical" },
];

// ---------- Section ----------

const StoriesStatsSection = () => {
  const { t, lang } = useLang();
  const [places, setPlaces] = useState<Place[]>([]);
  const [selected, setSelected] = useState<Place | null>(null);
  const [tIndex, setTIndex] = useState(0);

  useEffect(() => {
    supabase
      .from("story_places")
      .select("*")
      .order("views", { ascending: false })
      .then(({ data }) => {
        if (data) setPlaces(data as Place[]);
      });
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const id = setInterval(() => {
      setTIndex((i) => (i + 1) % testimonials.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  const maxViews = topPosts[0].views;
  const maxShare = audienceCities[0].share;

  return (
    <section id="stories-stats" className="section-padding relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-primary/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative space-y-24">
        {/* ===== Header ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-accent text-sm tracking-[0.3em] uppercase mb-3 font-cairo">
            {t("قصة نجاح", "A Success Story")}
          </p>
          <h2 className="heading-cinematic font-cairo max-w-3xl">
            {t(
              "حين تتحول الحكاية إلى أثر يمتد عبر المنصات",
              "When a story becomes an impact that travels across platforms"
            )}
          </h2>
          <p className="text-muted-foreground font-cairo mt-4 max-w-2xl leading-relaxed">
            {t(
              "أرقام حقيقية، جمهور حقيقي، وأثر يُقاس بمليون مشاهدة وآلاف القلوب التي وقعت في حب مصر من جديد.",
              "Real numbers, a real audience, and an impact measured in a million views and thousands of hearts that fell in love with Egypt again."
            )}
          </p>
        </motion.div>

        {/* ===== 1. Impact Numbers ===== */}
        <div>
          <SectionLabel
            ar="01 — أرقام الأثر"
            en="01 — Impact Numbers"
            t={t}
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {impactCards.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="cinematic-card p-6 relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <c.icon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-[10px] tracking-widest uppercase font-cairo text-accent/80 border border-accent/30 rounded-full px-2 py-0.5">
                    {c.trend}
                  </span>
                </div>
                <p className="text-4xl md:text-5xl font-black text-foreground font-cairo leading-none mb-2 text-gradient-accent">
                  {c.value}
                </p>
                <p className="text-xs text-muted-foreground font-cairo mb-3">
                  {c.full}
                </p>
                <p className="text-sm text-foreground/90 font-cairo">
                  {t(c.ar, c.en)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ===== 2. Audience Distribution ===== */}
        <div>
          <SectionLabel
            ar="02 — توزيع الجمهور"
            en="02 — Audience Distribution"
            t={t}
          />
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Globe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-3 cinematic-card relative overflow-hidden h-[520px]"
            >
              <div className="absolute top-4 start-4 z-10">
                <p className="text-xs text-muted-foreground font-cairo uppercase tracking-wider">
                  {t("من أين يشاهدوننا", "Where they watch from")}
                </p>
                <p className="text-sm text-foreground font-cairo">
                  {t("مصر من الفضاء", "Egypt from above")}
                </p>
              </div>

              <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
                <Suspense fallback={null}>
                  <Globe
                    places={places}
                    cities={audienceCities}
                    onSelectPlace={setSelected}
                    selectedPlaceId={selected?.id ?? null}
                  />
                </Suspense>
              </Canvas>

              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 start-4 end-4 md:end-auto md:max-w-xs bg-background/80 backdrop-blur-xl border border-border rounded-xl p-4"
                >
                  <p className="text-xs text-muted-foreground font-cairo">
                    {t(selected.region_ar, selected.region_en)}
                  </p>
                  <h4 className="text-foreground font-bold font-cairo mb-2">
                    {t(selected.name_ar, selected.name_en)}
                  </h4>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground font-cairo">
                    <Eye className="w-3.5 h-3.5 text-accent" />
                    {formatNumber(selected.views)}
                  </span>
                </motion.div>
              )}
            </motion.div>

            {/* Top cities */}
            <motion.div
              initial={{ opacity: 0, x: lang === "ar" ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-2 cinematic-card p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold font-cairo text-foreground">
                  {t("أكبر مدن الجمهور", "Top audience cities")}
                </h3>
                <span className="text-xs text-muted-foreground font-cairo">
                  Top 5
                </span>
              </div>
              <div className="space-y-5">
                {audienceCities.map((c, i) => {
                  const pct = (c.share / maxShare) * 100;
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin className="w-4 h-4 text-accent shrink-0" />
                          <span className="text-sm font-cairo text-foreground truncate">
                            {t(c.nameAr, c.nameEn)}
                          </span>
                        </div>
                        <span className="text-xs font-cairo text-accent font-semibold shrink-0">
                          {c.share}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="h-full rounded-full"
                          style={{
                            background:
                              "linear-gradient(90deg, hsl(30, 90%, 67%), hsl(35, 60%, 50%))",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ===== 3. Top Performing Content ===== */}
        <div>
          <SectionLabel
            ar="03 — المحتوى الأعلى أداءً"
            en="03 — Top Performing Content"
            t={t}
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {topPosts.map((p, i) => {
              const pct = (p.views / maxViews) * 100;
              return (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="cinematic-card overflow-hidden group cursor-pointer"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={p.thumb}
                      alt={t(p.titleAr, p.titleEn)}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                    <div className="absolute top-3 start-3 text-xs font-cairo text-foreground bg-background/70 backdrop-blur px-2 py-1 rounded-full border border-border">
                      #{i + 1}
                    </div>
                    {p.isVideo && (
                      <div className="absolute top-3 end-3 w-8 h-8 rounded-full bg-accent/90 flex items-center justify-center">
                        <Play className="w-4 h-4 text-accent-foreground fill-accent-foreground ms-0.5" />
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 p-4">
                      <p className="text-[10px] tracking-widest uppercase text-accent font-cairo mb-1">
                        {t(p.platformAr, p.platformEn)}
                      </p>
                      <h4 className="text-sm text-foreground font-bold font-cairo leading-snug line-clamp-2 mb-3">
                        {t(p.titleAr, p.titleEn)}
                      </h4>
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center gap-1.5 text-xs text-foreground font-cairo">
                          <Eye className="w-3.5 h-3.5 text-accent" />
                          <span className="font-bold">{formatNumber(p.views)}</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground font-cairo">
                          {formatFull(p.views)}
                        </span>
                      </div>
                      <div className="h-1 rounded-full bg-background/60 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: i * 0.1 }}
                          className="h-full rounded-full"
                          style={{
                            background:
                              "linear-gradient(90deg, hsl(30, 90%, 67%), hsl(200, 80%, 50%))",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* ===== 4. Audience Testimonials ===== */}
        <div>
          <SectionLabel
            ar="04 — شهادات الجمهور"
            en="04 — Audience Testimonials"
            t={t}
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="cinematic-card relative overflow-hidden p-8 md:p-12 min-h-[280px]"
          >
            <Quote
              className="absolute top-6 end-6 w-24 h-24 text-accent/10"
              strokeWidth={1}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={tIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <p className="text-xl md:text-2xl font-cairo text-foreground leading-relaxed mb-6 max-w-3xl">
                  &ldquo;{t(testimonials[tIndex].textAr, testimonials[tIndex].textEn)}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-bold font-cairo text-accent-foreground"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(30, 90%, 67%), hsl(35, 60%, 50%))",
                    }}
                  >
                    {t(testimonials[tIndex].nameAr, testimonials[tIndex].nameEn).charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground font-cairo">
                      {t(testimonials[tIndex].nameAr, testimonials[tIndex].nameEn)}
                    </p>
                    <p className="text-xs text-muted-foreground font-cairo">
                      {testimonials[tIndex].handle} ·{" "}
                      {t(testimonials[tIndex].platformAr, testimonials[tIndex].platformEn)}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTIndex(i)}
                    aria-label={`testimonial ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === tIndex ? "bg-accent w-8" : "bg-muted w-4 hover:bg-accent/40"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setTIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
                  }
                  className="w-10 h-10 rounded-full border border-border hover:border-accent hover:text-accent text-muted-foreground flex items-center justify-center transition-colors"
                  aria-label="previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTIndex((i) => (i + 1) % testimonials.length)}
                  className="w-10 h-10 rounded-full border border-border hover:border-accent hover:text-accent text-muted-foreground flex items-center justify-center transition-colors"
                  aria-label="next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===== 5. Documentation & Analytics ===== */}
        <div>
          <SectionLabel
            ar="05 — التوثيق والتحليلات"
            en="05 — Documentation & Analytics"
            t={t}
          />
          <p className="text-sm text-muted-foreground font-cairo mb-6 max-w-2xl">
            {t(
              "لقطات حقيقية من لوحات تحليلات المنصات تُثبت نمو الأثر عبر الزمن.",
              "Real snapshots from platform analytics dashboards proving sustained impact growth."
            )}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {docs.map((d, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="cinematic-card overflow-hidden group"
              >
                <div className="relative aspect-video overflow-hidden bg-card">
                  {d.collage ? (
                    <div className="absolute inset-0 p-3 grid grid-cols-2 gap-2">
                      {collageQuotes.map((q, qi) => (
                        <div
                          key={qi}
                          className="rounded-md border border-accent/20 bg-background/60 backdrop-blur p-2 flex items-center justify-center text-center"
                          style={{ transform: `rotate(${(qi % 2 === 0 ? -1 : 1) * (1 + qi * 0.3)}deg)` }}
                        >
                          <p className="text-[10px] md:text-xs text-foreground/90 font-cairo leading-snug line-clamp-3">
                            "{t(q.textAr, q.textEn)}"
                          </p>
                        </div>
                      ))}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
                    </div>
                  ) : (
                    <img
                      src={d.src}
                      alt={t(d.labelAr, d.labelEn)}
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute top-3 end-3 w-8 h-8 rounded-full bg-background/70 backdrop-blur border border-border flex items-center justify-center">
                    {d.collage ? (
                      <Quote className="w-4 h-4 text-accent" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-accent" />
                    )}
                  </div>
                </div>
                <figcaption className="p-4">
                  <p className="text-sm font-bold text-foreground font-cairo mb-1">
                    {t(d.labelAr, d.labelEn)}
                  </p>
                  <p className="text-xs text-accent font-cairo">
                    {t(d.metricAr, d.metricEn)}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const SectionLabel = ({
  ar,
  en,
  t,
}: {
  ar: string;
  en: string;
  t: (a: string, e: string) => string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="flex items-center gap-3 mb-6"
  >
    <span className="h-px flex-1 max-w-12 bg-accent/40" />
    <p className="text-xs tracking-[0.3em] uppercase font-cairo text-accent">
      {t(ar, en)}
    </p>
    <span className="h-px flex-1 bg-border" />
  </motion.div>
);

export default StoriesStatsSection;
