/* eslint-disable */

"use client"; 

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import { IChatMessage, getRecentChats } from "@/utils/service/api/chats";
import { showToast } from "@/core/toast/toast";

interface ChatRoom {
  room: string;
  lastMessage?: IChatMessage;
  unreadCount?: number;
}

export default function ChatComponent() {
  const { data: session } = useSession() as any;
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [showNewRoomInput, setShowNewRoomInput] = useState(false);

  const fetchChats = useCallback(async () => {
    setIsLoadingChats(true);
    try {
      const recentMessages = await getRecentChats();
      const roomsMap = new Map<string, ChatRoom>();

      if (Array.isArray(recentMessages)) {
        recentMessages.forEach((message) => {
          if (!roomsMap.has(message.room)) {
            roomsMap.set(message.room, {
              room: message.room,
              lastMessage: message,
              unreadCount: 0,
            });
          } else {
            const existing = roomsMap.get(message.room)!;
            const messageDate = new Date(message.createdAt).getTime();
            const existingDate = existing.lastMessage
              ? new Date(existing.lastMessage.createdAt).getTime()
              : 0;

            if (messageDate > existingDate) {
              existing.lastMessage = message;
            }
          }
        });
      }

      setChats(Array.from(roomsMap.values()));
    } catch (error) {
      console.error("Error fetching chats:", error);
      showToast("error", "خطا در دریافت لیست چت‌ها");
    } finally {
      setIsLoadingChats(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();

    const interval = setInterval(() => {
      fetchChats();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchChats]);

  const handleSelectRoom = useCallback((room: string) => {
    setSelectedRoom(room);
  }, []);

  const handleNewChat = useCallback(() => {
    setShowNewRoomInput(true);
  }, []);

  const handleCreateRoom = useCallback(() => {
    if (!newRoomName.trim()) {
      showToast("error", "نام چت نمی‌تواند خالی باشد");
      return;
    }

    const roomExists = chats.some((chat) => chat.room === newRoomName.trim());
    if (roomExists) {
      showToast("error", "چتی با این نام از قبل وجود دارد");
      return;
    }

    setSelectedRoom(newRoomName.trim());
    setNewRoomName("");
    setShowNewRoomInput(false);
  }, [newRoomName, chats]);

  return (
    <div className="flex h-[calc(100vh-200px)] md:h-[calc(100vh-200px)] rounded-lg border bg-background overflow-hidden" dir="rtl">
      <div className={cn("w-full md:w-80 border-l md:border-l flex flex-col", selectedRoom && "hidden md:flex")}>
        <div className="border-b p-4 bg-muted/50 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">چت‌ها</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNewChat}
              className="shrink-0"
            >
              <MessageSquarePlus className="size-4" />
            </Button>
          </div>
          {showNewRoomInput && (
            <div className="flex gap-2">
              <Input
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="نام چت..."
                className="flex-1 bg-subBg rounded-full border border-border pr-4"
                dir="rtl"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleCreateRoom();
                  }
                }}
                autoFocus
              />
              <Button size="sm" onClick={handleCreateRoom}>
                ایجاد
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowNewRoomInput(false);
                  setNewRoomName("");
                }}
              >
                لغو
              </Button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatList
            chats={chats}
            selectedRoom={selectedRoom || undefined}
            onSelectRoom={handleSelectRoom}
            isLoading={isLoadingChats}
          />
        </div>
      </div>

      <div className={cn("flex-1 flex flex-col", !selectedRoom && "hidden md:flex")}>
        {selectedRoom ? (
          <ChatWindow room={selectedRoom} currentUserId={session?.userInfo?.id} />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <p className="text-sm">یک چت را انتخاب کنید</p>
              <p className="text-xs mt-1">یا یک چت جدید شروع کنید</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

