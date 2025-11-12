'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarClock, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable, { type AdminTableColumn } from "@/components/dashboard/admin/shared/AdminResourceTable";
import { normalizeList } from "@/components/dashboard/admin/shared/normalize";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import { getAdminBookings, type AdminBooking } from "@/utils/service/api/admin";
import { cn } from "@/lib/utils";
import AdminPaginationControls from "@/components/dashboard/admin/shared/AdminPaginationControls";
import AdminFiltersBar, { type AdminFilterTag } from "@/components/dashboard/admin/shared/AdminFiltersBar";
import AdminSearchInput from "@/components/dashboard/admin/shared/AdminSearchInput";

const PAGE_SIZE = 10;

const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: "در انتظار بررسی",
  processing: "در حال پردازش",
  on_hold: "متوقف موقت",
  confirmed: "تایید شده",
  completed: "تکمیل شده",
  approved: "تایید شده",
  cancelled: "لغو شده",
  rejected: "رد شده",
  failed: "ناموفق",
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-emerald-500/10 text-emerald-600 border-transparent",
  completed: "bg-emerald-500/10 text-emerald-600 border-transparent",
  approved: "bg-emerald-500/10 text-emerald-600 border-transparent",
  pending: "bg-amber-500/10 text-amber-600 border-transparent",
  processing: "bg-amber-500/10 text-amber-600 border-transparent",
  on_hold: "bg-amber-500/10 text-amber-600 border-transparent",
  cancelled: "bg-rose-500/10 text-rose-600 border-transparent",
  rejected: "bg-rose-500/10 text-rose-600 border-transparent",
  failed: "bg-rose-500/10 text-rose-600 border-transparent",
  default: "bg-muted text-muted-foreground border-dashed",
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

  const columns = useMemo<AdminTableColumn<AdminBooking>[]>(() => [
    {
      key: "id",
      header: "شناسه رزرو",
      className: "whitespace-nowrap",
      cell: (item) => (
        <span className="font-medium text-foreground">
          #{formatNumber(item.id)}
        </span>
      ),
    },
    {
      key: "userId",
      header: "کاربر",
      className: "whitespace-nowrap",
      cell: (item) => formatNumber(item.userId),
    },
    {
      key: "houseId",
      header: "شناسه ملک",
      className: "whitespace-nowrap",
      cell: (item) => formatNumber(item.houseId),
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
            {BOOKING_STATUS_LABELS[statusKey] ?? item.status ?? "نامشخص"}
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
  ], [formatDateTime, formatNumber]);

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
        label: "وضعیت",
        value: BOOKING_STATUS_LABELS[statusFilter] ?? statusFilter,
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

      <Card className="border-border/70">
        <CardHeader className="space-y-4 pb-4 text-right">
          <CardTitle className="text-base font-semibold">فیلتر رزروها</CardTitle>
          <form className="space-y-3" onSubmit={handleApplyFilters}>
            <div className="grid gap-3 md:grid-cols-4">
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
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="pending">در انتظار بررسی</SelectItem>
                  <SelectItem value="processing">در حال پردازش</SelectItem>
                  <SelectItem value="confirmed">تایید شده</SelectItem>
                  <SelectItem value="completed">تکمیل شده</SelectItem>
                  <SelectItem value="cancelled">لغو شده</SelectItem>
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

      <Card className="border-dashed border-border/60 bg-subBg/40 text-right dark:bg-muted/10">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">یادداشت‌های عملیات</CardTitle>
            <p className="text-sm text-muted-foreground">
              روند رسیدگی به رزروها بر اساس اولویت وضعیت انجام می‌شود. رزروهای در انتظار بررسی در اولویت هستند.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
            <ClipboardList className="size-4" />
            وضعیت فعال: {statusFilter === "all" ? "همه" : BOOKING_STATUS_LABELS[statusFilter] ?? statusFilter}
          </span>
        </CardHeader>
      </Card>
    </div>
  );
};

export default AdminBookingsContent;

