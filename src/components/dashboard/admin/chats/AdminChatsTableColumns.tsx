"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  type AdminTableColumn,
} from "@/components/dashboard/admin/shared/AdminResourceTable";
import type { AdminChatRoom } from "@/utils/service/api/admin";

interface AdminChatsTableColumnsProps {
  formatDateTime: (value: string) => string;
  formatNumber: (value: number) => string;
  onOpenRoom: (item: AdminChatRoom) => void;
}

export function useChatsTableColumns({
  formatDateTime,
  formatNumber,
  onOpenRoom,
}: AdminChatsTableColumnsProps) {
  return useMemo<AdminTableColumn<AdminChatRoom>[]>(
    () => [
      {
        key: "room",
        header: "شناسه اتاق",
        cell: (item) => (
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">{item.room}</span>
            {item.lastMessage && (
              <span className="text-xs text-muted-foreground line-clamp-1">
                {item.lastMessage}
              </span>
            )}
          </div>
        ),
        mobileLabel: "اتاق",
        mobileClassName: "text-right",
      },
      {
        key: "participants",
        header: "اعضا",
        className: "whitespace-nowrap text-center",
        mobileClassName: "text-sm font-medium",
        cell: (item) => formatNumber(item.participants),
      },
      {
        key: "lastMessageAt",
        header: "آخرین فعالیت",
        className: "whitespace-nowrap",
        mobileClassName: "text-xs text-muted-foreground",
        cell: (item) => item.lastMessageAt ? formatDateTime(item.lastMessageAt) : "نامشخص",
      },
      {
        key: "actions",
        header: "عملیات",
        className: "w-[160px]",
        hideOnMobile: true,
        cell: (item) => (
          <div className="flex items-center justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => onOpenRoom(item)}>
              مشاهده گفتگو
            </Button>
          </div>
        ),
      },
    ],
    [formatDateTime, formatNumber, onOpenRoom]
  );
}

