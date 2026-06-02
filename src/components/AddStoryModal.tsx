import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Upload } from "lucide-react";

const storySchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(2000),
  location: z.string().trim().min(1).max(120),
  mood: z.string().trim().min(1).max(40),
  user_name: z.string().trim().min(1).max(60),
});

const MOODS = ["adventure", "mystery", "calm", "romance", "spiritual", "history"];

interface AddStoryModalProps {
  onCreated?: () => void;
}

const AddStoryModal = ({ onCreated }: AddStoryModalProps) => {
  const { t, isRTL } = useLang();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [mood, setMood] = useState("adventure");
  const [userName, setUserName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const reset = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setMood("adventure");
    setUserName("");
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = storySchema.safeParse({
      title,
      description,
      location,
      mood,
      user_name: userName,
    });
    if (!parsed.success) {
      toast.error(t("تأكد من تعبئة جميع الحقول", "Please fill all fields correctly"));
      return;
    }

    setLoading(true);
    try {
      let image_url: string | null = null;

      if (imageFile) {
        if (imageFile.size > 5 * 1024 * 1024) {
          toast.error(t("الحد الأقصى للصورة 5 ميجا", "Max image size is 5MB"));
          setLoading(false);
          return;
        }
        const ext = imageFile.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("stories")
          .upload(path, imageFile, { contentType: imageFile.type });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("stories").getPublicUrl(path);
        image_url = data.publicUrl;
      }

      const { error } = await supabase.from("user_stories").insert([
        {
          title,
          description,
          location,
          mood,
          user_name: userName,
          image_url: image_url ?? undefined,
        },
      ]);
      if (error) throw error;

      toast.success(t("تم نشر حكايتك بنجاح", "Your story was published"));
      reset();
      setOpen(false);
      onCreated?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          {t("شارك حكايتك", "Share your story")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle>{t("شارك حكايتك", "Share your story")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user_name">{t("اسمك", "Your name")}</Label>
            <Input
              id="user_name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              maxLength={60}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">{t("العنوان", "Title")}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t("الوصف", "Description")}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              rows={4}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="location">{t("المكان", "Location")}</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={120}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{t("الإحساس", "Mood")}</Label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MOODS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">{t("صورة (اختياري)", "Image (optional)")}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
            {imageFile && (
              <p className="text-xs text-muted-foreground truncate">{imageFile.name}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("نشر", "Publish")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStoryModal;
