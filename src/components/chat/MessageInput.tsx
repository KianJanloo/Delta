"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Send, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { showToast } from "@/core/toast/toast";

interface MessageInputProps {
  onSend: (message: string, files?: File[]) => void;
  isSending?: boolean;
  disabled?: boolean;
}

export default function MessageInput({
  onSend,
  isSending = false,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!message.trim() && selectedFiles.length === 0) return;

    const messageText = message.trim();
    const filesToSend = [...selectedFiles];

    setMessage("");
    setSelectedFiles([]);

    try {
      await onSend(messageText, filesToSend.length > 0 ? filesToSend : undefined);
    } catch {
      showToast("error", "خطا در ارسال پیام");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxFiles = 5;
    const maxSize = 10 * 1024 * 1024;

    if (files.length + selectedFiles.length > maxFiles) {
      showToast("error", `حداکثر ${maxFiles} فایل می‌توانید انتخاب کنید`);
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        showToast("error", `فایل ${file.name} بزرگتر از 10 مگابایت است`);
        return false;
      }
      return true;
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t bg-background p-3 md:p-4" dir="rtl">
      {selectedFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-sm"
            >
              <Paperclip className="size-3" />
              <span className="max-w-[150px] truncate">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={() => removeFile(index)}
              >
                <X className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Input
            value={message}
            className="min-h-[44px] pr-10 bg-subBg rounded-full border border-border"
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="پیام خود را بنویسید..."
            disabled={disabled || isSending}
            dir="rtl"
          />
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled || isSending}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isSending}
          className="shrink-0"
        >
          <Paperclip className="size-4" />
        </Button>
        <Button
          onClick={handleSend}
          disabled={disabled || isSending || (!message.trim() && selectedFiles.length === 0)}
          className="shrink-0"
        >
          <Send className={cn("size-4", isSending && "animate-pulse")} />
        </Button>
      </div>
    </div>
  );
}

