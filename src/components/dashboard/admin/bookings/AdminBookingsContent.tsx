"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable from "@/components/dashboard/admin/shared/AdminResourceTable";
import AdminPaginationControls from "@/components/dashboard/admin/shared/AdminPaginationControls";
import { normalizeList } from "@/components/dashboard/admin/shared/normalize";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import { showToast } from "@/core/toast/toast";
import { deleteAdminBooking, getAdminBookings, updateAdminBooking, UpdateAdminBookingPayload, type AdminBooking } from "@/utils/service/api/admin";
import AdminBookingsFilters from "./AdminBookingsFilters";
import { useBookingsTableColumns } from "./AdminBookingsTableColumns";
import AdminBookingsStatusDialog from "./AdminBookingsStatusDialog";
import AdminBookingsDeleteDialog from "./AdminBookingsDeleteDialog";

const PAGE_SIZE = 10;

const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: "در انتظار بررسی",
  confirmed: "تایید شده",
  canceled: "لغو شده",
};

const AdminBookingsContent = () => {
  const { formatDateTime, formatNumber } = useAdminFormatters();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [userFilterDraft, setUserFilterDraft] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [statusDraft, setStatusDraft] = useState<string>("pending");
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleFetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await getAdminBookings({
        page,
        limit: PAGE_SIZE,
        sort: "createdAt",
        order,
        status: statusFilter !== "all" ? statusFilter : undefined,
        user_id: userFilter.trim() ? Number(userFilter.trim()) : undefined,
      });
      const list = normalizeList<AdminBooking>(payload);
      setBookings(list);
      setHasNextPage(list.length === PAGE_SIZE);
    } catch (err) {
      console.error("Failed to fetch admin bookings", err);
      setBookings([]);
      setHasNextPage(false);
      setError("بارگذاری رزروها با خطا مواجه شد.");
    } finally {
      setIsLoading(false);
    }
  }, [page, order, statusFilter, userFilter]);

  useEffect(() => {
    handleFetchBookings();
  }, [handleFetchBookings]);

  const handleOpenStatusDialog = useCallback((item: AdminBooking) => {
    const normalized = item.status?.toLowerCase();
    setSelectedBooking(item);
    setStatusDraft(
      normalized && BOOKING_STATUS_LABELS[normalized]
        ? normalized
        : "pending",
    );
    setIsStatusDialogOpen(true);
  }, []);

  const handleOpenDeleteDialog = useCallback((item: AdminBooking) => {
    setSelectedBooking(item);
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

  const handleUpdateBookingStatus = async () => {
    if (!selectedBooking) return;
    setIsActionLoading(true);
    try {
      await updateAdminBooking(selectedBooking.id, { status: statusDraft } as UpdateAdminBookingPayload);
      showToast("success", "وضعیت رزرو با موفقیت به‌روزرسانی شد.");
      setIsStatusDialogOpen(false);
      setSelectedBooking(null);
      await handleFetchBookings();
    } catch (err) {
      console.error("Failed to update booking status", err);
      showToast("error", "به‌روزرسانی وضعیت رزرو با خطا مواجه شد.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;
    setIsActionLoading(true);
    try {
      await deleteAdminBooking(selectedBooking.id);
      showToast("success", "رزرو با موفقیت حذف شد.");
      setIsDeleteDialogOpen(false);
      setSelectedBooking(null);
      const shouldGoPrevPage = bookings.length === 1 && page > 1 && !hasNextPage;
      if (shouldGoPrevPage) {
        setPage((prev) => Math.max(prev - 1, 1));
      } else {
        await handleFetchBookings();
      }
    } catch (err) {
      console.error("Failed to delete booking", err);
      showToast("error", "حذف رزرو با خطا مواجه شد.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const columns = useBookingsTableColumns({
    formatDateTime,
    formatNumber,
    onStatusChange: handleOpenStatusDialog,
    onDelete: handleOpenDeleteDialog,
  });

  const summaryLabel =
    bookings.length > 0
      ? `رزروهای صفحه ${formatNumber(page)}`
      : "رزروی برای نمایش موجود نیست.";

  return (
    <div className="space-y-6" dir="rtl">
      <AdminPageHeader
        title="مدیریت رزروها"
        description="بررسی وضعیت رزروها، ثبت‌های اخیر و روند رسیدگی به درخواست‌ها."
        actions={
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => handleFetchBookings()}
            disabled={isLoading}
          >
            <CalendarClock className="size-4" />
            {isLoading ? "در حال بروزرسانی..." : "بروزرسانی لیست"}
          </Button>
        }
        hint={`رزروهای نمایش داده شده: ${formatNumber(bookings.length)}`}
      />

      <AdminBookingsFilters
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
            data={bookings}
            isLoading={isLoading}
            errorMessage={error}
            emptyMessage="رزروی مطابق فیلتر انتخابی یافت نشد."
            getKey={(item) => `booking-${item.id}`}
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

      <AdminBookingsStatusDialog
        open={isStatusDialogOpen}
        onOpenChange={(open) => {
          setIsStatusDialogOpen(open);
          if (!open) {
            setIsActionLoading(false);
            setSelectedBooking(null);
          }
        }}
        selectedBooking={selectedBooking}
        statusDraft={statusDraft}
        setStatusDraft={setStatusDraft}
        isActionLoading={isActionLoading}
        formatNumber={formatNumber}
        onUpdate={handleUpdateBookingStatus}
      />

      <AdminBookingsDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) {
            setIsActionLoading(false);
            setSelectedBooking(null);
          }
        }}
        selectedBooking={selectedBooking}
        isActionLoading={isActionLoading}
        formatNumber={formatNumber}
        onDelete={handleDeleteBooking}
      />
    </div>
  );
};

export default AdminBookingsContent;
