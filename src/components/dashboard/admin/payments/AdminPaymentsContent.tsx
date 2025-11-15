"use client";

import { useCallback, useEffect, useState } from "react";
import { Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable from "@/components/dashboard/admin/shared/AdminResourceTable";
import AdminPaginationControls from "@/components/dashboard/admin/shared/AdminPaginationControls";
import { normalizeList } from "@/components/dashboard/admin/shared/normalize";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import { showToast } from "@/core/toast/toast";
import { deleteAdminPayment, getAdminPayments, updateAdminPayment, UpdateAdminPaymentPayload, type AdminPayment } from "@/utils/service/api/admin";
import AdminPaymentsFilters from "./AdminPaymentsFilters";
import { usePaymentsTableColumns } from "./AdminPaymentsTableColumns";
import AdminPaymentsStatusDialog from "./AdminPaymentsStatusDialog";
import AdminPaymentsDeleteDialog from "./AdminPaymentsDeleteDialog";

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

  const columns = usePaymentsTableColumns({
    formatCurrency,
    formatDateTime,
    formatNumber,
    onStatusChange: handleOpenStatusDialog,
    onDelete: handleOpenDeleteDialog,
  });

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

      <AdminPaymentsFilters
        userFilterDraft={userFilterDraft}
        setUserFilterDraft={setUserFilterDraft}
        userFilter={userFilter}
        setUserFilter={setUserFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
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

      <AdminPaymentsStatusDialog
        open={isStatusDialogOpen}
        onOpenChange={(open) => {
          setIsStatusDialogOpen(open);
          if (!open) {
            setIsActionLoading(false);
            setSelectedPayment(null);
          }
        }}
        selectedPayment={selectedPayment}
        statusDraft={statusDraft}
        setStatusDraft={setStatusDraft}
        isActionLoading={isActionLoading}
        formatNumber={formatNumber}
        onUpdate={handleUpdatePaymentStatus}
      />

      <AdminPaymentsDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) {
            setIsActionLoading(false);
            setSelectedPayment(null);
          }
        }}
        selectedPayment={selectedPayment}
        isActionLoading={isActionLoading}
        formatCurrency={formatCurrency}
        formatNumber={formatNumber}
        onDelete={handleDeletePayment}
      />
    </div>
  );
};

export default AdminPaymentsContent;
