'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { Building2, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable, { type AdminTableColumn } from "@/components/dashboard/admin/shared/AdminResourceTable";
import { normalizeList } from "@/components/dashboard/admin/shared/normalize";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import { showToast } from "@/core/toast/toast";
import { deleteAdminHouse, getAdminHouses, updateAdminHouse, type AdminHouse } from "@/utils/service/api/admin";
import { cn } from "@/lib/utils";
import AdminPaginationControls from "@/components/dashboard/admin/shared/AdminPaginationControls";
import AdminFiltersBar, { type AdminFilterTag } from "@/components/dashboard/admin/shared/AdminFiltersBar";
import AdminSearchInput from "@/components/dashboard/admin/shared/AdminSearchInput";

const PAGE_SIZE = 10;

const STATUS_COLORS: Record<string, string> = {
  published: "bg-emerald-500/10 text-emerald-600 border-transparent",
  pending: "bg-amber-500/10 text-amber-600 border-transparent",
  draft: "bg-muted text-muted-foreground border-dashed",
  rejected: "bg-rose-500/10 text-rose-600 border-transparent",
};

const STATUS_LABELS: Record<string, string> = {
  published: "منتشر شده",
  pending: "در انتظار تایید",
  draft: "پیش‌نویس",
  rejected: "رد شده",
};

const AdminPropertiesContent = () => {
  const { formatCurrency, formatDateTime, formatNumber } = useAdminFormatters();
  const [properties, setProperties] = useState<AdminHouse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [sellerFilterDraft, setSellerFilterDraft] = useState("");
  const [sellerFilter, setSellerFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");
  const [selectedHouse, setSelectedHouse] = useState<AdminHouse | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [statusDraft, setStatusDraft] = useState<string>("draft");
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleFetchProperties = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await getAdminHouses({
        page,
        limit: PAGE_SIZE,
        order,
        sort: "createdAt",
        sellerId: sellerFilter.trim() ? Number(sellerFilter.trim()) : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      } as any);
      const list = normalizeList<AdminHouse>(payload);
      setProperties(list);
      setHasNextPage(list.length === PAGE_SIZE);
    } catch (err) {
      console.error("Failed to fetch admin houses", err);
      setProperties([]);
      setHasNextPage(false);
      setError("بارگذاری اطلاعات املاک با خطا مواجه شد.");
    } finally {
      setIsLoading(false);
    }
  }, [page, order, sellerFilter, statusFilter]);

  useEffect(() => {
    handleFetchProperties();
  }, [handleFetchProperties]);

  const handleOpenStatusDialog = useCallback((item: AdminHouse) => {
    const normalized = item.status?.toLowerCase();
    setSelectedHouse(item);
    setStatusDraft(
      normalized && STATUS_LABELS[normalized] ? normalized : "draft",
    );
    setIsStatusDialogOpen(true);
  }, []);

  const handleOpenDeleteDialog = useCallback((item: AdminHouse) => {
    setSelectedHouse(item);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleApplyFilters = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setSellerFilter(sellerFilterDraft);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSellerFilterDraft("");
    setSellerFilter("");
    setStatusFilter("all");
    setOrder("DESC");
    setPage(1);
  };

  const activeFilterTags = useMemo<AdminFilterTag[]>(() => {
    const tags: AdminFilterTag[] = [];
    if (sellerFilter.trim()) {
      tags.push({
        key: "sellerId",
        label: "شناسه فروشنده",
        value: sellerFilter.trim(),
        onRemove: () => {
          setSellerFilter("");
          setSellerFilterDraft("");
          setPage(1);
        },
      });
    }
    if (statusFilter !== "all") {
      tags.push({
        key: "status",
        label: "وضعیت",
        value: STATUS_LABELS[statusFilter] ?? statusFilter,
        onRemove: () => {
          setStatusFilter("all");
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
  }, [sellerFilter, statusFilter, order]);

  const handleUpdateHouseStatus = async () => {
    if (!selectedHouse) return;
    setIsActionLoading(true);
    try {
      await updateAdminHouse(selectedHouse.id, { status: statusDraft });
      showToast("success", "وضعیت ملک با موفقیت به‌روزرسانی شد.");
      setIsStatusDialogOpen(false);
      setSelectedHouse(null);
      await handleFetchProperties();
    } catch (err) {
      console.error("Failed to update house status", err);
      showToast("error", "به‌روزرسانی وضعیت ملک با خطا مواجه شد.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteHouse = async () => {
    if (!selectedHouse) return;
    setIsActionLoading(true);
    try {
      await deleteAdminHouse(selectedHouse.id);
      showToast("success", "ملک با موفقیت حذف شد.");
      setIsDeleteDialogOpen(false);
      setSelectedHouse(null);
      const shouldGoPrevPage = properties.length === 1 && page > 1 && !hasNextPage;
      if (shouldGoPrevPage) {
        setPage((prev) => Math.max(prev - 1, 1));
      } else {
        await handleFetchProperties();
      }
    } catch (err) {
      console.error("Failed to delete house", err);
      showToast("error", "حذف ملک با خطا مواجه شد.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const columns = useMemo<AdminTableColumn<AdminHouse>[]>(() => [
    {
      key: "title",
      header: "عنوان ملک",
      cell: (item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{item.title}</span>
          <span className="text-xs text-muted-foreground">
            شناسه #{formatNumber(item.id)}
          </span>
        </div>
      ),
    },
    {
      key: "seller",
      header: "شناسه فروشنده",
      className: "whitespace-nowrap",
      cell: (item) => formatNumber(item.sellerId),
    },
    {
      key: "price",
      header: "قیمت",
      className: "whitespace-nowrap",
      cell: (item) => formatCurrency(item.price),
    },
    {
      key: "status",
      header: "وضعیت",
      className: "whitespace-nowrap",
      cell: (item) => {
        const statusKey = item.status?.toLowerCase() ?? "draft";
        return (
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
              STATUS_COLORS[statusKey] ?? STATUS_COLORS.draft,
            )}
          >
            {STATUS_LABELS[statusKey] ?? "نامشخص"}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      header: "تاریخ ایجاد",
      className: "whitespace-nowrap",
      cell: (item) => formatDateTime(item.createdAt),
    },
    {
      key: "actions",
      header: "عملیات",
      className: "w-[200px]",
      cell: (item) => (
        <div className="flex items-center justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => handleOpenStatusDialog(item)}>
            تغییر وضعیت
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
  ], [formatCurrency, formatDateTime, formatNumber, handleOpenStatusDialog, handleOpenDeleteDialog]);

  const summaryLabel =
    properties.length > 0
      ? `نمایش ${formatNumber(properties.length)} ملک در صفحه ${formatNumber(page)}`
      : "ملکی برای نمایش موجود نیست.";

  return (
    <div className="space-y-6" dir="rtl">
      <AdminPageHeader
        title="مدیریت املاک"
        description="پایش املاک ثبت‌شده، وضعیت انتشار و جزئیات قیمت‌گذاری فروشندگان."
        actions={
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => handleFetchProperties()}
            disabled={isLoading}
          >
            <Building2 className="size-4" />
            {isLoading ? "در حال بروزرسانی..." : "بروزرسانی لیست"}
          </Button>
        }
        hint={`تعداد املاک در این صفحه: ${formatNumber(properties.length)}`}
      />

      <Card className="border-border/70">
        <CardHeader className="space-y-4 pb-4 text-right">
          <CardTitle className="text-base font-semibold">فیلتر املاک</CardTitle>
          <form className="space-y-3" onSubmit={handleApplyFilters}>
            <div className="grid gap-3 md:grid-cols-4">
              <div className="md:col-span-2">
                <AdminSearchInput
                  placeholder="شناسه فروشنده"
                  value={sellerFilterDraft}
                  onChange={(event) => {
                    if (/^\d*$/.test(event.target.value)) {
                      setSellerFilterDraft(event.target.value);
                    }
                  }}
                  inputMode="numeric"
                  onClear={() => {
                    setSellerFilterDraft("");
                    setSellerFilter("");
                    setPage(1);
                  }}
                />
              </div>

              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="justify-between text-right">
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="published">منتشر شده</SelectItem>
                  <SelectItem value="pending">در انتظار تایید</SelectItem>
                  <SelectItem value="draft">پیش‌نویس</SelectItem>
                  <SelectItem value="rejected">رد شده</SelectItem>
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
            data={properties}
            isLoading={isLoading}
            errorMessage={error}
            emptyMessage="ملکی با این مشخصات پیدا نشد."
            getKey={(item) => `house-${item.id}`}
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
          <div>
            <CardTitle className="text-base font-semibold">نکات پایش هوشمند</CardTitle>
            <p className="text-sm text-muted-foreground">
              سیستم پایش به شکل خودکار املاک با قیمت غیرمتعارف یا وضعیت مبهم را علامت‌گذاری می‌کند.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
            <Filter className="size-4" />
            فیلترهای فعال: {statusFilter !== "all" ? STATUS_LABELS[statusFilter] : "هیچ"}
          </span>
        </CardHeader>
      </Card>

      <Dialog
        open={isStatusDialogOpen}
        onOpenChange={(open) => {
          setIsStatusDialogOpen(open);
          if (!open) {
            setIsActionLoading(false);
            setSelectedHouse(null);
          }
        }}
      >
        <DialogContent className="text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>تغییر وضعیت ملک</DialogTitle>
            <DialogDescription>
              {selectedHouse
                ? `وضعیت ملک ${selectedHouse.title ?? `#${formatNumber(selectedHouse.id)}`} را انتخاب کنید.`
                : "وضعیت جدید ملک را انتخاب کنید."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={statusDraft} onValueChange={setStatusDraft}>
              <SelectTrigger className="justify-between">
                <SelectValue placeholder="انتخاب وضعیت" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-2 sm:flex-row-reverse sm:space-x-reverse sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
              disabled={isActionLoading}
            >
              انصراف
            </Button>
            <Button onClick={handleUpdateHouseStatus} disabled={isActionLoading}>
              {isActionLoading ? "در حال ذخیره..." : "ثبت تغییرات"}
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
            setSelectedHouse(null);
          }
        }}
      >
        <DialogContent className="text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف ملک</DialogTitle>
            <DialogDescription>
              {selectedHouse
                ? `آیا از حذف ملک ${selectedHouse.title ?? `#${formatNumber(selectedHouse.id)}`} اطمینان دارید؟`
                : "این عملیات بازگشت‌پذیر نیست."}
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
              onClick={handleDeleteHouse}
              disabled={isActionLoading}
            >
              {isActionLoading ? "در حال حذف..." : "حذف ملک"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPropertiesContent;

