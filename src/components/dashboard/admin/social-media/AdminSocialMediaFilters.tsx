"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminSearchInput from "@/components/dashboard/admin/shared/AdminSearchInput";
import AdminFiltersBar, {
  type AdminFilterTag,
} from "@/components/dashboard/admin/shared/AdminFiltersBar";

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

interface AdminSocialMediaFiltersProps {
  platformFilter: string;
  setPlatformFilter: (value: string) => void;
  searchDraft: string;
  setSearchDraft: (value: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  setPage: (value: number | ((prev: number) => number)) => void;
  isLoading: boolean;
  onApplyFilters: (event?: React.FormEvent<HTMLFormElement>) => void;
  onResetFilters: () => void;
}

export default function AdminSocialMediaFilters({
  platformFilter,
  setPlatformFilter,
  searchDraft,
  setSearchDraft,
  searchValue,
  setSearchValue,
  setPage,
  isLoading,
  onApplyFilters,
  onResetFilters,
}: AdminSocialMediaFiltersProps) {
  const activeFilterTags = useMemo<AdminFilterTag[]>(() => {
    const tags: AdminFilterTag[] = [];
    if (platformFilter !== "all") {
      tags.push({
        key: "platform",
        label: "پلتفرم",
        value: formatPlatformLabel(platformFilter),
        onRemove: () => {
          setPlatformFilter("all");
          setPage(1);
        },
      });
    }
    if (searchValue.trim()) {
      tags.push({
        key: "url",
        label: "آدرس",
        value: searchValue.trim(),
        onRemove: () => {
          setSearchValue("");
          setSearchDraft("");
          setPage(1);
        },
      });
    }
    return tags;
  }, [platformFilter, searchValue, setPlatformFilter, setSearchValue, setSearchDraft, setPage]);

  return (
    <Card className="border-border/70">
      <CardHeader className="space-y-4 text-right">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">فیلتر و جستجو</CardTitle>
            <p className="text-sm text-muted-foreground">
              لینک‌ها را بر اساس پلتفرم یا آدرس فیلتر و مرتب‌سازی کنید.
            </p>
          </div>
        </div>

        <form className="space-y-3" onSubmit={onApplyFilters}>
          <div className="flex flex-wrap gap-3">
            <Select
              value={platformFilter}
              onValueChange={(value) => {
                setPlatformFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="justify-between text-right">
                <SelectValue placeholder="انتخاب پلتفرم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه پلتفرم‌ها</SelectItem>
                {PLATFORM_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {formatPlatformLabel(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <AdminSearchInput
              placeholder="جستجو بر اساس آدرس لینک"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              onClear={() => {
                setSearchDraft("");
                setSearchValue("");
                setPage(1);
              }}
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" variant="secondary" disabled={isLoading}>
              {isLoading ? "در حال اعمال..." : "اعمال فیلتر"}
            </Button>
            <Button type="button" variant="ghost" onClick={onResetFilters} disabled={isLoading}>
              حذف فیلترها
            </Button>
          </div>
        </form>

        <AdminFiltersBar tags={activeFilterTags} />
      </CardHeader>
    </Card>
  );
}

