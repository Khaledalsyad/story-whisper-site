import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MapPin, User, Sparkles, Flame, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddStoryModal from "./AddStoryModal";
import { toast } from "sonner";

interface UserStory {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  location: string;
  mood: string;
  user_name: string;
  likes: number;
  created_at: string;
}

const ALL = "__all__";

const StoryCard = ({
  story,
  onLike,
  liked,
}: {
  story: UserStory;
  onLike: (id: string) => void;
  liked: boolean;
}) => {
  const { t } = useLang();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card className="overflow-hidden h-full bg-card border-border hover:border-accent/50 transition-colors">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {story.image_url ? (
            <img
              src={story.image_url}
              alt={story.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Sparkles className="h-10 w-10" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Badge className="absolute top-3 start-3 bg-accent text-accent-foreground capitalize">
            {story.mood}
          </Badge>
        </div>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-bold text-lg line-clamp-1">{story.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{story.description}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {story.location}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {story.user_name}
            </span>
          </div>
          <Button
            variant={liked ? "default" : "outline"}
            size="sm"
            className="w-full gap-2"
            onClick={() => onLike(story.id)}
            disabled={liked}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            {story.likes} {t("إعجاب", "Likes")}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const StoriesSection = () => {
  const { t } = useLang();
  const [stories, setStories] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationFilter, setLocationFilter] = useState<string>(ALL);
  const [moodFilter, setMoodFilter] = useState<string>(ALL);
  const [tab, setTab] = useState<"newest" | "popular">("newest");
  const [likedIds, setLikedIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      return new Set(JSON.parse(localStorage.getItem("liked_stories") || "[]"));
    } catch {
      return new Set();
    }
  });

  const fetchStories = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("user_stories")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(error.message);
    } else {
      setStories(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const handleLike = useCallback(
    async (id: string) => {
      if (likedIds.has(id)) return;
      // Optimistic
      setStories((prev) =>
        prev.map((s) => (s.id === id ? { ...s, likes: s.likes + 1 } : s))
      );
      const next = new Set(likedIds);
      next.add(id);
      setLikedIds(next);
      localStorage.setItem("liked_stories", JSON.stringify([...next]));

      const { error } = await supabase.rpc("increment_story_likes", { story_id: id });
      if (error) {
        // rollback
        setStories((prev) =>
          prev.map((s) => (s.id === id ? { ...s, likes: Math.max(0, s.likes - 1) } : s))
        );
        const rollback = new Set(next);
        rollback.delete(id);
        setLikedIds(rollback);
        localStorage.setItem("liked_stories", JSON.stringify([...rollback]));
        toast.error(error.message);
      }
    },
    [likedIds]
  );

  const locations = useMemo(
    () => Array.from(new Set(stories.map((s) => s.location))),
    [stories]
  );
  const moods = useMemo(
    () => Array.from(new Set(stories.map((s) => s.mood))),
    [stories]
  );

  const filtered = useMemo(() => {
    return stories.filter(
      (s) =>
        (locationFilter === ALL || s.location === locationFilter) &&
        (moodFilter === ALL || s.mood === moodFilter)
    );
  }, [stories, locationFilter, moodFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    if (tab === "popular") {
      copy.sort((a, b) => b.likes - a.likes);
    } else {
      copy.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return copy;
  }, [filtered, tab]);

  const trending = useMemo(
    () => [...stories].sort((a, b) => b.likes - a.likes).slice(0, 3).filter((s) => s.likes > 0),
    [stories]
  );

  return (
    <section id="stories" className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3">
              {t("حكايات الزوار", "Visitor Stories")}
            </h2>
            <p className="text-muted-foreground max-w-xl">
              {t(
                "شارك تجربتك واقرأ حكايات غيرك من كل بقاع مصر",
                "Share your experience and read stories from across Egypt"
              )}
            </p>
          </div>
          <AddStoryModal onCreated={fetchStories} />
        </div>

        {/* Trending */}
        {trending.length > 0 && (
          <div className="mb-10">
            <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <Flame className="h-5 w-5 text-accent" />
              {t("الأكثر تفاعلًا", "Trending now")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {trending.map((s) => (
                  <StoryCard
                    key={s.id}
                    story={s}
                    onLike={handleLike}
                    liked={likedIds.has(s.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder={t("المكان", "Location")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{t("كل الأماكن", "All locations")}</SelectItem>
              {locations.map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={moodFilter} onValueChange={setMoodFilter}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder={t("الإحساس", "Mood")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{t("كل الأحاسيس", "All moods")}</SelectItem>
              {moods.map((m) => (
                <SelectItem key={m} value={m} className="capitalize">{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "newest" | "popular")}>
          <TabsList>
            <TabsTrigger value="newest" className="gap-2">
              <Clock className="h-4 w-4" />
              {t("الأحدث", "Newest")}
            </TabsTrigger>
            <TabsTrigger value="popular" className="gap-2">
              <Flame className="h-4 w-4" />
              {t("الأكثر شعبية", "Popular")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-video w-full" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : sorted.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                {t("لا توجد حكايات بعد. كن أول من يشارك!", "No stories yet. Be the first!")}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                  {sorted.map((s) => (
                    <StoryCard
                      key={s.id}
                      story={s}
                      onLike={handleLike}
                      liked={likedIds.has(s.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default StoriesSection;
