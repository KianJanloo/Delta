'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MessageSquare,
  RefreshCw,
  Star,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable, {
  type AdminTableColumn,
} from "@/components/dashboard/admin/shared/AdminResourceTable";
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
import AdminFiltersBar, {
  type AdminFilterTag,
} from "@/components/dashboard/admin/shared/AdminFiltersBar";
import AdminSearchInput from "@/components/dashboard/admin/shared/AdminSearchInput";
import { cn } from "@/lib/utils";

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

  const totalRendered = useMemo(
    () => (page - 1) * PAGE_SIZE + comments.length,
    [page, comments.length],
  );

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

  const activeFilterTags = useMemo<AdminFilterTag[]>(() => {
    const tags: AdminFilterTag[] = [];
    if (userFilter.trim()) {
      tags.push({
        key: "userId",
        label: "شناسه کاربر",
        value: userFilter.trim(),
        onRemove: () => {
          setUserFilter("");
          setUserFilterDraft("");
          setPage(1);
        },
      });
    }
    if (houseFilter.trim()) {
      tags.push({
        key: "houseId",
        label: "شناسه ملک",
        value: houseFilter.trim(),
        onRemove: () => {
          setHouseFilter("");
          setHouseFilterDraft("");
          setPage(1);
        },
      });
    }
    if (ratingFilter !== "all") {
      tags.push({
        key: "rating",
        label: "امتیاز",
        value: `${ratingFilter} ستاره`,
        onRemove: () => {
          setRatingFilter("all");
          setPage(1);
        },
      });
    }
    if (order === "ASC") {
      tags.push({
        key: "order",
        label: "مرتب‌سازی",
        value: "قدیمی‌ترین‌ها",
        onRemove: () => {
          setOrder("DESC");
          setPage(1);
        },
      });
    }
    return tags;
  }, [userFilter, houseFilter, ratingFilter, order]);

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

  const columns = useMemo<AdminTableColumn<AdminComment>[]>(() => [
    {
      key: "id",
      header: "شناسه",
      className: "whitespace-nowrap",
      cell: (item) => (
        <span className="font-medium text-foreground">
          #{formatNumber(item.id)}
        </span>
      ),
      mobileLabel: "شناسه",
    },
    {
      key: "content",
      header: "متن نظر",
      cell: (item) => (
        <div className="flex flex-col gap-1">
          {item.title && (
            <span className="font-semibold text-foreground">{item.title}</span>
          )}
          <span className="text-sm text-muted-foreground line-clamp-2">
            {item.caption ?? "—"}
          </span>
        </div>
      ),
      mobileLabel: "متن",
      mobileClassName: "text-right",
    },
    {
      key: "rating",
      header: "امتیاز",
      className: "whitespace-nowrap text-center",
      mobileClassName: "text-sm font-medium text-primary",
      cell: (item) => (
        <span className="inline-flex items-center gap-1">
          <Star className="size-4 text-amber-500" />
          {item.rating ? formatNumber(item.rating) : "—"}
        </span>
      ),
    },
    {
      key: "houseId",
      header: "شناسه ملک",
      className: "whitespace-nowrap",
      mobileClassName: "text-sm font-medium",
      cell: (item) => formatNumber(item.house_id),
    },
    {
      key: "userId",
      header: "شناسه کاربر",
      className: "whitespace-nowrap",
      cell: (item) => formatNumber(item.user_id),
    },
    {
      key: "createdAt",
      header: "تاریخ ثبت",
      className: "whitespace-nowrap",
      cell: (item) => formatDateTime(item.created_at),
    },
    {
      key: "actions",
      header: "عملیات",
      className: "w-[190px]",
      hideOnMobile: true,
      cell: (item) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpenEditDialog(item)}
          >
            جزئیات
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleOpenDeleteDialog(item)}
          >
            حذف
          </Button>
        </div>
      ),
    },
  ], [formatDateTime, formatNumber, handleOpenEditDialog, handleOpenDeleteDialog]);

  const summaryLabel =
    comments.length > 0
      ? `نمایش ${formatNumber(comments.length)} نظر تا ${formatNumber(totalRendered)}`
      : "نظری برای نمایش موجود نیست.";

  return (
    <div className="space-y-6" dir="rtl">
      <AdminPageHeader
        title="مدیریت نظرات"
        description="بازبینی، ویرایش و کنترل نظرات ثبت شده توسط کاربران بر روی املاک."
        actions={(
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => handleFetchComments()}
            disabled={isLoading}
          >
            <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
            {isLoading ? "در حال بروزرسانی..." : "بروزرسانی"}
          </Button>
        )}
        hint={`تعداد نظرات در این صفحه: ${formatNumber(comments.length)}`}
      />

      <Card className="border-border/70">
        <CardHeader className="space-y-4 pb-4 text-right">
          <CardTitle className="text-base font-semibold">
            فیلتر و جستجوی نظرات
          </CardTitle>
          <form className="space-y-3" onSubmit={handleApplyFilters}>
            <div className="flex flex-wrap gap-3">
              <div>
                <AdminSearchInput
                  placeholder="شناسه کاربر"
                  value={userFilterDraft}
                  onChange={(event) => {
                    if (/^\d*$/.test(event.target.value)) {
                      setUserFilterDraft(event.target.value);
                    }
                  }}
                  inputMode="numeric"
                  onClear={() => {
                    setUserFilterDraft("");
                    setUserFilter("");
                    setPage(1);
                  }}
                />
              </div>
              <div>
                <AdminSearchInput
                  placeholder="شناسه ملک"
                  value={houseFilterDraft}
                  onChange={(event) => {
                    if (/^\d*$/.test(event.target.value)) {
                      setHouseFilterDraft(event.target.value);
                    }
                  }}
                  inputMode="numeric"
                  onClear={() => {
                    setHouseFilterDraft("");
                    setHouseFilter("");
                    setPage(1);
                  }}
                />
              </div>
              <Select
                value={ratingFilter}
                onValueChange={(value) => {
                  setRatingFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="justify-between text-right">
                  <SelectValue placeholder="امتیاز" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه امتیازها</SelectItem>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <SelectItem key={rating} value={String(rating)}>
                      {rating} ستاره
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={order}
                onValueChange={(value: "ASC" | "DESC") => {
                  setOrder(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="justify-between text-right">
                  <SelectValue placeholder="مرتب‌سازی" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DESC">جدیدترین‌ها</SelectItem>
                  <SelectItem value="ASC">قدیمی‌ترین‌ها</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" variant="secondary" disabled={isLoading}>
                {isLoading ? "در حال اعمال..." : "اعمال فیلترها"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResetFilters}
                disabled={isLoading}
              >
                حذف فیلترها
              </Button>
            </div>
          </form>
          <AdminFiltersBar tags={activeFilterTags} />
        </CardHeader>
        <CardContent className="space-y-4 text-right">
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

      <Card className="border-dashed border-border/60 bg-subBg/40 text-right dark:bg-muted/10">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-5 text-primary" />
            <div>
              <CardTitle className="text-base font-semibold">
                راهنمای رسیدگی به نظرات
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                نظرات با امتیاز پایین را دقیق‌تر بررسی کنید و در صورت نیاز، پاسخ مناسب برای کاربر ثبت نمایید.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="whitespace-nowrap">
            مجموع نظرات صفحه: {formatNumber(comments.length)}
          </Badge>
        </CardHeader>
      </Card>

      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setIsActionLoading(false);
            setSelectedComment(null);
          }
        }}
      >
        <DialogContent className="text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>ویرایش نظر</DialogTitle>
            <DialogDescription>
              تغییرات مورد نظر را اعمال کرده و سپس ذخیره کنید. در صورت خالی بودن فیلدی، مقدار فعلی تغییر نخواهد کرد.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="comment-title">عنوان</Label>
              <Input
                className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl"
                id="comment-title"
                placeholder="عنوان نظر"
                value={editDraft.title}
                onChange={(event) =>
                  setEditDraft((prev) => ({ ...prev, title: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment-text">متن نظر</Label>
              <Textarea
                className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl"
                id="comment-text"
                placeholder="متن اصلی نظر"
                value={editDraft.caption}
                onChange={(event) =>
                  setEditDraft((prev) => ({ ...prev, caption: event.target.value }))
                }
                rows={4}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="comment-rating">امتیاز</Label>
                <Input
                  className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl"
                  id="comment-rating"
                  placeholder="1 تا 5"
                  value={editDraft.rating}
                  inputMode="numeric"
                  onChange={(event) => {
                    if (event.target.value === "" || /^\d*$/.test(event.target.value)) {
                      setEditDraft((prev) => ({ ...prev, rating: Number(event.target.value) }));
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>امتیاز</Label>
                <Select
                  value={editDraft.rating ? editDraft.rating.toString() : "5"}
                  onValueChange={(value) =>
                    setEditDraft((prev) => ({ ...prev, rating: Number(value) }))
                  }
                  defaultValue="5"
                >
                  <SelectTrigger className="justify-between text-right">
                    <SelectValue placeholder="انتخاب امتیاز" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        {rating} ستاره
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:flex-row-reverse sm:space-x-reverse sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isActionLoading}
            >
              انصراف
            </Button>
            <Button onClick={handleUpdateComment} disabled={isActionLoading}>
              {isActionLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) {
            setIsActionLoading(false);
            setSelectedComment(null);
          }
        }}
      >
        <DialogContent className="text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف نظر</DialogTitle>
            <DialogDescription>
              آیا از حذف این نظر اطمینان دارید؟ این عمل غیرقابل بازگشت است.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:flex-row-reverse sm:space-x-reverse sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isActionLoading}
            >
              انصراف
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteComment}
              disabled={isActionLoading}
            >
              <Trash2 className="size-4" />
              {isActionLoading ? "در حال حذف..." : "حذف نظر"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCommentsContent;


