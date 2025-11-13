'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  MessageCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable, {
  type AdminTableColumn,
} from "@/components/dashboard/admin/shared/AdminResourceTable";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import { normalizeList } from "@/components/dashboard/admin/shared/normalize";
import {
  clearAdminChatRoom,
  deleteAdminChatMessage,
  getAdminChatRoomMessages,
  getAdminChatRooms,
  updateAdminChatMessage,
  type AdminChatRoom,
} from "@/utils/service/api/admin";
import { type IChatMessage } from "@/utils/service/api/chats/getChatRoom";
import { showToast } from "@/core/toast/toast";
import { cn } from "@/lib/utils";

const AdminChatsContent = () => {
  const { formatDateTime, formatNumber } = useAdminFormatters();
  const [rooms, setRooms] = useState<AdminChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<AdminChatRoom | null>(null);
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [roomMessages, setRoomMessages] = useState<IChatMessage[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<IChatMessage | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleFetchRooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await getAdminChatRooms();
      const list = normalizeList<AdminChatRoom>(payload);
      setRooms(list);
    } catch (err) {
      console.error("Failed to fetch chat rooms", err);
      setRooms([]);
      setError("بارگذاری اتاق‌های گفتگو با خطا مواجه شد.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleFetchRooms();
  }, [handleFetchRooms]);

  const handleFetchMessages = useCallback(async (roomId: string) => {
    setIsMessagesLoading(true);
    try {
      const payload = await getAdminChatRoomMessages(roomId);
      setRoomMessages(Array.isArray(payload) ? payload : normalizeList<IChatMessage>(payload));
    } catch (err) {
      console.error("Failed to fetch room messages", err);
      setRoomMessages([]);
      showToast("error", "دریافت پیام‌های اتاق با خطا مواجه شد.");
    } finally {
      setIsMessagesLoading(false);
    }
  }, []);

  const handleOpenRoom = useCallback(async (room: AdminChatRoom) => {
    setSelectedRoom(room);
    setIsRoomDialogOpen(true);
    await handleFetchMessages(room.room);
  }, [handleFetchMessages]);

  const handleRefreshMessages = async () => {
    if (!selectedRoom) return;
    await handleFetchMessages(selectedRoom.room);
  };

  const handleOpenEditMessage = (message: IChatMessage) => {
    setSelectedMessage(message);
    setEditDraft(message.message);
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteMessage = (message: IChatMessage) => {
    setSelectedMessage(message);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateMessage = async () => {
    if (!selectedMessage || !selectedRoom) return;
    if (!editDraft.trim()) {
      showToast("error", "متن پیام نمی‌تواند خالی باشد.");
      return;
    }
    setIsActionLoading(true);
    try {
      await updateAdminChatMessage(selectedMessage.id, {
        message: editDraft.trim(),
      });
      showToast("success", "پیام با موفقیت ویرایش شد.");
      setIsEditDialogOpen(false);
      setSelectedMessage(null);
      await handleFetchMessages(selectedRoom.room);
    } catch (err) {
      console.error("Failed to update message", err);
      showToast("error", "ویرایش پیام با خطا مواجه شد.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteMessage = async () => {
    if (!selectedMessage || !selectedRoom) return;
    setIsActionLoading(true);
    try {
      await deleteAdminChatMessage(selectedMessage.id);
      showToast("success", "پیام با موفقیت حذف شد.");
      setIsDeleteDialogOpen(false);
      const shouldRefetch = roomMessages.length <= 1;
      await handleFetchMessages(selectedRoom.room);
      if (shouldRefetch) {
        await handleFetchRooms();
      }
    } catch (err) {
      console.error("Failed to delete message", err);
      showToast("error", "حذف پیام با خطا مواجه شد.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleClearRoom = async () => {
    if (!selectedRoom) return;
    setIsActionLoading(true);
    try {
      await clearAdminChatRoom(selectedRoom.room);
      showToast("success", "تمام پیام‌های اتاق حذف شدند.");
      setIsClearDialogOpen(false);
      await handleFetchMessages(selectedRoom.room);
      await handleFetchRooms();
    } catch (err) {
      console.error("Failed to clear chat room", err);
      showToast("error", "پاکسازی اتاق با خطا مواجه شد.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const columns = useMemo<AdminTableColumn<AdminChatRoom>[]>(() => [
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
          <Button size="sm" variant="outline" onClick={() => handleOpenRoom(item)}>
            مشاهده گفتگو
          </Button>
        </div>
      ),
    },
  ], [formatDateTime, formatNumber, handleOpenRoom]);

  return (
    <div className="space-y-6" dir="rtl">
      <AdminPageHeader
        title="مدیریت گفتگوها"
        description="دسترسی به اتاق‌های گفتگو، حذف پیام‌های نامناسب و نظارت بر مکالمات کاربران."
        actions={(
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => handleFetchRooms()}
            disabled={isLoading}
          >
            <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
            {isLoading ? "در حال بروزرسانی..." : "بروزرسانی"}
          </Button>
        )}
        hint={`تعداد اتاق‌های فعال: ${formatNumber(rooms.length)}`}
      />

      <Card className="border-border/70">
        <CardHeader className="space-y-2 text-right">
          <CardTitle className="text-base font-semibold">
            فهرست اتاق‌های گفتگو
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            برای مشاهده جزئیات هر اتاق گزینه «مشاهده گفتگو» را انتخاب کنید.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <AdminResourceTable
            columns={columns}
            data={rooms}
            isLoading={isLoading}
            errorMessage={error}
            emptyMessage="اتاق گفتگویی برای نمایش وجود ندارد."
            getKey={(item) => `chat-room-${item.room}`}
          />
        </CardContent>
      </Card>

      <Card className="border-dashed border-border/60 bg-subBg/40 text-right dark:bg-muted/10">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="size-5 text-primary" />
            <div>
              <CardTitle className="text-base font-semibold">
                نکات نظارتی
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                اتاق‌هایی با آخرین فعالیت قدیمی یا پیام‌های متعدد گزارش شده را بررسی و در صورت نیاز پاکسازی کنید.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1 whitespace-nowrap">
            <BadgeCheck className="size-4 text-emerald-500" />
            {rooms.length ? "نظارت فعال" : "بدون اتاق فعال"}
          </Badge>
        </CardHeader>
      </Card>

      <Dialog
        open={isRoomDialogOpen}
        onOpenChange={(open) => {
          setIsRoomDialogOpen(open);
          if (!open) {
            setSelectedRoom(null);
            setRoomMessages([]);
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
                  onClick={handleRefreshMessages}
                  disabled={isMessagesLoading}
                >
                  <RefreshCw className={cn("size-4", isMessagesLoading && "animate-spin")} />
                  بروزرسانی پیام‌ها
                </Button>
                <Button
                  variant="destructive"
                  className="gap-2"
                  onClick={() => setIsClearDialogOpen(true)}
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
                          onClick={() => handleOpenEditMessage(message)}
                        >
                          ویرایش
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleOpenDeleteMessage(message)}
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

      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setSelectedMessage(null);
            setEditDraft("");
            setIsActionLoading(false);
          }
        }}
      >
        <DialogContent className="text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>ویرایش پیام</DialogTitle>
            <DialogDescription>
              متن پیام را اصلاح کرده و سپس ذخیره نمایید. این تغییر برای تمام اعضای اتاق نمایش داده خواهد شد.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={editDraft}
            onChange={(event) => setEditDraft(event.target.value)}
            rows={5}
            placeholder="متن جدید پیام..."
          />
          <DialogFooter className="gap-2 sm:flex-row-reverse sm:space-x-reverse sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isActionLoading}
            >
              انصراف
            </Button>
            <Button onClick={handleUpdateMessage} disabled={isActionLoading}>
              {isActionLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) {
            setSelectedMessage(null);
            setIsActionLoading(false);
          }
        }}
      >
        <DialogContent className="text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف پیام</DialogTitle>
            <DialogDescription>
              آیا از حذف این پیام مطمئن هستید؟ این عمل غیرقابل بازگشت است.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:flex-row-reverse sm:space-x-reverse sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isActionLoading}
            >
              انصراف
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteMessage}
              disabled={isActionLoading}
            >
              <Trash2 className="size-4" />
              {isActionLoading ? "در حال حذف..." : "حذف پیام"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isClearDialogOpen}
        onOpenChange={(open) => {
          setIsClearDialogOpen(open);
          if (!open) {
            setIsActionLoading(false);
          }
        }}
      >
        <DialogContent className="text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>پاکسازی کامل اتاق</DialogTitle>
            <DialogDescription>
              با تایید این گزینه، تمام پیام‌های اتاق انتخاب شده حذف خواهند شد. این عملیات غیرقابل بازگشت است.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:flex-row-reverse sm:space-x-reverse sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsClearDialogOpen(false)}
              disabled={isActionLoading}
            >
              انصراف
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearRoom}
              disabled={isActionLoading}
            >
              <Trash2 className="size-4" />
              {isActionLoading ? "در حال پاکسازی..." : "پاکسازی"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminChatsContent;


