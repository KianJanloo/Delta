"use client";

import { useMemo } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type AdminTableColumn,
} from "@/components/dashboard/admin/shared/AdminResourceTable";

type SocialLinkItem = {
  id: number;
  platform: string;
  url: string;
  createdAt?: string | null;
  updatedAt?: string | null;
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

interface AdminSocialMediaTableColumnsProps {
  onEdit: (item: SocialLinkItem) => void;
  onDelete: (item: SocialLinkItem) => void;
}

export function useSocialMediaTableColumns({
  onEdit,
  onDelete,
}: AdminSocialMediaTableColumnsProps) {
  return useMemo<AdminTableColumn<SocialLinkItem>[]>(
    () => [
      {
        key: "platform",
        header: "پلتفرم",
        className: "w-36 whitespace-nowrap font-semibold text-foreground",
        cell: (item) => formatPlatformLabel(item.platform),
      },
      {
        key: "url",
        header: "آدرس",
        className: "max-w-[320px]",
        cell: (item) => (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
          >
            {item.url}
          </a>
        ),
        mobileClassName: "text-sm leading-6 break-all",
      },
      {
        key: "actions",
        header: "عملیات",
        className: "w-48 whitespace-nowrap",
        cell: (item) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => onEdit(item)}
            >
              <Pencil className="size-4" />
              ویرایش
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(item)}
            >
              <Trash2 className="size-4" />
              حذف
            </Button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete]
  );
}

