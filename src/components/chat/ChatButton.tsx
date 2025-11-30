"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatModal from "./ChatModal";
import { useSession } from "next-auth/react";

interface ChatButtonProps {
  className?: string;
}

export default function ChatButton({ className }: ChatButtonProps) {
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: session } = useSession() as any;

  if (!session) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "group relative flex items-center justify-center",
          "w-14 h-14 rounded-full",
          "bg-primary text-primary-foreground",
          "shadow-lg shadow-primary/30",
          "hover:shadow-xl hover:shadow-primary/40",
          "hover:scale-110",
          "active:scale-95",
          "transition-all duration-300 ease-out",
          "focus:outline-none focus:ring-4 focus:ring-primary/20",
          "before:absolute before:inset-0 before:rounded-full",
          "before:bg-primary before:opacity-0",
          "before:group-hover:opacity-20",
          "before:transition-opacity before:duration-300",
          "after:absolute after:inset-0 after:rounded-full",
          "after:bg-primary after:opacity-0",
          "after:animate-ping after:group-hover:opacity-30",
          className
        )}
        aria-label="چت"
      >
        <MessageSquare className="relative z-10 size-6 transition-transform duration-300 group-hover:scale-110" />
      </button>
      <ChatModal open={open} onOpenChange={setOpen} />
    </>
  );
}

