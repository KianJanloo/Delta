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
import type { AdminBooking } from "@/utils/service/api/admin";

interface AdminBookingsDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBooking: AdminBooking | null;
  isActionLoading: boolean;
  formatNumber: (value: number) => string;
  onDelete: () => void;
}

export default function AdminBookingsDeleteDialog({
  open,
  onOpenChange,
  selectedBooking,
  isActionLoading,
  formatNumber,
  onDelete,
}: AdminBookingsDeleteDialogProps) {
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
          <DialogTitle>حذف رزرو</DialogTitle>
          <DialogDescription>
            {selectedBooking
              ? `آیا از حذف رزرو شماره ${formatNumber(selectedBooking.id)} مطمئن هستید؟`
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
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isActionLoading}
          >
            {isActionLoading ? "در حال حذف..." : "حذف رزرو"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

