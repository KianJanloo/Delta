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
import type { AdminUser } from "@/utils/service/api/admin";

interface AdminUsersDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: AdminUser | null;
  isActionLoading: boolean;
  formatNumber: (value: number) => string;
  onDelete: () => void;
}

export default function AdminUsersDeleteDialog({
  open,
  onOpenChange,
  selectedUser,
  isActionLoading,
  formatNumber,
  onDelete,
}: AdminUsersDeleteDialogProps) {
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
          <DialogTitle>حذف کاربر</DialogTitle>
          <DialogDescription>
            {selectedUser
              ? `آیا از حذف کاربر ${selectedUser.email ?? `#${formatNumber(selectedUser.id)}`} مطمئن هستید؟ این عملیات بازگشت‌پذیر نیست.`
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
            {isActionLoading ? "در حال حذف..." : "حذف کاربر"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

