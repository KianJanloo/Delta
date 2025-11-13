'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { Coins, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable, { type AdminTableColumn } from "@/components/dashboard/admin/shared/AdminResourceTable";
import { normalizeList } from "@/components/dashboard/admin/shared/normalize";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import { showToast } from "@/core/toast/toast";
import { deleteAdminPayment, getAdminPayments, updateAdminPayment, UpdateAdminPaymentPayload, type AdminPayment } from "@/utils/service/api/admin";
import { cn } from "@/lib/utils";
import AdminPaginationControls from "@/components/dashboard/admin/shared/AdminPaginationControls";
import AdminFiltersBar, { type AdminFilterTag } from "@/components/dashboard/admin/shared/AdminFiltersBar";
import AdminSearchInput from "@/components/dashboard/admin/shared/AdminSearchInput";

const PAGE_SIZE = 10;

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "در انتظار",
  processing: "در حال پردازش",
  review: "نیازمند بازبینی",
  completed: "پرداخت شده",
  paid: "پرداخت شده",
  settled: "تسویه شده",
  success: "موفق",
  cancelled: "لغو شده",
  failed: "ناموفق",
  refunded: "مسترد شده",
  declined: "رد شده",
};

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-600 border-transparent",
  paid: "bg-emerald-500/10 text-emerald-600 border-transparent",
  settled: "bg-emerald-500/10 text-emerald-600 border-transparent",
  success: "bg-emerald-500/10 text-emerald-600 border-transparent",
  pending: "bg-amber-500/10 text-amber-600 border-transparent",
  processing: "bg-amber-500/10 text-amber-600 border-transparent",
  review: "bg-amber-500/10 text-amber-600 border-transparent",
  failed: "bg-rose-500/10 text-rose-600 border-transparent",
  cancelled: "bg-rose-500/10 text-rose-600 border-transparent",
  refunded: "bg-rose-500/10 text-rose-600 border-transparent",
  declined: "bg-rose-500/10 text-rose-600 border-transparent",
  default: "bg-muted text-muted-foreground border-dashed",
};

const AdminPaymentsContent = () => {
  const { formatCurrency, formatDateTime, formatNumber, currencyLabel } = useAdminFormatters();
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [userFilterDraft, setUserFilterDraft] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");
  const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [statusDraft, setStatusDraft] = useState<string>("pending");
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleFetchPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await getAdminPayments({
        page,
        limit: PAGE_SIZE,
        sort: "createdAt",
        order,
        status: statusFilter !== "all" ? statusFilter : undefined,
        userId: userFilter.trim() ? Number(userFilter.trim()) : undefined,
      });
      const list = normalizeList<AdminPayment>(payload);
      setPayments(list);
      setHasNextPage(list.length === PAGE_SIZE);
    } catch (err) {
      console.error("Failed to fetch admin payments", err);
      setPayments([]);
      setHasNextPage(false);
      setError("دریافت اطلاعات پرداخت‌ها با خطا مواجه شد.");
    } finally {
      setIsLoading(false);
    }
  }, [page, order, statusFilter, userFilter]);

  useEffect(() => {
    handleFetchPayments();
  }, [handleFetchPayments]);

  const handleOpenStatusDialog = useCallback((item: AdminPayment) => {
    const normalized = item.status?.toLowerCase();
    setSelectedPayment(item);
    setStatusDraft(
      normalized && PAYMENT_STATUS_LABELS[normalized] ? normalized : "pending",
    );
    setIsStatusDialogOpen(true);
  }, []);

  const handleOpenDeleteDialog = useCallback((item: AdminPayment) => {
    setSelectedPayment(item);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleApplyFilters = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setUserFilter(userFilterDraft);
    setPage(1);
  };

  const handleResetFilters = () => {
    setUserFilterDraft("");
    setUserFilter("");
    setStatusFilter("all");
    setOrder("DESC");
    setPage(1);
  };

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
    if (statusFilter !== "all") {
      tags.push({
        key: "status",
        label: "وضعیت پرداخت",
        value: PAYMENT_STATUS_LABELS[statusFilter] ?? statusFilter,
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
  }, [userFilter, statusFilter, order]);

  const handleUpdatePaymentStatus = async () => {
    if (!selectedPayment) return;
    setIsActionLoading(true);
    try {
      await updateAdminPayment(selectedPayment.id, { status: statusDraft } as UpdateAdminPaymentPayload);
      showToast("success", "وضعیت پرداخت با موفقیت به‌روزرسانی شد.");
      setIsStatusDialogOpen(false);
      setSelectedPayment(null);
      await handleFetchPayments();
    } catch (err) {
      console.error("Failed to update payment status", err);
      showToast("error", "به‌روزرسانی وضعیت پرداخت با خطا مواجه شد.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeletePayment = async () => {
    if (!selectedPayment) return;
    setIsActionLoading(true);
    try {
      await deleteAdminPayment(selectedPayment.id);
      showToast("success", "پرداخت با موفقیت حذف شد.");
      setIsDeleteDialogOpen(false);
      setSelectedPayment(null);
      const shouldGoPrevPage = payments.length === 1 && page > 1 && !hasNextPage;
      if (shouldGoPrevPage) {
        setPage((prev) => Math.max(prev - 1, 1));
      } else {
        await handleFetchPayments();
      }
    } catch (err) {
      console.error("Failed to delete payment", err);
      showToast("error", "حذف پرداخت با خطا مواجه شد.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const columns = useMemo<AdminTableColumn<AdminPayment>[]>(() => [
    {
      key: "id",
      header: "شماره تراکنش",
      className: "whitespace-nowrap",
      cell: (item) => (
        <span className="font-medium text-foreground">
          #{formatNumber(item.id)}
        </span>
      ),
    },
    {
      key: "user",
      header: "شناسه کاربر",
      className: "whitespace-nowrap",
      cell: (item) => formatNumber(item.userId),
    },
    {
      key: "amount",
      header: "مبلغ",
      className: "whitespace-nowrap",
      cell: (item) => formatCurrency(item.amount),
    },
    {
      key: "status",
      header: "وضعیت",
      className: "whitespace-nowrap",
      cell: (item) => {
        const statusKey = item.status?.toLowerCase() ?? "default";
        return (
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
              STATUS_COLORS[statusKey] ?? STATUS_COLORS.default,
            )}
          >
            {PAYMENT_STATUS_LABELS[statusKey] ?? item.status ?? "نامشخص"}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      header: "تاریخ پرداخت",
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
    payments.length > 0
      ? `نمایش ${formatNumber(payments.length)} پرداخت در صفحه ${formatNumber(page)}`
      : "پرداختی برای نمایش وجود ندارد.";

  return (
    <div className="space-y-6" dir="rtl">
      <AdminPageHeader
        title="مدیریت پرداخت‌ها"
        description="ردیابی وضعیت پرداخت‌ها، تسویه‌ها و تراکنش‌های مالی کاربران."
        actions={
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => handleFetchPayments()}
            disabled={isLoading}
          >
            <Coins className="size-4" />
            {isLoading ? "در حال بروزرسانی..." : "بروزرسانی لیست"}
          </Button>
        }
        hint={`جمع پرداخت‌های صفحه: ${formatCurrency(
          payments.reduce((sum, payment) => sum + (payment.amount ?? 0), 0),
          currencyLabel,
        )}`}
      />

      <Card className="border-border/70">
        <CardHeader className="space-y-4 pb-4 text-right">
          <CardTitle className="text-base font-semibold">جستجوی پیشرفته</CardTitle>
          <form className="space-y-3" onSubmit={handleApplyFilters}>
            <div className="flex flex-wrap gap-3">
              <div className="md:col-span-2">
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

              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="justify-between text-right">
                  <SelectValue placeholder="وضعیت پرداخت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="pending">در انتظار</SelectItem>
                  <SelectItem value="processing">در حال پردازش</SelectItem>
                  <SelectItem value="completed">پرداخت شده</SelectItem>
                  <SelectItem value="failed">ناموفق</SelectItem>
                  <SelectItem value="refunded">مسترد شده</SelectItem>
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
            data={payments}
            isLoading={isLoading}
            errorMessage={error}
            emptyMessage="پرداختی با این مشخصات وجود ندارد."
            getKey={(item) => `payment-${item.id}`}
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
            <CardTitle className="text-base font-semibold">سیاست کنترل ریسک</CardTitle>
            <p className="text-sm text-muted-foreground">
              تراکنش‌های با وضعیت «نیازمند بازبینی» یا «ناموفق» به صورت خودکار برای تیم مالی ارسال می‌شوند.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
            <ShieldCheck className="size-4" />
            وضعیت فعال: {statusFilter === "all" ? "همه" : PAYMENT_STATUS_LABELS[statusFilter] ?? statusFilter}
          </span>
        </CardHeader>
      </Card>

      <Dialog
        open={isStatusDialogOpen}
        onOpenChange={(open) => {
          setIsStatusDialogOpen(open);
          if (!open) {
            setIsActionLoading(false);
            setSelectedPayment(null);
          }
        }}
      >
        <DialogContent className="text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>تغییر وضعیت پرداخت</DialogTitle>
            <DialogDescription>
              {selectedPayment
                ? `وضعیت تراکنش شماره ${formatNumber(selectedPayment.id)} را انتخاب کنید.`
                : "وضعیت جدید پرداخت را انتخاب کنید."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={statusDraft} onValueChange={setStatusDraft}>
              <SelectTrigger className="justify-between">
                <SelectValue placeholder="انتخاب وضعیت" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => (
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
            <Button onClick={handleUpdatePaymentStatus} disabled={isActionLoading}>
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
            setSelectedPayment(null);
          }
        }}
      >
        <DialogContent className="text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف پرداخت</DialogTitle>
            <DialogDescription>
              {selectedPayment
                ? `آیا از حذف پرداخت شماره ${formatNumber(selectedPayment.id)} به مبلغ ${formatCurrency(selectedPayment.amount)} مطمئن هستید؟`
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
              onClick={handleDeletePayment}
              disabled={isActionLoading}
            >
              {isActionLoading ? "در حال حذف..." : "حذف پرداخت"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPaymentsContent;

