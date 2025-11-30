"use client";

import { useMemo } from "react";
import { Pencil, Image as ImageIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type AdminTableColumn,
} from "@/components/dashboard/admin/shared/AdminResourceTable";
import type { AdminHouse } from "@/utils/service/api/admin";

interface AdminPropertiesTableColumnsProps {
  formatCurrency: (value: number) => string;
  formatNumber: (value: number) => string;
  onEdit: (item: AdminHouse) => void;
  onPhotos: (item: AdminHouse) => void;
  onDelete: (item: AdminHouse) => void;
}

export function usePropertiesTableColumns({
  formatCurrency,
  formatNumber,
  onEdit,
  onPhotos,
  onDelete,
}: AdminPropertiesTableColumnsProps) {
  return useMemo<AdminTableColumn<AdminHouse>[]>(
    () => [
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
        mobileClassName: "text-sm font-medium text-foreground",
        cell: (item) => formatNumber(item.sellerId),
      },
      {
        key: "price",
        header: "قیمت",
        className: "whitespace-nowrap",
        mobileClassName: "text-sm font-semibold text-primary",
        cell: (item) => formatCurrency(item.price),
      },
      {
        key: "actions",
        header: "عملیات",
        className: "w-[320px]",
        cell: (item) => (
          <div className="flex items-center justify-end gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => onEdit(item)}
            >
              <Pencil className="size-4" />
              ویرایش
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => onPhotos(item)}
            >
              <ImageIcon className="size-4" />
              عکس‌ها
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="gap-2"
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
              size="sm"
              variant="outline"
              className="gap-2 w-full justify-center"
              onClick={() => onEdit(item)}
            >
              <Pencil className="size-4" />
              ویرایش
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 w-full justify-center"
              onClick={() => onPhotos(item)}
            >
              <ImageIcon className="size-4" />
              عکس‌ها
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="gap-2 w-full justify-center"
              onClick={() => onDelete(item)}
            >
              <Trash2 className="size-4" />
              حذف
            </Button>
          </div>
        ),
      },
    ],
    [formatCurrency, formatNumber, onEdit, onPhotos, onDelete]
  );
}

