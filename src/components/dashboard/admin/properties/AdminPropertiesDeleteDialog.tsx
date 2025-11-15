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
import type { AdminHouse } from "@/utils/service/api/admin";

interface AdminPropertiesDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedHouse: AdminHouse | null;
  isActionLoading: boolean;
  onDelete: () => void;
  formatNumber: (value: number) => string;
}

export default function AdminPropertiesDeleteDialog({
  open,
  onOpenChange,
  selectedHouse,
  isActionLoading,
  onDelete,
  formatNumber,
}: AdminPropertiesDeleteDialogProps) {
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
          <DialogTitle>حذف ملک</DialogTitle>
          <DialogDescription>
            {selectedHouse
              ? `آیا از حذف ملک ${
                  selectedHouse.title ?? `#${formatNumber(selectedHouse.id)}`
                } اطمینان دارید؟`
              : "این عملیات بازگشت‌پذیر نیست."}
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
          <Button variant="destructive" onClick={onDelete} disabled={isActionLoading}>
            {isActionLoading ? "در حال حذف..." : "حذف ملک"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

