import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

type Lang = "ar" | "en";

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (ar: string, en: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("ar");
  const isRTL = lang === "ar";

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "ar" ? "en" : "ar"));
  }, []);

  const t = useCallback(
    (ar: string, en: string) => (lang === "ar" ? ar : en),
    [lang]
  );

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
};
