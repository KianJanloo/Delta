"use client";

import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AdminChatsClearRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isActionLoading: boolean;
  onClear: () => void;
}

export default function AdminChatsClearRoomDialog({
  open,
  onOpenChange,
  isActionLoading,
  onClear,
}: AdminChatsClearRoomDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          onOpenChange(false);
        }
      }}
    >
      <DialogContent className="text-right" dir="rtl">
        <DialogHeader>
          <DialogTitle>پاکسازی کامل اتاق</DialogTitle>
          <DialogDescription>
            با تایید این گزینه، تمام پیام‌های اتاق انتخاب شده حذف خواهند شد. این عملیات غیرقابل بازگشت است.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:flex-row-reverse sm:space-x-reverse sm:space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isActionLoading}
          >
            انصراف
          </Button>
          <Button
            variant="destructive"
            onClick={onClear}
            disabled={isActionLoading}
          >
            <Trash2 className="size-4" />
            {isActionLoading ? "در حال پاکسازی..." : "پاکسازی"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

