"use client";

import { useMemo } from "react";
import { CalendarClock, Home, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type AdminTableColumn,
} from "@/components/dashboard/admin/shared/AdminResourceTable";
import type { IDiscountCode } from "@/utils/service/api/discount-codes/createDiscountCode";

interface AdminDiscountCodesTableColumnsProps {
  formatDateTime: (value: string) => string;
  formatDecimal: (value: number) => string;
  houseLookup: Record<number, string>;
  onEdit: (item: IDiscountCode) => void;
  onDelete: (item: IDiscountCode) => void;
}

export function useDiscountCodesTableColumns({
  formatDateTime,
  formatDecimal,
  houseLookup,
  onEdit,
  onDelete,
}: AdminDiscountCodesTableColumnsProps) {
  return useMemo<AdminTableColumn<IDiscountCode>[]>(
    () => [
      {
        key: "code",
        header: "کد",
        className: "w-36 whitespace-nowrap font-semibold text-foreground",
        cell: (item) => item.code,
      },
      {
        key: "house",
        header: "اقامتگاه",
        className: "w-60 whitespace-nowrap text-muted-foreground",
        cell: (item) => {
          const houseId = item.house_id ?? null;
          const houseTitle = houseId ? houseLookup[houseId] : undefined;
          if (!houseId) {
            return "ثبت نشده";
          }
          return (
            <span className="inline-flex items-center gap-2">
              <Home className="size-4 text-muted-foreground" />
              <span className="flex flex-col leading-tight">
                <span className="font-medium text-foreground">{houseTitle ?? `شناسه ${houseId}`}</span>
                <span className="text-xs text-muted-foreground">ID: {houseId}</span>
              </span>
            </span>
          );
        },
      },
      {
        key: "discount_percentage",
        header: "درصد تخفیف",
        className: "w-32 whitespace-nowrap text-muted-foreground",
        cell: (item) => `${formatDecimal(item.discount_percentage)}٪`,
      },
      {
        key: "valid_until",
        header: "انقضا",
        className: "w-48 whitespace-nowrap text-muted-foreground",
        cell: (item) => {
          const validUntil = item.valid_until ?? item.expiresAt ?? null;
          if (!validUntil) {
            return "بدون محدودیت";
          }
          const isExpired = new Date(validUntil) < new Date();
          return (
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${
                isExpired
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-300"
                  : "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
              }`}
            >
              <CalendarClock className="size-3.5" />
              {formatDateTime(validUntil)}
            </span>
          );
        },
      },
      {
        key: "actions",
        header: "عملیات",
        className: "w-48 whitespace-nowrap",
        cell: (item) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => onEdit(item)}
            >
              <Pencil className="size-4" />
              ویرایش
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(item)}
            >
              <Trash2 className="size-4" />
              حذف
            </Button>
          </div>
        ),
        renderMobile: (item) => (
          <div className="flex flex-col gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 w-full justify-center"
              onClick={() => onEdit(item)}
            >
              <Pencil className="size-4" />
              ویرایش
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 w-full justify-center text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(item)}
            >
              <Trash2 className="size-4" />
              حذف
            </Button>
          </div>
        ),
      },
    ],
    [formatDateTime, formatDecimal, houseLookup, onEdit, onDelete]
  );
}

