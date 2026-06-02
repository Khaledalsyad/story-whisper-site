
-- Stories statistics tables
CREATE TABLE public.story_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  region_ar TEXT NOT NULL,
  region_en TEXT NOT NULL,
  mood TEXT NOT NULL CHECK (mood IN ('mystery','calm','adventure','history')),
  views INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  -- Egypt map coordinates (percentage 0-100 for SVG/positioning)
  map_x NUMERIC(5,2) NOT NULL,
  map_y NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.site_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.story_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- Public read access (stats are public)
CREATE POLICY "Anyone can view places stats"
  ON public.story_places FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view site stats"
  ON public.site_stats FOR SELECT
  USING (true);

-- Seed places (Egypt coords as % within a bounding box used by our SVG map)
INSERT INTO public.story_places (name_ar, name_en, region_ar, region_en, mood, views, rating, reviews_count, map_x, map_y) VALUES
  ('وادي الحيتان','Wadi Al-Hitan','الفيوم','Fayoum','mystery',2400000,4.8,240,38,42),
  ('واحة سيوة','Siwa Oasis','مطروح','Matrouh','calm',1800000,4.7,185,12,30),
  ('الصحراء البيضاء','White Desert','الوادي الجديد','New Valley','adventure',1450000,4.9,312,30,55),
  ('دهب','Dahab','جنوب سيناء','South Sinai','calm',2100000,4.9,520,72,38),
  ('جبل سانت كاترين','St. Catherine','جنوب سيناء','South Sinai','adventure',980000,4.8,210,68,45),
  ('قلعة صلاح الدين','Saladin Citadel','طابا','Taba','history',640000,4.6,140,78,28),
  ('مجمع الأزهر','Al-Azhar Complex','القاهرة','Cairo','history',1900000,4.9,410,48,32),
  ('مسجد الحسين','Al-Hussein Mosque','القاهرة','Cairo','history',1100000,4.7,260,49,33),
  ('وادي الوشواش','Wadi Al-Weshwash','نويبع','Nuweiba','adventure',520000,4.6,95,74,35),
  ('البيوت اليونانية','Greek Houses','الطور','El-Tor','history',310000,4.5,72,65,42);

INSERT INTO public.site_stats (key, value) VALUES
  ('total_stories', 47),
  ('total_users', 12840),
  ('total_views', 13250000),
  ('avg_rating', 47);
