"use client";

import Link from "next/link";
import Image from "next/image";
import { RefreshCw, Trash2, Paperclip, User, Edit2 } from "lucide-react";
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
import { getRelativeTimeString } from "@/utils/helper/date";

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
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col text-right p-0" dir="rtl">
        <DialogHeader className="flex-shrink-0 p-6 pb-4">
          <DialogTitle>
            تاریخچه گفتگو {selectedRoom ? `(${selectedRoom.room})` : ""}
          </DialogTitle>
          <DialogDescription>
            پیام‌ها به ترتیب زمان نمایش داده می‌شوند. برای بروزرسانی فهرست پیام‌ها از دکمه بروزرسانی استفاده کنید.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-hidden px-6 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
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

          <ScrollArea className="flex-1 rounded-2xl border border-border/60">
            <div className="p-3 md:p-4">
                {isMessagesLoading ? (
                  <div className="py-16 text-center text-sm text-muted-foreground">
                    در حال بارگذاری پیام‌ها...
                  </div>
                ) : roomMessages.length ? (
                  <div className="flex flex-col gap-3 md:gap-4">
                    {roomMessages.map((message) => {
                  const sender = message.sender;
                  const senderName = sender?.fullName || `کاربر ${message.senderId || 'نامشخص'}`;
                  const senderAvatar = sender?.avatar;
                  const messageFiles = message.files && Array.isArray(message.files) 
                    ? message.files.filter((f): f is string => f !== null && typeof f === 'string')
                    : [];
                  
                  return (
                    <div
                      key={`message-${message.id}`}
                      className={cn(
                        "rounded-xl md:rounded-2xl border border-border/50 bg-background/60 p-3 md:p-4 shadow-sm transition",
                        "hover:border-primary/40 hover:shadow-md",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {senderAvatar ? (
                          <div className="shrink-0 size-10 rounded-full overflow-hidden border-2 border-border">
                            <Image
                              src={senderAvatar}
                              alt={senderName}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="shrink-0 size-10 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                            <User className="size-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-semibold text-foreground">{senderName}</span>
                              {message.senderId && (
                                <>
                                  <Separator orientation="vertical" className="h-4 hidden sm:block" />
                                  <span className="text-xs text-muted-foreground">
                                    فرستنده ID: {message.senderId}
                                  </span>
                                </>
                              )}
                              {message.getterId && (
                                <>
                                  <Separator orientation="vertical" className="h-4 hidden sm:block" />
                                  <span className="text-xs text-muted-foreground">
                                    دریافت‌کننده ID: {message.getterId}
                                  </span>
                                </>
                              )}
                              {message.id && (
                                <>
                                  <Separator orientation="vertical" className="h-4 hidden sm:block" />
                                  <span className="text-xs text-muted-foreground">
                                    پیام ID: {message.id}
                                  </span>
                                </>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span className="text-xs text-muted-foreground">
                                {getRelativeTimeString(message.createdAt)}
                              </span>
                              {formatDateTime && (
                                <span className="text-[10px] text-muted-foreground/70">
                                  {formatDateTime(message.createdAt)}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {message.message && (
                            <p className="text-sm leading-6 text-foreground mb-3 whitespace-pre-wrap break-words">
                              {message.message}
                            </p>
                          )}
                          
                          {messageFiles.length > 0 && (
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              {messageFiles.map((file, index) => {
                                const fileUrl = typeof file === 'string' ? file : '';
                                const fileName = fileUrl ? fileUrl.split('/').pop() || `فایل ${index + 1}` : `فایل ${index + 1}`;
                                return (
                                  <Link
                                    key={`${message.id}-file-${index}`}
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-xs text-foreground transition hover:bg-muted/80"
                                  >
                                    <Paperclip className="size-3" />
                                    <span className="max-w-[200px] truncate">
                                      {fileName}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                          
                          {!message.message && messageFiles.length === 0 && (
                            <p className="text-xs text-muted-foreground italic">
                              پیام بدون محتوا
                            </p>
                          )}
                          
                          <div className="mt-4 flex flex-wrap justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onOpenEditMessage(message)}
                              className="gap-2"
                            >
                              <Edit2 className="size-3" />
                              ویرایش
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => onOpenDeleteMessage(message)}
                              className="gap-2"
                            >
                              <Trash2 className="size-3" />
                              حذف
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                    })}
                  </div>
                ) : (
                  <div className="py-16 text-center text-sm text-muted-foreground">
                    پیامی در این اتاق ثبت نشده است.
                  </div>
                )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

