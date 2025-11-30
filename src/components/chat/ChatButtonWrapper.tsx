"use client";

import ChatButton from "./ChatButton";
import useClearPathname from "@/utils/helper/clearPathname/clearPathname";

export default function ChatButtonWrapper() {
  const pathname = useClearPathname();
  
  if (pathname.includes("/dashboard")) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500 max-md:bottom-20">
      <ChatButton />
    </div>
  );
}

