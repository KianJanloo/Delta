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

type SocialLinkItem = {
  id: number;
  platform: string;
  url: string;
};

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

interface AdminSocialMediaDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLink: SocialLinkItem | null;
  isActionLoading: boolean;
  onDelete: () => void;
}

export default function AdminSocialMediaDeleteDialog({
  open,
  onOpenChange,
  selectedLink,
  isActionLoading,
  onDelete,
}: AdminSocialMediaDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => (!open ? onOpenChange(false) : null)}>
      <DialogContent className="max-w-md text-right" dir="rtl">
        <DialogHeader>
          <DialogTitle>حذف لینک</DialogTitle>
          <DialogDescription>
            {selectedLink
              ? `آیا از حذف لینک مربوط به «${formatPlatformLabel(selectedLink.platform)}» مطمئن هستید؟`
              : "آیا از حذف این لینک مطمئن هستید؟"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:flex-row-reverse">
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isActionLoading}
          >
            {isActionLoading ? "در حال حذف..." : "حذف لینک"}
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isActionLoading}>
            انصراف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

