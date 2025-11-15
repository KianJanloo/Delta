"use client";

import { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { IChatMessage } from "@/utils/service/api/chats/getChatRoom";
import { getRelativeTimeString } from "@/utils/helper/date";
import { Loader } from "@/components/common/Loader";

interface ChatRoom {
  room: string;
  lastMessage?: IChatMessage;
  unreadCount?: number;
}

interface ChatListProps {
  chats: ChatRoom[];
  selectedRoom?: string;
  onSelectRoom: (room: string) => void;
  isLoading?: boolean;
}

export default function ChatList({
  chats,
  selectedRoom,
  onSelectRoom,
  isLoading,
}: ChatListProps) {
  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
      const dateA = a.lastMessage?.createdAt
        ? new Date(a.lastMessage.createdAt).getTime()
        : 0;
      const dateB = b.lastMessage?.createdAt
        ? new Date(b.lastMessage.createdAt).getTime()
        : 0;
      return dateB - dateA;
    });
  }, [chats]);

  if (isLoading && sortedChats.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (!isLoading && sortedChats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground">
        <p className="text-sm">چت فعالی وجود ندارد</p>
        <p className="text-xs mt-1">با ارسال پیام، چت جدیدی شروع می‌شود</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full p-2 md:p-4">
      <div className="flex flex-col gap-2 md:gap-4" dir="rtl">
        {sortedChats.map((chat) => (
          <button
            key={chat.room}
            onClick={() => onSelectRoom(chat.room)}
            className={cn(
              "flex flex-col gap-2 p-3 md:p-4 text-right transition-colors hover:bg-subBg rounded-lg",
              selectedRoom === chat.room && "bg-secondary-light"
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-sm truncate">{chat.room}</span>
              {chat.lastMessage && (
                <span className="text-xs text-muted-foreground shrink-0">
                  {getRelativeTimeString(chat.lastMessage.createdAt)}
                </span>
              )}
            </div>
            {chat.lastMessage && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {chat.lastMessage.message || "فایل ارسال شده"}
              </p>
            )}
            {chat.unreadCount && chat.unreadCount > 0 && (
              <div className="flex justify-end">
                <span className="flex items-center justify-center min-w-[20px] h-5 px-2 rounded-full bg-primary text-primary-foreground text-xs">
                  {chat.unreadCount}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
