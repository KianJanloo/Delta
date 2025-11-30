"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  type AdminTableColumn,
} from "@/components/dashboard/admin/shared/AdminResourceTable";
import { cn } from "@/lib/utils";
import type { AdminPayment } from "@/utils/service/api/admin";

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

interface AdminPaymentsTableColumnsProps {
  formatCurrency: (value: number) => string;
  formatDateTime: (value: string) => string;
  formatNumber: (value: number) => string;
  onStatusChange: (item: AdminPayment) => void;
  onDelete: (item: AdminPayment) => void;
}

export function usePaymentsTableColumns({
  formatCurrency,
  formatDateTime,
  formatNumber,
  onStatusChange,
  onDelete,
}: AdminPaymentsTableColumnsProps) {
  return useMemo<AdminTableColumn<AdminPayment>[]>(
    () => [
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
    [formatCurrency, formatDateTime, formatNumber, onStatusChange, onDelete]
  );
}

