"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  type AdminTableColumn,
} from "@/components/dashboard/admin/shared/AdminResourceTable";
import { cn } from "@/lib/utils";
import type { AdminBooking } from "@/utils/service/api/admin";

const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: "در انتظار بررسی",
  confirmed: "تایید شده",
  canceled: "لغو شده",
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-emerald-500/10 text-emerald-600 border-transparent",
  pending: "bg-amber-500/10 text-amber-600 border-transparent",
  canceled: "bg-rose-500/10 text-rose-600 border-transparent",
};

interface AdminBookingsTableColumnsProps {
  formatDateTime: (value: string) => string;
  formatNumber: (value: number) => string;
  onStatusChange: (item: AdminBooking) => void;
  onDelete: (item: AdminBooking) => void;
}

export function useBookingsTableColumns({
  formatDateTime,
  formatNumber,
  onStatusChange,
  onDelete,
}: AdminBookingsTableColumnsProps) {
  return useMemo<AdminTableColumn<AdminBooking>[]>(
    () => [
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
      {
        key: "actions",
        header: "عملیات",
        className: "w-[210px]",
        cell: (item) => (
          <div className="flex items-center justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => onStatusChange(item)}>
              تغییر وضعیت
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(item)}
            >
              حذف
            </Button>
          </div>
        ),
        renderMobile: (item) => (
          <div className="flex flex-col gap-2 w-full">
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full justify-center"
              onClick={() => onStatusChange(item)}
            >
              تغییر وضعیت
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="w-full justify-center"
              onClick={() => onDelete(item)}
            >
              حذف
            </Button>
          </div>
        ),
      },
    ],
    [formatDateTime, formatNumber, onStatusChange, onDelete]
  );
}

