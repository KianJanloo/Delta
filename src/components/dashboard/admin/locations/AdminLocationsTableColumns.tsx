"use client";

import { useMemo } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type AdminTableColumn,
} from "@/components/dashboard/admin/shared/AdminResourceTable";
import type { LocationItem } from "./AdminLocationsContent";

interface AdminLocationsTableColumnsProps {
  onEdit: (item: LocationItem) => void;
  onDelete: (item: LocationItem) => void;
}

export function useLocationsTableColumns({
  onEdit,
  onDelete,
}: AdminLocationsTableColumnsProps) {
  return useMemo<AdminTableColumn<LocationItem>[]>(
    () => [
      {
        key: "id",
        header: "شناسه",
        className: "w-24 whitespace-nowrap",
        cell: (item) => `#${item.id}`,
      },
      {
        key: "area_name",
        header: "نام منطقه",
        className: "w-64 whitespace-nowrap font-medium text-foreground",
        cell: (item) => item.area_name ?? "—",
      },
      {
        key: "lat",
        header: "عرض جغرافیایی",
        className: "w-40 whitespace-nowrap text-muted-foreground",
        cell: (item) => item.lat ?? "—",
      },
      {
        key: "lng",
        header: "طول جغرافیایی",
        className: "w-40 whitespace-nowrap text-muted-foreground",
        cell: (item) => item.lng ?? "—",
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
    [onEdit, onDelete]
  );
}

