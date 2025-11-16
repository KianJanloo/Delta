/* eslint-disable */

"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { IChatMessage } from "@/utils/service/api/chats/getChatRoom";
import {
  getChatRoom,
  sendChatMessage,
  editChatMessage,
  deleteChatMessage,
  uploadChatFile,
  getUsersInRoom,
  type IChatUser,
} from "@/utils/service/api/chats";
import { showToast } from "@/core/toast/toast";
import { useSession } from "next-auth/react";
import { getProfileById } from "@/utils/service/api/profile/getProfileById";

interface ChatWindowProps {
  room: string;
  currentUserId?: number;
  pollingInterval?: number;
}

export default function ChatWindow({
  room,
  currentUserId,
  pollingInterval = 3000,
}: ChatWindowProps) {
  const { data: session } = useSession() as any;
  const userId: number | undefined = currentUserId 
    ? Number(currentUserId) 
    : session?.userInfo?.id 
      ? Number(session.userInfo.id) 
      : undefined;

  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [editingMessage, setEditingMessage] = useState<IChatMessage | null>(null);
  const [editText, setEditText] = useState("");
  const [getterId, setGetterId] = useState<number | null>(null);
  const [users, setUsers] = useState<Map<number, IChatUser>>(new Map());

  const fetchMessages = useCallback(async () => {
    if (!room) return;

    try {
      const data = await getChatRoom(room);
      const messagesArray = Array.isArray(data) ? data : [];
      setMessages(messagesArray);

      if (!getterId && messagesArray.length > 0 && userId) {
        for (const msg of messagesArray) {
          if (msg.senderId === userId && msg.getterId && msg.getterId !== userId) {
            setGetterId(msg.getterId);
            break;
          } else if (msg.senderId !== userId) {
            setGetterId(msg.senderId);
            break;
          }
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [room, getterId, userId]);

  const fetchGetterId = useCallback(async () => {
    if (!room || !userId) return;

    const roomAsNumber = parseInt(room, 10);
    if (!isNaN(roomAsNumber) && roomAsNumber !== userId) {
      setGetterId(roomAsNumber);
      return;
    }

    try {
      const roomUsers = await getUsersInRoom(room);
      if (Array.isArray(roomUsers) && roomUsers.length > 0) {
        const usersMap = new Map<number, IChatUser>();
        roomUsers.forEach((user) => {
          usersMap.set(user.id, user);
        });
        setUsers(usersMap);

        const otherUser = roomUsers.find((user) => user.id !== userId);
        if (otherUser) {
          setGetterId(otherUser.id);
        } else if (roomUsers.length === 1 && roomUsers[0].id !== userId) {
          setGetterId(roomUsers[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching getterId:", error);
      if (!isNaN(roomAsNumber) && roomAsNumber !== userId) {
        setGetterId(roomAsNumber);
      }
    }
  }, [room, userId]);

  const fetchUserProfiles = useCallback(async () => {
    if (!messages.length || !userId) return;

    try {
      const usersMap = new Map<number, IChatUser>();
      
      for (const msg of messages) {
        const msgSenderId = msg.senderId || Number(msg.sender?.id);
        if (msgSenderId && msgSenderId !== userId) {
          if (msg.sender && !users.has(msgSenderId)) {
            usersMap.set(msgSenderId, {
              id: msgSenderId,
              fullName: msg.sender.fullName,
              avatar: msg.sender.avatar,
            });
          } else if (!msg.sender && !users.has(msgSenderId)) {
            try {
              const roomUsers = await getUsersInRoom(room);
              if (Array.isArray(roomUsers)) {
                roomUsers.forEach((user) => {
                  usersMap.set(user.id, user);
                });
              }
            } catch {
              usersMap.set(msgSenderId, {
                id: msgSenderId,
                fullName: `کاربر ${msgSenderId}`,
              });
            }
          }
        }
      }

      if (usersMap.size > 0) {
        setUsers((prev) => new Map([...prev, ...usersMap]));
      }
    } catch (error) {
      console.error("Error fetching user profiles:", error);
    }
  }, [messages, room, userId, users]);

  useEffect(() => {
    if (!room) return;

    setIsLoading(true);
    fetchMessages().finally(() => setIsLoading(false));
    fetchGetterId();

    const interval = setInterval(() => {
      fetchMessages();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [room, fetchMessages, fetchGetterId, pollingInterval]);

  useEffect(() => {
    if (messages.length > 0) {
      fetchUserProfiles();
    }
  }, [messages, fetchUserProfiles]);

  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      if (!userId) return;
      
      try {
        const profile = await getProfileById(String(userId));
        if (profile?.user) {
          setUsers((prev) => {
            const newMap = new Map(prev);
            newMap.set(userId, {
              id: userId,
              fullName: profile.user.fullName,
              avatar: profile.user.profilePicture || undefined,
            });
            return newMap;
          });
        }
      } catch (error) {
        console.error("Error fetching current user profile:", error);
      }
    };

    fetchCurrentUserProfile();
  }, [userId]);

  const handleSend = useCallback(
    async (message: string, files?: File[]) => {
      if (!room) {
        showToast("error", "خطا: اتاق چت مشخص نشده است");
        return;
      }

      let currentGetterId = getterId;
      
      if (!currentGetterId && userId) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage) {
          if (lastMessage.senderId === userId && lastMessage.getterId) {
            currentGetterId = lastMessage.getterId;
          } else if (lastMessage.senderId !== userId) {
            currentGetterId = lastMessage.senderId;
          }
        }
        
        if (!currentGetterId) {
          await fetchGetterId();
          const roomAsNumber = parseInt(room, 10);
          if (!isNaN(roomAsNumber) && roomAsNumber !== userId) {
            currentGetterId = roomAsNumber;
          }
        }
      }

      if (!currentGetterId) {
        showToast("error", "خطا: شناسه دریافت‌کننده مشخص نشده است");
        return;
      }

      setIsSending(true);
      try {
        if (files && files.length > 0) {
          await uploadChatFile(room, files, currentGetterId);
        }

        if (message.trim()) {
          await sendChatMessage({
            room,
            message: message.trim(),
            getterId: currentGetterId,
          });
        }
        
        if (currentGetterId && currentGetterId !== getterId) {
          setGetterId(currentGetterId);
        }

        await fetchMessages();
        showToast("success", "پیام با موفقیت ارسال شد");
      } catch (error) {
        console.error("Error sending message:", error);
        showToast("error", "خطا در ارسال پیام");
      } finally {
        setIsSending(false);
      }
    },
    [room, getterId, userId, messages, fetchMessages, fetchGetterId],
  );

  const handleEdit = useCallback(
    async (message: IChatMessage) => {
      setEditingMessage(message);
      setEditText(message.message);
    },
    [],
  );

  const handleSaveEdit = useCallback(async () => {
    if (!editingMessage || !editText.trim()) return;

    try {
      await editChatMessage(Number(editingMessage.id), {
        message: editText.trim(),
      });
      await fetchMessages();
      setEditingMessage(null);
      setEditText("");
      showToast("success", "پیام با موفقیت ویرایش شد");
    } catch (error) {
      console.error("Error editing message:", error);
      showToast("error", "خطا در ویرایش پیام");
    }
  }, [editingMessage, editText, fetchMessages]);

  const handleDelete = useCallback(
    async (message: IChatMessage) => {
      if (!confirm("آیا از حذف این پیام مطمئن هستید؟")) return;

      try {
        await deleteChatMessage(Number(message.id));
        await fetchMessages();
        showToast("success", "پیام با موفقیت حذف شد");
      } catch (error) {
        console.error("Error deleting message:", error);
        showToast("error", "خطا در حذف پیام");
      }
    },
    [fetchMessages],
  );

  return (
    <div className="flex flex-col h-full" dir="rtl">
      <div className="flex items-center justify-between border-b bg-background p-3 md:p-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{room}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fetchMessages()}
            disabled={isLoading}
          >
            <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {editingMessage && (
        <div className="border-b bg-muted/50 p-3 flex items-center gap-2" dir="rtl">
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="ویرایش پیام..."
            className="flex-1 min-h-[44px] pr-10 bg-subBg rounded-full border border-border"
            dir="rtl"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSaveEdit();
              }
            }}
            autoFocus
          />
          <Button size="sm" onClick={handleSaveEdit}>
            ذخیره
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setEditingMessage(null);
              setEditText("");
            }}
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          currentUserId={userId || undefined}
          users={users}
          currentUserProfile={userId && users.has(userId) ? users.get(userId) : undefined}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <MessageInput onSend={handleSend} isSending={isSending} />
    </div>
  );
}

