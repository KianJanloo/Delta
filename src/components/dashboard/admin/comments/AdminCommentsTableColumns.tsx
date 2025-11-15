"use client";

import { useMemo } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type AdminTableColumn,
} from "@/components/dashboard/admin/shared/AdminResourceTable";
import type { AdminComment } from "@/utils/service/api/admin";

interface AdminCommentsTableColumnsProps {
  formatDateTime: (value: string) => string;
  formatNumber: (value: number) => string;
  onEdit: (item: AdminComment) => void;
  onDelete: (item: AdminComment) => void;
}

export function useCommentsTableColumns({
  formatDateTime,
  formatNumber,
  onEdit,
  onDelete,
}: AdminCommentsTableColumnsProps) {
  return useMemo<AdminTableColumn<AdminComment>[]>(
    () => [
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
            {item.rating ? formatNumber(Number(item.rating)) : "—"}
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
              onClick={() => onEdit(item)}
            >
              جزئیات
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
      },
    ],
    [formatDateTime, formatNumber, onEdit, onDelete]
  );
}

