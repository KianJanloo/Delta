"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable from "@/components/dashboard/admin/shared/AdminResourceTable";
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
import { useChatsTableColumns } from "./AdminChatsTableColumns";
import AdminChatsRoomDialog from "./AdminChatsRoomDialog";
import AdminChatsEditMessageDialog from "./AdminChatsEditMessageDialog";
import AdminChatsDeleteMessageDialog from "./AdminChatsDeleteMessageDialog";
import AdminChatsClearRoomDialog from "./AdminChatsClearRoomDialog";

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

  const columns = useChatsTableColumns({
    formatDateTime,
    formatNumber,
    onOpenRoom: handleOpenRoom,
  });

  return (
    <div className="space-y-6" dir="rtl">
      <AdminPageHeader
        title="مدیریت گفتگوها"
        description="دسترسی به اتاق‌های گفتگو، حذف پیام‌های نامناسب و نظارت بر مکالمات کاربران."
        actions={
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => handleFetchRooms()}
            disabled={isLoading}
          >
            <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
            {isLoading ? "در حال بروزرسانی..." : "بروزرسانی"}
          </Button>
        }
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

      <AdminChatsRoomDialog
        open={isRoomDialogOpen}
        onOpenChange={(open) => {
          setIsRoomDialogOpen(open);
          if (!open) {
            setSelectedRoom(null);
            setRoomMessages([]);
          }
        }}
        selectedRoom={selectedRoom}
        roomMessages={roomMessages}
        isMessagesLoading={isMessagesLoading}
        formatDateTime={formatDateTime}
        formatNumber={formatNumber}
        onRefreshMessages={handleRefreshMessages}
        onOpenClearDialog={() => setIsClearDialogOpen(true)}
        onOpenEditMessage={handleOpenEditMessage}
        onOpenDeleteMessage={handleOpenDeleteMessage}
      />

      <AdminChatsEditMessageDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setSelectedMessage(null);
            setEditDraft("");
            setIsActionLoading(false);
          }
        }}
        editDraft={editDraft}
        setEditDraft={setEditDraft}
        isActionLoading={isActionLoading}
        onUpdate={handleUpdateMessage}
      />

      <AdminChatsDeleteMessageDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) {
            setSelectedMessage(null);
            setIsActionLoading(false);
          }
        }}
        isActionLoading={isActionLoading}
        onDelete={handleDeleteMessage}
      />

      <AdminChatsClearRoomDialog
        open={isClearDialogOpen}
        onOpenChange={(open) => {
          setIsClearDialogOpen(open);
          if (!open) {
            setIsActionLoading(false);
          }
        }}
        isActionLoading={isActionLoading}
        onClear={handleClearRoom}
      />
    </div>
  );
};

export default AdminChatsContent;
