import { useLang } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { Film, MapPin, Sparkles, Camera, Code, Pen, Video, Users } from "lucide-react";
import ahmedRami from "@/assets/ahmed-rami.jpg";
import ahmedWael from "@/assets/ahmed-wael.jpg";
import ahmedWaelProfile from "@/assets/ahmed-wael-new.jpg";
import hassanAlaa from "@/assets/hassan-alaa.jpg";
import ahmedSalah from "@/assets/ahmed-salah.jpg";
import abdullahFares from "@/assets/abdullah-fares.jpg";
import aminSalah from "@/assets/amin-salah.jpg";
import khaledAbdullah from "@/assets/khaled-abdullah.jpg";
import ahmedMahmoud from "@/assets/ahmed-mahmoud.jpg";
import abdulrahmanFarag from "@/assets/abdulrahman-farag.jpg";
import khaledMohamed from "@/assets/khaled-mohamed.jpg";
import supervisorPhoto from "@/assets/supervisor.jpg";

type Member = {
  nameAr: string;
  nameEn: string;
  img: string;
  roleAr: string;
  roleEn: string;
  contribAr: string;
  contribEn: string;
  icon: React.ComponentType<{ className?: string }>;
  skills: [string, string][];
};

const team: Member[] = [
  {
    nameAr: "أحمد رامي ربيع",
    nameEn: "Ahmed Rami Rabie",
    img: abdullahFares,
    roleAr: "منسق المشروع ومصمم الهوية البصرية",
    roleEn: "Project Coordinator & Visual Identity Designer",
    contribAr: "صمم الهوية البصرية للمشروع وساهم في تنسيق وتنظيم سير العمل بين أعضاء الفريق",
    contribEn: "Designed the project's visual identity and contributed to coordinating and organizing workflow among team members",
    icon: Sparkles,
    skills: [
      ["الهوية البصرية", "Visual Identity"],
      ["تنسيق المشاريع", "Project Coordination"],
      ["الجرافيك", "Graphic Design"],
    ],
  },
  {
    nameAr: "أحمد وائل",
    nameEn: "Ahmed Wael",
    img: ahmedWaelProfile,
    roleAr: "مسؤول التسويق الرقمي والسوشيال ميديا",
    roleEn: "Digital Marketing & Social Media Manager",
    contribAr: "أدار المنصات الرقمية وساهم في نشر المحتوى وتعزيز التفاعل مع الجمهور",
    contribEn: "Managed digital platforms and contributed to publishing content and boosting audience engagement",
    icon: Video,
    skills: [
      ["التسويق الرقمي", "Digital Marketing"],
      ["إدارة المحتوى", "Content Management"],
      ["تحليل البيانات", "Data Analytics"],
    ],
  },
  {
    nameAr: "الحسن علاء",
    nameEn: "Al-Hassan Alaa",
    img: ahmedMahmoud,
    roleAr: "مسؤول المونتاج وما بعد الإنتاج",
    roleEn: "Editor & Post-Production Lead",
    contribAr: "تولى عمليات المونتاج والمعالجة البصرية وإخراج الحلقات بالشكل النهائي",
    contribEn: "Handled editing operations, visual processing, and final episode production",
    icon: Film,
    skills: [
      ["المونتاج", "Video Editing"],
      ["معالجة ما بعد الإنتاج", "Post-Production"],
      ["الإخراج", "Direction"],
    ],
  },
  {
    nameAr: "خالد عبدالله",
    nameEn: "Khaled Abdullah",
    img: ahmedRami,
    roleAr: "مطور المنصة الرقمية",
    roleEn: "Lead Developer",
    contribAr: "طوّر المنصة الرقمية وحوّل فكرة المشروع إلى تجربة تفاعلية متكاملة",
    contribEn: "Developed the digital platform and transformed the project idea into an integrated interactive experience",
    icon: Code,
    skills: [
      ["تطوير الواجهات", "Frontend Development"],
      ["React", "React"],
      ["تجربة المستخدم", "UX Design"],
    ],
  },
  {
    nameAr: "أمين صلاح محمد",
    nameEn: "Amin Salah Mohamed",
    img: khaledAbdullah,
    roleAr: "كاتب المشروع",
    roleEn: "Project Author",
    contribAr: "وضع الفكرة الأساسية للمشروع وساهم في بناء رؤيته السردية وتطوير محتواه",
    contribEn: "Established the core project idea and contributed to building its narrative vision and developing its content",
    icon: Pen,
    skills: [
      ["كتابة السيناريو", "Script Writing"],
      ["السرد القصصي", "Storytelling"],
      ["البحث", "Research"],
    ],
  },
  {
    nameAr: "أحمد محمود",
    nameEn: "Ahmed Mahmoud",
    img: aminSalah,
    roleAr: "مسؤول التصوير الميداني",
    roleEn: "Field Photographer",
    contribAr: "وثق المواقع والرحلات من خلال التصوير الميداني ونقل تفاصيل الأماكن بصريًا",
    contribEn: "Documented locations and trips through field photography and visually captured place details",
    icon: Camera,
    skills: [
      ["التصوير الميداني", "Field Photography"],
      ["التصوير السينمائي", "Cinematography"],
      ["التوثيق", "Documentation"],
    ],
  },
  {
    nameAr: "أحمد صلاح الدين",
    nameEn: "Ahmed Salah El-Din",
    img: ahmedSalah,
    roleAr: "كاتب المحتوى والسيناريو",
    roleEn: "Content & Script Writer",
    contribAr: "كتب النصوص والسيناريوهات الخاصة بالحلقات وساهم في بناء السرد القصصي للمشروع",
    contribEn: "Wrote episode scripts and storylines and contributed to building the project's narrative storytelling",
    icon: Pen,
    skills: [
      ["كتابة المحتوى", "Content Writing"],
      ["السيناريو", "Screenwriting"],
      ["تحرير النصوص", "Copy Editing"],
    ],
  },
  {
    nameAr: "عبدالرحمن فرج",
    nameEn: "Abdulrahman Farag",
    img: khaledMohamed,
    roleAr: "مسؤول العلاقات العامة",
    roleEn: "Public Relations Manager",
    contribAr: "شارك في التنسيق والتواصل مع الجهات والشخصيات الداعمة للمشروع",
    contribEn: "Participated in coordinating and communicating with organizations and supporters of the project",
    icon: MapPin,
    skills: [
      ["التواصل", "Communication"],
      ["التنسيق", "Coordination"],
      ["بناء العلاقات", "Relationship Building"],
    ],
  },
  {
    nameAr: "عبدالله فارس",
    nameEn: "Abdullah Fares",
    img: ahmedWael,
    roleAr: "عضو فريق الاتصال",
    roleEn: "Communication Team Member",
    contribAr: "نسّق التواصل مع الجهات والشخصيات المشاركة وساهم في ترتيب اللقاءات والتغطيات",
    contribEn: "Coordinated communication with stakeholders and participants and helped arrange meetings and coverage",
    icon: Users,
    skills: [
      ["العلاقات الخارجية", "External Relations"],
      ["الشراكات", "Partnerships"],
      ["إدارة اللقاءات", "Meeting Management"],
    ],
  },
  {
    nameAr: "خالد محمد",
    nameEn: "Khaled Mohamed",
    img: hassanAlaa,
    roleAr: "عضو فريق الاتصال",
    roleEn: "Communication Team Member",
    contribAr: "شارك في بناء العلاقات والتنسيق مع الجهات والأفراد لدعم تنفيذ المشروع",
    contribEn: "Participated in building relationships and coordinating with organizations and individuals to support project implementation",
    icon: Users,
    skills: [
      ["العلاقات الخارجية", "External Relations"],
      ["التنسيق", "Coordination"],
      ["التواصل المؤسسي", "Corporate Communication"],
    ],
  },
];

const TeamSection = () => {
  const { t } = useLang();
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <section
      id="team"
      className="section-padding relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at top, hsl(215 40% 8%) 0%, hsl(222 50% 4%) 50%, hsl(222 60% 2%) 100%)",
      }}
    >
      {/* Floating golden particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => {
          const size = 4 + (i % 5) * 3;
          const left = (i * 53) % 100;
          const top = (i * 37) % 100;
          const dur = 8 + (i % 6);
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                left: `${left}%`,
                top: `${top}%`,
                background: "radial-gradient(circle, hsl(30 90% 67% / 0.7), transparent 70%)",
                filter: "blur(1px)",
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: dur,
                repeat: Infinity,
                ease: "easeInOut",
                delay: (i % 5) * 0.7,
              }}
            />
          );
        })}
      </div>

      {/* Ambient glow */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-primary/30 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-16"
        >
          <p className="text-accent text-xs md:text-sm tracking-[0.3em] uppercase mb-4 font-cairo">
            {t("أعضاء المشروع", "Project Members")}
          </p>
          <h2 className="heading-cinematic font-cairo mb-4">
            <span className="text-gradient-accent">{t("فريق العمل", "Our Team")}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg font-cairo">
            {t("العقول وراء التجربة", "The minds behind the experience")}
          </p>
        </motion.div>

        {/* Supervisor */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto mb-8 md:mb-16 max-w-sm"
        >
          <div className="relative rounded-3xl border border-accent/30 bg-white/[0.04] backdrop-blur-xl p-5 md:p-8 text-center shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-accent/20 blur-3xl" />
            <p className="text-accent text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3 md:mb-4 font-cairo relative">
              {t("المشرف على المشروع", "Project Supervisor")}
            </p>
            <div className="relative w-20 h-20 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden border-2 border-accent shadow-[0_0_40px_hsl(var(--accent)/0.5)] mb-3 md:mb-4">
              <img src={supervisorPhoto} alt="supervisor" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold font-cairo text-foreground relative">
              {t("د. محمود شهاب", "Dr. Mahmoud Shehab")}
            </h3>
            <p className="text-xs text-muted-foreground font-cairo mt-1 relative">
              {t("مشرف المشروع الأكاديمي", "Academic Supervisor")}
            </p>
          </div>
        </motion.div>

        {/* Team grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {team.map((member, i) => {
            const Icon = member.icon;
            const isActive = activeId === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (i % 6) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                onHoverStart={() => setActiveId(i)}
                onHoverEnd={() => setActiveId(null)}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-3 md:p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-500 hover:border-accent/40 hover:shadow-[0_0_50px_hsl(30_90%_67%/0.25)]"
              >
                {/* Soft light reflection */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-accent/10 blur-3xl group-hover:bg-accent/25 transition-all duration-500" />

                {/* Top: avatar + name */}
                <div className="relative flex flex-col items-center text-center mb-2.5">
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-accent/50 shadow-[0_0_20px_hsl(var(--accent)/0.4)] mb-2"
                  >
                    <img
                      src={member.img}
                      alt={t(member.nameAr, member.nameEn)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-background border border-accent/50 flex items-center justify-center">
                      <Icon className="w-2.5 h-2.5 text-accent" />
                    </div>
                  </motion.div>
                  <h3 className="text-xs md:text-sm font-bold font-cairo text-foreground line-clamp-1">
                    {t(member.nameAr, member.nameEn)}
                  </h3>
                  <p className="text-[10px] text-accent font-cairo mt-0.5 tracking-wider line-clamp-1">
                    {t(member.roleAr, member.roleEn)}
                  </p>
                </div>

                {/* Contribution */}
                <div className="relative rounded-lg border border-white/5 bg-black/30 p-2 mb-2">
                  <p className="text-[10px] text-foreground/85 font-cairo leading-snug line-clamp-2">
                    {t(member.contribAr, member.contribEn)}
                  </p>
                </div>

                {/* Skills */}
                <div className="relative flex flex-wrap gap-1">
                  {member.skills.map((s, k) => (
                    <span
                      key={k}
                      className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[9px] text-accent font-cairo"
                    >
                      {t(s[0], s[1])}
                    </span>
                  ))}
                </div>

                {/* Extended overlay on hover */}
                <motion.div
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-accent/10 via-transparent to-transparent"
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-24 pt-12 border-t border-border/30 relative"
      >
        <p className="text-accent font-cairo text-lg font-bold mb-2">
          {t("حكاية مكان", "Hekayet Makan")}
        </p>
        <p className="text-muted-foreground text-sm font-cairo">
          {t("كل مكان ليه حكاية © ٢٠٢٦", "Every Place Has a Story © 2026")}
        </p>
      </motion.div>
    </section>
  );
};

export default TeamSection;
