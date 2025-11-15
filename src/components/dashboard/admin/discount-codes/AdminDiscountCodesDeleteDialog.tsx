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
import type { IDiscountCode } from "@/utils/service/api/discount-codes/createDiscountCode";

interface AdminDiscountCodesDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCode: IDiscountCode | null;
  isActionLoading: boolean;
  onDelete: () => void;
}

export default function AdminDiscountCodesDeleteDialog({
  open,
  onOpenChange,
  selectedCode,
  isActionLoading,
  onDelete,
}: AdminDiscountCodesDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => (!open ? onOpenChange(false) : null)}>
      <DialogContent className="max-w-md text-right" dir="rtl">
        <DialogHeader>
          <DialogTitle>حذف کد تخفیف</DialogTitle>
          <DialogDescription>
            {selectedCode
              ? `آیا از حذف کد تخفیف «${selectedCode.code}» مطمئن هستید؟`
              : "آیا از حذف این کد تخفیف مطمئن هستید؟"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:flex-row-reverse">
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isActionLoading}
          >
            {isActionLoading ? "در حال حذف..." : "حذف کد"}
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isActionLoading}>
            انصراف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

