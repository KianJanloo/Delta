"use client";

import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type AdminTableColumn,
} from "@/components/dashboard/admin/shared/AdminResourceTable";
import type { IDocument } from "@/utils/service/api/documents";

interface AdminDocumentsTableColumnsProps {
  formatDateTime: (value: string) => string;
  formatNumber: (value: number) => string;
  onDelete: (item: IDocument) => void;
}

export function useDocumentsTableColumns({
  formatDateTime,
  formatNumber,
  onDelete,
}: AdminDocumentsTableColumnsProps) {
  return useMemo<AdminTableColumn<IDocument>[]>(
    () => [
      {
        key: "id",
        header: "شناسه",
        className: "whitespace-nowrap",
        cell: (item) => `#${formatNumber(item.id)}`,
      },
      {
        key: "documentType",
        header: "نوع سند",
        className: "whitespace-nowrap",
        cell: (item) => item.documentType ?? "—",
      },
      {
        key: "houseId",
        header: "شناسه ملک",
        className: "whitespace-nowrap",
        cell: (item) => (item.houseId ? formatNumber(item.houseId) : "—"),
      },
      {
        key: "createdAt",
        header: "تاریخ ثبت",
        className: "whitespace-nowrap",
        cell: (item) => formatDateTime(item.createdAt),
      },
      {
        key: "actions",
        header: "عملیات",
        className: "w-[240px]",
        cell: (item) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              asChild
            >
              <a href={item.filePath} target="_blank" rel="noopener noreferrer">
                مشاهده فایل
              </a>
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
              className="w-full justify-center"
              asChild
            >
              <a href={item.filePath} target="_blank" rel="noopener noreferrer">
                مشاهده فایل
              </a>
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
    [formatDateTime, formatNumber, onDelete]
  );
}

