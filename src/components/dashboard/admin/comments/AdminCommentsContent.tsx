"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable from "@/components/dashboard/admin/shared/AdminResourceTable";
import { normalizeList } from "@/components/dashboard/admin/shared/normalize";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import { showToast } from "@/core/toast/toast";
import {
  deleteAdminComment,
  getAdminComments,
  updateAdminComment,
  type AdminComment,
} from "@/utils/service/api/admin";
import AdminPaginationControls from "@/components/dashboard/admin/shared/AdminPaginationControls";
import { cn } from "@/lib/utils";
import AdminCommentsFilters from "./AdminCommentsFilters";
import { useCommentsTableColumns } from "./AdminCommentsTableColumns";
import AdminCommentsEditDialog from "./AdminCommentsEditDialog";
import AdminCommentsDeleteDialog from "./AdminCommentsDeleteDialog";

const PAGE_SIZE = 8;

const AdminCommentsContent = () => {
  const { formatDateTime, formatNumber } = useAdminFormatters();
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");
  const [userFilterDraft, setUserFilterDraft] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [houseFilterDraft, setHouseFilterDraft] = useState("");
  const [houseFilter, setHouseFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [selectedComment, setSelectedComment] = useState<AdminComment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [editDraft, setEditDraft] = useState({
    title: "",
    caption: "",
    rating: 0,
  });

  const handleFetchComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await getAdminComments({
        page,
        limit: PAGE_SIZE,
        sort: "created_at",
        order,
        user_id: userFilter.trim() ? Number(userFilter.trim()) : undefined,
        house_id: houseFilter.trim() ? Number(houseFilter.trim()) : undefined,
        rating: ratingFilter !== "all" ? Number(ratingFilter) : undefined,
      });

      const list = normalizeList<AdminComment>(payload);
      setComments(list);
      setHasNextPage(list.length === PAGE_SIZE);
    } catch (err) {
      console.error("Failed to fetch admin comments", err);
      setComments([]);
      setHasNextPage(false);
      setError("بارگذاری نظرات با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  }, [page, order, userFilter, houseFilter, ratingFilter]);

  useEffect(() => {
    handleFetchComments();
  }, [handleFetchComments]);

  const handleApplyFilters = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setUserFilter(userFilterDraft);
    setHouseFilter(houseFilterDraft);
    setPage(1);
  };

  const handleResetFilters = () => {
    setUserFilterDraft("");
    setUserFilter("");
    setHouseFilterDraft("");
    setHouseFilter("");
    setRatingFilter("all");
    setOrder("DESC");
    setPage(1);
  };

  const handleOpenEditDialog = useCallback((item: AdminComment) => {
    setSelectedComment(item);
    setEditDraft({
      title: item.title ?? "",
      caption: item.caption ?? "",
      rating: item.rating ? Number(item.rating) : 0,
    });
    setIsEditDialogOpen(true);
  }, []);

  const handleOpenDeleteDialog = useCallback((item: AdminComment) => {
    setSelectedComment(item);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleUpdateComment = async () => {
    if (!selectedComment) return;
    setIsActionLoading(true);
    try {
      const payload: Record<string, unknown> = {};

      if (editDraft.title.trim()) payload.title = editDraft.title.trim();
      if (editDraft.caption.trim()) payload.caption = editDraft.caption.trim();
      if (editDraft.rating) {
        const numericRating = Number(editDraft.rating);
        if (!Number.isNaN(numericRating) && numericRating >= 1 && numericRating <= 5) {
          payload.rating = numericRating;
        }
      }

      await updateAdminComment(selectedComment.id, payload);
      showToast("success", "نظر با موفقیت به‌روزرسانی شد.");
      setIsEditDialogOpen(false);
      setSelectedComment(null);
      await handleFetchComments();
    } catch (err) {
      console.error("Failed to update comment", err);
      showToast("error", "ذخیره تغییرات نظر با خطا مواجه شد.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!selectedComment) return;
    setIsActionLoading(true);
    try {
      await deleteAdminComment(selectedComment.id);
      showToast("success", "نظر با موفقیت حذف شد.");
      setIsDeleteDialogOpen(false);
      const shouldGoPrevPage = comments.length === 1 && page > 1 && !hasNextPage;
      if (shouldGoPrevPage) {
        setPage((prev) => Math.max(prev - 1, 1));
      } else {
        await handleFetchComments();
      }
    } catch (err) {
      console.error("Failed to delete comment", err);
      showToast("error", "حذف نظر با خطا مواجه شد.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const columns = useCommentsTableColumns({
    formatDateTime,
    formatNumber,
    onEdit: handleOpenEditDialog,
    onDelete: handleOpenDeleteDialog,
  });

  const totalRendered = (page - 1) * PAGE_SIZE + comments.length;
  const summaryLabel =
    comments.length > 0
      ? `نمایش ${formatNumber(comments.length)} نظر تا ${formatNumber(totalRendered)}`
      : "نظری برای نمایش موجود نیست.";

  return (
    <div className="space-y-6" dir="rtl">
      <AdminPageHeader
        title="مدیریت نظرات"
        description="بازبینی، ویرایش و کنترل نظرات ثبت شده توسط کاربران بر روی املاک."
        actions={
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => handleFetchComments()}
            disabled={isLoading}
          >
            <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
            {isLoading ? "در حال بروزرسانی..." : "بروزرسانی"}
          </Button>
        }
        hint={`تعداد نظرات در این صفحه: ${formatNumber(comments.length)}`}
      />

      <AdminCommentsFilters
        userFilterDraft={userFilterDraft}
        setUserFilterDraft={setUserFilterDraft}
        userFilter={userFilter}
        setUserFilter={setUserFilter}
        houseFilterDraft={houseFilterDraft}
        setHouseFilterDraft={setHouseFilterDraft}
        houseFilter={houseFilter}
        setHouseFilter={setHouseFilter}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
        order={order}
        setOrder={setOrder}
        setPage={setPage}
        isLoading={isLoading}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      <Card className="border-border/70">
        <CardContent className="space-y-4 text-right pt-6">
          <AdminResourceTable
            columns={columns}
            data={comments}
            isLoading={isLoading}
            errorMessage={error}
            emptyMessage="نظری با این مشخصات یافت نشد."
            getKey={(item) => `comment-${item.id}`}
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

      <AdminCommentsEditDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setIsActionLoading(false);
            setSelectedComment(null);
          }
        }}
        editDraft={editDraft}
        setEditDraft={setEditDraft}
        isActionLoading={isActionLoading}
        onUpdate={handleUpdateComment}
      />

      <AdminCommentsDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) {
            setIsActionLoading(false);
            setSelectedComment(null);
          }
        }}
        isActionLoading={isActionLoading}
        onDelete={handleDeleteComment}
      />
    </div>
  );
};

export default AdminCommentsContent;
