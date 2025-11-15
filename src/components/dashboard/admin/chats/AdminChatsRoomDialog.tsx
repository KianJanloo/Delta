"use client";

import Link from "next/link";
import { RefreshCw, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { AdminChatRoom } from "@/utils/service/api/admin";
import type { IChatMessage } from "@/utils/service/api/chats/getChatRoom";

interface AdminChatsRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRoom: AdminChatRoom | null;
  roomMessages: IChatMessage[];
  isMessagesLoading: boolean;
  formatDateTime: (value: string) => string;
  formatNumber: (value: number) => string;
  onRefreshMessages: () => void;
  onOpenClearDialog: () => void;
  onOpenEditMessage: (message: IChatMessage) => void;
  onOpenDeleteMessage: (message: IChatMessage) => void;
}

export default function AdminChatsRoomDialog({
  open,
  onOpenChange,
  selectedRoom,
  roomMessages,
  isMessagesLoading,
  formatDateTime,
  formatNumber,
  onRefreshMessages,
  onOpenClearDialog,
  onOpenEditMessage,
  onOpenDeleteMessage,
}: AdminChatsRoomDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          onOpenChange(false);
        }
      }}
    >
      <DialogContent className="max-w-3xl text-right" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            تاریخچه گفتگو {selectedRoom ? `(${selectedRoom.room})` : ""}
          </DialogTitle>
          <DialogDescription>
            پیام‌ها به ترتیب زمان نمایش داده می‌شوند. برای بروزرسانی فهرست پیام‌ها از دکمه بروزرسانی استفاده کنید.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>
                کاربران فعال:{" "}
                <strong className="font-semibold text-foreground">
                  {selectedRoom ? formatNumber(selectedRoom.participants) : "—"}
                </strong>
              </span>
              <Separator orientation="vertical" className="hidden h-4 sm:block" />
              <span>
                آخرین فعالیت:{" "}
                <strong className="font-semibold text-foreground">
                  {selectedRoom?.lastMessageAt
                    ? formatDateTime(selectedRoom.lastMessageAt)
                    : "نامشخص"}
                </strong>
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                className="gap-2"
                onClick={onRefreshMessages}
                disabled={isMessagesLoading}
              >
                <RefreshCw className={cn("size-4", isMessagesLoading && "animate-spin")} />
                بروزرسانی پیام‌ها
              </Button>
              <Button
                variant="destructive"
                className="gap-2"
                onClick={onOpenClearDialog}
                disabled={isMessagesLoading || !roomMessages.length}
              >
                <Trash2 className="size-4" />
                پاکسازی اتاق
              </Button>
            </div>
          </div>

          <ScrollArea className="max-h-[420px] rounded-2xl border border-border/60 p-4">
            {isMessagesLoading ? (
              <div className="py-16 text-center text-sm text-muted-foreground">
                در حال بارگذاری پیام‌ها...
              </div>
            ) : roomMessages.length ? (
              <div className="flex flex-col gap-4">
                {roomMessages.map((message) => (
                  <div
                    key={`message-${message.id}`}
                    className={cn(
                      "rounded-2xl border border-border/50 bg-background/60 p-4 shadow-sm transition",
                      "hover:border-primary/40 hover:shadow-md",
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>پیام #{formatNumber(message.id)}</span>
                        <Separator orientation="vertical" className="hidden h-4 sm:block" />
                        <span>کاربر: {formatNumber(message.userId)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(message.createdAt)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-foreground">
                      {message.message || "—"}
                    </p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {message.attachments.map((file, index) => (
                          <Link
                            key={`${message.id}-file-${index}`}
                            href={file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground transition hover:bg-muted/80"
                          >
                            فایل #{index + 1}
                          </Link>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 flex flex-wrap justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenEditMessage(message)}
                      >
                        ویرایش
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onOpenDeleteMessage(message)}
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-sm text-muted-foreground">
                پیامی در این اتاق ثبت نشده است.
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

