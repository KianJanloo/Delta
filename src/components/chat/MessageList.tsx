/* eslint-disable */

"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader } from "@/components/common/Loader";
import MessageItem from "./MessageItem";
import { IChatMessage } from "@/utils/service/api/chats/getChatRoom";
import { useSession } from "next-auth/react";
import type { IChatUser } from "@/utils/service/api/chats";
import type { IChatSender } from "@/utils/service/api/chats/getChatRoom";

interface MessageListProps {
  messages: IChatMessage[];
  isLoading?: boolean;
  currentUserId?: number;
  users?: Map<number, IChatUser>;
  currentUserProfile?: IChatUser | IChatSender;
  onEdit?: (message: IChatMessage) => void;
  onDelete?: (message: IChatMessage) => void;
}

export default function MessageList({
  messages,
  isLoading,
  currentUserId,
  users = new Map(),
  currentUserProfile,
  onEdit,
  onDelete,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession() as any;
  const userId = currentUserId || session?.userInfo?.id;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (!isLoading && messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground">
        <p className="text-sm">هنوز پیامی ارسال نشده است.</p>
        <p className="text-xs mt-1">اولین پیام را ارسال کنید!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="flex flex-col gap-1 p-4" ref={scrollRef}>
        {messages.map((message) => {
          const messageSenderId = message.senderId || Number(message.sender?.id);
          const sender = messageSenderId === userId 
            ? currentUserProfile 
            : message.sender || users.get(messageSenderId);
          
          return (
            <MessageItem
              key={message.id}
              message={message}
              currentUserId={userId}
              sender={sender}
              isOwnMessage={messageSenderId === userId}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          );
        })}
        {isLoading && messages.length > 0 && (
          <div className="flex justify-center p-2">
            <Loader />
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

