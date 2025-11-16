/* eslint-disable */

"use client";

import { useSession } from "next-auth/react";
import { Edit2, Trash2, Paperclip, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IChatMessage } from "@/utils/service/api/chats/getChatRoom";
import { getRelativeTimeString } from "@/utils/helper/date";
import Image from "next/image";
import type { IChatUser } from "@/utils/service/api/chats";
import type { IChatSender } from "@/utils/service/api/chats/getChatRoom";

interface MessageItemProps {
  message: IChatMessage;
  currentUserId?: number;
  sender?: IChatUser | IChatSender;
  isOwnMessage?: boolean;
  onEdit?: (message: IChatMessage) => void;
  onDelete?: (message: IChatMessage) => void;
}

export default function MessageItem({
  message,
  currentUserId,
  sender,
  isOwnMessage = false,
  onEdit,
  onDelete,
}: MessageItemProps) {
  const { data: session } = useSession() as any;
  const messageSenderId = message.senderId || Number(message.sender?.id);
  const computedIsOwnMessage = isOwnMessage || currentUserId === messageSenderId || session?.userInfo?.id === messageSenderId;
  
  const messageSender = message.sender || sender;
  const senderName = computedIsOwnMessage 
    ? "شما" 
    : messageSender?.fullName || `کاربر ${messageSenderId}`;
  
  const senderAvatar = messageSender?.avatar;

  return (
    <div
      className={cn(
        "flex gap-2 md:gap-3 p-2 md:p-3 rounded-lg transition-colors",
        computedIsOwnMessage ? "flex-row-reverse" : "flex-row",
      )}
    >
      {!computedIsOwnMessage && (
        <div className="shrink-0">
          {senderAvatar ? (
            <div className="size-10 rounded-full overflow-hidden border-2 border-border">
              <Image
                src={senderAvatar}
                alt={senderName}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="size-10 rounded-full bg-muted flex items-center justify-center border-2 border-border">
              <User className="size-5 text-muted-foreground" />
            </div>
          )}
        </div>
      )}
      
      <div
        className={cn(
          "flex flex-col gap-2 max-w-[70%]",
          computedIsOwnMessage ? "items-end" : "items-start",
        )}
      >
        {!computedIsOwnMessage && (
          <span className="text-xs font-medium text-foreground px-1">
            {senderName}
          </span>
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-2 shadow-sm",
            computedIsOwnMessage
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          <p className="text-sm leading-6 whitespace-pre-wrap break-words">
            {message.message || "—"}
          </p>
          {message.files && message.files.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {message.files.map((file, index) => {
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
                return (
                  <div key={index} className="relative">
                    {isImage ? (
                      <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg overflow-hidden max-w-[200px] max-h-[200px]"
                      >
                        <Image
                          src={file}
                          alt={`Attachment ${index + 1}`}
                          width={200}
                          height={200}
                          className="object-cover w-full h-full"
                        />
                      </a>
                    ) : (
                      <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-background/50 px-3 py-1.5 text-xs transition hover:bg-background/70"
                      >
                        <Paperclip className="size-3" />
                        فایل {index + 1}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {computedIsOwnMessage && (
            <span className="font-medium text-primary">شما</span>
          )}
          <span>{getRelativeTimeString(message.createdAt)}</span>
          {message.updatedAt !== message.createdAt && (
            <span className="text-xs opacity-70">(ویرایش شده)</span>
          )}
        </div>
        {computedIsOwnMessage && (onEdit || onDelete) && (
          <div className="flex gap-1">
            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2"
                onClick={() => onEdit(message)}
              >
                <Edit2 className="size-3" />
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-destructive hover:text-destructive"
                onClick={() => onDelete(message)}
              >
                <Trash2 className="size-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

