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
import type { AdminPayment } from "@/utils/service/api/admin";

interface AdminPaymentsDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPayment: AdminPayment | null;
  isActionLoading: boolean;
  formatCurrency: (value: number) => string;
  formatNumber: (value: number) => string;
  onDelete: () => void;
}

export default function AdminPaymentsDeleteDialog({
  open,
  onOpenChange,
  selectedPayment,
  isActionLoading,
  formatCurrency,
  formatNumber,
  onDelete,
}: AdminPaymentsDeleteDialogProps) {
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
          <DialogTitle>حذف پرداخت</DialogTitle>
          <DialogDescription>
            {selectedPayment
              ? `آیا از حذف پرداخت شماره ${formatNumber(selectedPayment.id)} به مبلغ ${formatCurrency(selectedPayment.amount)} مطمئن هستید؟`
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
            {isActionLoading ? "در حال حذف..." : "حذف پرداخت"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

