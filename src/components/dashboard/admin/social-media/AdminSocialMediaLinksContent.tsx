'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link2, Pencil, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable, { type AdminTableColumn } from "@/components/dashboard/admin/shared/AdminResourceTable";
import AdminFiltersBar, { type AdminFilterTag } from "@/components/dashboard/admin/shared/AdminFiltersBar";
import AdminSearchInput from "@/components/dashboard/admin/shared/AdminSearchInput";
import AdminPaginationControls from "@/components/dashboard/admin/shared/AdminPaginationControls";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import { showToast } from "@/core/toast/toast";
import { getAllSocialMediaLinks, type GetAllSocialMediaLinksParams, type ISocialMediaLink } from "@/utils/service/api/social-media-links/getAllSocialMediaLinks";
import { createSocialMediaLink, type CreateSocialMediaLinkPayload } from "@/utils/service/api/social-media-links/createSocialMediaLink";
import { updateSocialMediaLink, type UpdateSocialMediaLinkPayload } from "@/utils/service/api/social-media-links/updateSocialMediaLink";
import { deleteSocialMediaLink } from "@/utils/service/api/social-media-links/deleteSocialMediaLink";
import { normalizeList } from "../shared/normalize";

type DialogMode = "create" | "edit" | "delete" | null;

type SocialLinkItem = ISocialMediaLink & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

const PAGE_SIZE = 10;

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

const AdminSocialMediaLinksContent = () => {
  const { formatNumber } = useAdminFormatters();
  const [links, setLinks] = useState<SocialLinkItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [searchDraft, setSearchDraft] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedLink, setSelectedLink] = useState<SocialLinkItem | null>(null);
  const [platformDraft, setPlatformDraft] = useState("");
  const [urlDraft, setUrlDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchLinks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: GetAllSocialMediaLinksParams = {
        page,
        limit: PAGE_SIZE,
        ...(platformFilter !== "all" ? { platform: platformFilter } : {}),
        ...(searchValue.trim() ? { url: searchValue.trim() } : {}),
      };
      const payload = await getAllSocialMediaLinks(params);
      const list = normalizeList<SocialLinkItem>(payload);
      setLinks(list);
      setHasNextPage(payload.totalCount === PAGE_SIZE);
    } catch (err) {
      console.error("Failed to fetch social media links", err);
      setLinks([]);
      setHasNextPage(false);
      setError("بارگذاری لینک‌های شبکه‌های اجتماعی با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  }, [page, platformFilter, searchValue]);

  useEffect(() => {
    handleFetchLinks();
  }, [handleFetchLinks]);

  const filteredLinks = useMemo(() => {
    if (!searchValue.trim()) {
      return links;
    }
    const query = searchValue.trim().toLowerCase();
    return links.filter((item) => item.url.toLowerCase().includes(query));
  }, [links, searchValue]);

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
  }, [platformFilter, searchValue]);

  const openDialog = useCallback(
    (mode: Exclude<DialogMode, null>, link?: SocialLinkItem) => {
      setDialogMode(mode);
      if (link) {
        setSelectedLink(link);
        setPlatformDraft(link.platform);
        setUrlDraft(link.url);
      } else {
        setSelectedLink(null);
        setPlatformDraft("");
        setUrlDraft("");
      }
    },
    [],
  );

  const closeDialog = useCallback(() => {
    setDialogMode(null);
    setSelectedLink(null);
    setPlatformDraft("");
    setUrlDraft("");
    setIsActionLoading(false);
  }, []);

  const handleApplyFilters = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setSearchValue(searchDraft.trim());
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchDraft("");
    setSearchValue("");
    setPlatformFilter("all");
    setPage(1);
  };

  const handleSubmitLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedPlatform = platformDraft.trim();
    const trimmedUrl = urlDraft.trim();

    if (!trimmedPlatform) {
      showToast("error", "لطفاً نام پلتفرم را وارد کنید.");
      return;
    }
    if (!trimmedUrl) {
      showToast("error", "لطفاً آدرس لینک را وارد کنید.");
      return;
    }
    if (!/^https?:\/\//i.test(trimmedUrl)) {
      showToast("error", "آدرس باید با http یا https شروع شود.");
      return;
    }

    const payload: CreateSocialMediaLinkPayload = {
      platform: trimmedPlatform.toLowerCase(),
      url: trimmedUrl,
    };

    setIsActionLoading(true);
    try {
      if (dialogMode === "create") {
        await createSocialMediaLink(payload);
        showToast("success", "لینک جدید با موفقیت ایجاد شد.");
      } else if (dialogMode === "edit" && selectedLink) {
        const updatePayload: UpdateSocialMediaLinkPayload = {
          platform: payload.platform,
          url: payload.url,
        };
        await updateSocialMediaLink(selectedLink.id, updatePayload);
        showToast("success", "لینک با موفقیت بروزرسانی شد.");
      }
      closeDialog();
      await handleFetchLinks();
    } catch (err) {
      console.error("Failed to submit social media link", err);
      showToast("error", "عملیات ذخیره لینک با خطا مواجه شد.");
      setIsActionLoading(false);
    }
  };

  const handleDeleteLink = async () => {
    if (!selectedLink) return;
    setIsActionLoading(true);
    try {
      await deleteSocialMediaLink(selectedLink.id);
      showToast("success", "لینک با موفقیت حذف شد.");
      const shouldGoPrevPage = links.length === 1 && page > 1 && !hasNextPage;
      closeDialog();
      if (shouldGoPrevPage) {
        setPage((prev) => Math.max(prev - 1, 1));
      } else {
        await handleFetchLinks();
      }
    } catch (err) {
      console.error("Failed to delete social media link", err);
      showToast("error", "حذف لینک با خطا مواجه شد.");
      setIsActionLoading(false);
    }
  };

  const columns = useMemo<AdminTableColumn<SocialLinkItem>[]>(() => [
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
            onClick={() => openDialog("edit", item)}
          >
            <Pencil className="size-4" />
            ویرایش
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-destructive hover:bg-destructive/10"
            onClick={() => openDialog("delete", item)}
          >
            <Trash2 className="size-4" />
            حذف
          </Button>
        </div>
      ),
    },
  ], [openDialog]);

  const summaryLabel =
    filteredLinks.length > 0
      ? `نمایش ${formatNumber(filteredLinks.length)} لینک در صفحه ${formatNumber(page)}`
      : "لینکی برای نمایش وجود ندارد.";

  const isFormDialogOpen = dialogMode === "create" || dialogMode === "edit";
  const isDeleteDialogOpen = dialogMode === "delete";

  return (
    <div className="space-y-6" dir="rtl">
      <AdminPageHeader
        title="مدیریت شبکه‌های اجتماعی"
        description="لینک‌های رسمی مجموعه در شبکه‌های اجتماعی را به‌روزرسانی و مدیریت کنید."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => handleFetchLinks()}
              disabled={isLoading}
            >
              <RefreshCcw className="size-4" />
              {isLoading ? "در حال بروزرسانی..." : "بروزرسانی"}
            </Button>
            <Button className="gap-2" onClick={() => openDialog("create")}>
              <Plus className="size-4" />
              لینک جدید
            </Button>
          </div>
        }
        hint={summaryLabel}
      />

      {error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:border-rose-400/30 dark:bg-rose-500/5 dark:text-rose-300">
          {error}
        </div>
      ) : null}

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

          <form className="space-y-3" onSubmit={handleApplyFilters}>
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
              <Button type="button" variant="ghost" onClick={handleResetFilters} disabled={isLoading}>
                حذف فیلترها
              </Button>
            </div>
          </form>

          <AdminFiltersBar tags={activeFilterTags} />
        </CardHeader>

        <CardContent className="space-y-4 text-right">
          <AdminResourceTable
            columns={columns}
            data={filteredLinks}
            isLoading={isLoading}
            emptyMessage="لینکی مطابق جستجو یافت نشد."
            getKey={(item) => `social-link-${item.id}`}
          />

          <AdminPaginationControls
            page={page}
            hasNextPage={hasNextPage}
            isLoading={isLoading}
            onPrevious={() => setPage((prev) => Math.max(prev - 1, 1))}
            onNext={() => setPage((prev) => (hasNextPage ? prev + 1 : prev))}
            formatNumber={formatNumber}
            summary={summaryLabel}
          />
        </CardContent>
      </Card>

      <Card className="border-dashed border-border/60 bg-subBg/40 text-right dark:bg-muted/10">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Link2 className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">یکپارچگی برند</CardTitle>
              <p className="text-sm text-muted-foreground">
                لینک‌ها را به صورت ماهانه بررسی کنید تا از صحت و به‌روز بودن مسیرها و تطابق با استراتژی برند اطمینان حاصل شود.
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Dialog open={isFormDialogOpen} onOpenChange={(open) => (!open ? closeDialog() : null)}>
        <DialogContent className="max-w-lg text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>{dialogMode === "edit" ? "ویرایش لینک" : "لینک جدید"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "edit"
                ? "پلتفرم و آدرس لینک را بروزرسانی کنید."
                : "برای افزودن لینک جدید، پلتفرم مربوطه و آدرس کامل را وارد کنید."}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmitLink}>
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
              <Button type="button" variant="outline" onClick={closeDialog} disabled={isActionLoading}>
                انصراف
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => (!open ? closeDialog() : null)}>
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
              onClick={handleDeleteLink}
              disabled={isActionLoading}
            >
              {isActionLoading ? "در حال حذف..." : "حذف لینک"}
            </Button>
            <Button type="button" variant="outline" onClick={closeDialog} disabled={isActionLoading}>
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSocialMediaLinksContent;


