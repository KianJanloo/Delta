"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable from "@/components/dashboard/admin/shared/AdminResourceTable";
import AdminPaginationControls from "@/components/dashboard/admin/shared/AdminPaginationControls";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import { showToast } from "@/core/toast/toast";
import { getAllSocialMediaLinks, type GetAllSocialMediaLinksParams, type ISocialMediaLink } from "@/utils/service/api/social-media-links/getAllSocialMediaLinks";
import { createSocialMediaLink, type CreateSocialMediaLinkPayload } from "@/utils/service/api/social-media-links/createSocialMediaLink";
import { updateSocialMediaLink, type UpdateSocialMediaLinkPayload } from "@/utils/service/api/social-media-links/updateSocialMediaLink";
import { deleteSocialMediaLink } from "@/utils/service/api/social-media-links/deleteSocialMediaLink";
import { normalizeList } from "../shared/normalize";
import AdminSocialMediaFilters from "./AdminSocialMediaFilters";
import { useSocialMediaTableColumns } from "./AdminSocialMediaTableColumns";
import AdminSocialMediaFormDialog from "./AdminSocialMediaFormDialog";
import AdminSocialMediaDeleteDialog from "./AdminSocialMediaDeleteDialog";

type DialogMode = "create" | "edit" | "delete" | null;

type SocialLinkItem = ISocialMediaLink & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

const PAGE_SIZE = 10;

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

  const columns = useSocialMediaTableColumns({
    onEdit: (item) => openDialog("edit", item),
    onDelete: (item) => openDialog("delete", item),
  });

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

      <AdminSocialMediaFilters
        platformFilter={platformFilter}
        setPlatformFilter={setPlatformFilter}
        searchDraft={searchDraft}
        setSearchDraft={setSearchDraft}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setPage={setPage}
        isLoading={isLoading}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      <Card className="border-border/70">
        <CardContent className="space-y-4 text-right pt-6">
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

      <AdminSocialMediaFormDialog
        open={isFormDialogOpen}
        onOpenChange={(open) => (!open ? closeDialog() : null)}
        mode={dialogMode === "edit" ? "edit" : "create"}
        platformDraft={platformDraft}
        setPlatformDraft={setPlatformDraft}
        urlDraft={urlDraft}
        setUrlDraft={setUrlDraft}
        isActionLoading={isActionLoading}
        onSubmit={handleSubmitLink}
      />

      <AdminSocialMediaDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => (!open ? closeDialog() : null)}
        selectedLink={selectedLink}
        isActionLoading={isActionLoading}
        onDelete={handleDeleteLink}
      />
    </div>
  );
};

export default AdminSocialMediaLinksContent;
