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

interface AdminChatsDeleteMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isActionLoading: boolean;
  onDelete: () => void;
}

export default function AdminChatsDeleteMessageDialog({
  open,
  onOpenChange,
  isActionLoading,
  onDelete,
}: AdminChatsDeleteMessageDialogProps) {
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
          <DialogTitle>حذف پیام</DialogTitle>
          <DialogDescription>
            آیا از حذف این پیام مطمئن هستید؟ این عمل غیرقابل بازگشت است.
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
            onClick={onDelete}
            disabled={isActionLoading}
          >
            <Trash2 className="size-4" />
            {isActionLoading ? "در حال حذف..." : "حذف پیام"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

