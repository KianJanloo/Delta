"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PLATFORM_OPTIONS = [
  "instagram",
  "telegram",
  "whatsapp",
  "linkedin",
  "facebook",
  "twitter",
  "youtube",
  "aparat",
  "website",
];

const formatPlatformLabel = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "instagram":
      return "اینستاگرام";
    case "telegram":
      return "تلگرام";
    case "whatsapp":
      return "واتساپ";
    case "linkedin":
      return "لینکدین";
    case "facebook":
      return "فیس‌بوک";
    case "twitter":
      return "توئیتر";
    case "youtube":
      return "یوتیوب";
    case "aparat":
      return "آپارات";
    case "website":
      return "وب‌سایت";
    default:
      return platform;
  }
};

interface AdminSocialMediaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  platformDraft: string;
  setPlatformDraft: (value: string) => void;
  urlDraft: string;
  setUrlDraft: (value: string) => void;
  isActionLoading: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function AdminSocialMediaFormDialog({
  open,
  onOpenChange,
  mode,
  platformDraft,
  setPlatformDraft,
  urlDraft,
  setUrlDraft,
  isActionLoading,
  onSubmit,
}: AdminSocialMediaFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => (!open ? onOpenChange(false) : null)}>
      <DialogContent className="max-w-lg text-right" dir="rtl">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "ویرایش لینک" : "لینک جدید"}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "پلتفرم و آدرس لینک را بروزرسانی کنید."
              : "برای افزودن لینک جدید، پلتفرم مربوطه و آدرس کامل را وارد کنید."}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="social-platform">پلتفرم</Label>
            <Select
              value={platformDraft || "custom"}
              onValueChange={(value) => {
                if (value === "custom") {
                  setPlatformDraft("");
                } else {
                  setPlatformDraft(value);
                }
              }}
            >
              <SelectTrigger className="justify-between text-right">
                <SelectValue placeholder="انتخاب پلتفرم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">پلتفرم دلخواه</SelectItem>
                {PLATFORM_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {formatPlatformLabel(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl remove-number-spin"
              id="social-platform"
              placeholder="مثلاً: instagram"
              value={platformDraft}
              onChange={(event) => setPlatformDraft(event.target.value)}
              disabled={isActionLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="social-url">آدرس لینک</Label>
            <Input
              className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl remove-number-spin"
              id="social-url"
              placeholder="https://instagram.com/delta"
              value={urlDraft}
              onChange={(event) => setUrlDraft(event.target.value)}
              disabled={isActionLoading}
              required
            />
          </div>
          <DialogFooter className="gap-2 sm:flex-row-reverse">
            <Button type="submit" disabled={isActionLoading}>
              {isActionLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isActionLoading}>
              انصراف
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

