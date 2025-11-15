"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ChatModal from "./ChatModal";
import { useSession } from "next-auth/react";

interface ChatButtonProps {
  className?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "sm" | "default" | "icon";
}

export default function ChatButton({ className, variant = "ghost", size = "icon" }: ChatButtonProps) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession() as any;

  if (!session) return null;

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        className={cn("relative", className)}
        aria-label="چت"
      >
        <MessageSquare className="size-4 sm:size-5" />
      </Button>
      <ChatModal open={open} onOpenChange={setOpen} />
    </>
  );
}

