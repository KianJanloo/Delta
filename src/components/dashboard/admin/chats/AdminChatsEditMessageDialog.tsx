"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AdminChatsEditMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editDraft: string;
  setEditDraft: (value: string) => void;
  isActionLoading: boolean;
  onUpdate: () => void;
}

export default function AdminChatsEditMessageDialog({
  open,
  onOpenChange,
  editDraft,
  setEditDraft,
  isActionLoading,
  onUpdate,
}: AdminChatsEditMessageDialogProps) {
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
          <DialogTitle>ویرایش پیام</DialogTitle>
          <DialogDescription>
            متن پیام را اصلاح کرده و سپس ذخیره نمایید. این تغییر برای تمام اعضای اتاق نمایش داده خواهد شد.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={editDraft}
          onChange={(event) => setEditDraft(event.target.value)}
          rows={5}
          placeholder="متن جدید پیام..."
        />
        <DialogFooter className="gap-2 sm:flex-row-reverse sm:space-x-reverse sm:space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isActionLoading}
          >
            انصراف
          </Button>
          <Button onClick={onUpdate} disabled={isActionLoading}>
            {isActionLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

