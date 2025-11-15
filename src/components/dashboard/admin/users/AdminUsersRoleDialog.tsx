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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminUser } from "@/utils/service/api/admin";

const ROLE_LABELS: Record<string, string> = {
  admin: "مدیر سیستم",
  seller: "فروشنده",
  buyer: "خریدار",
  guest: "کاربر مهمان",
};

interface AdminUsersRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: AdminUser | null;
  roleDraft: string;
  setRoleDraft: (value: string) => void;
  isActionLoading: boolean;
  formatNumber: (value: number) => string;
  onUpdate: () => void;
}

export default function AdminUsersRoleDialog({
  open,
  onOpenChange,
  selectedUser,
  roleDraft,
  setRoleDraft,
  isActionLoading,
  formatNumber,
  onUpdate,
}: AdminUsersRoleDialogProps) {
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
          <DialogTitle>تغییر نقش کاربر</DialogTitle>
          <DialogDescription>
            {selectedUser
              ? `نقش کاربر ${selectedUser.email ?? `#${formatNumber(selectedUser.id)}`} را انتخاب کنید.`
              : "نقش جدید کاربر را انتخاب کنید."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={roleDraft} onValueChange={setRoleDraft}>
            <SelectTrigger className="justify-between">
              <SelectValue placeholder="انتخاب نقش" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
            {isActionLoading ? "در حال ذخیره..." : "ثبت تغییرات"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

