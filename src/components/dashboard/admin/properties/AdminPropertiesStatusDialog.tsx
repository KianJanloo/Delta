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
import type { AdminHouse } from "@/utils/service/api/admin";

const STATUS_LABELS: Record<string, string> = {
  published: "منتشر شده",
  pending: "در انتظار تایید",
  draft: "پیش‌نویس",
  rejected: "رد شده",
};

interface AdminPropertiesStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedHouse: AdminHouse | null;
  statusDraft: string;
  setStatusDraft: (value: string) => void;
  isActionLoading: boolean;
  onUpdate: () => void;
  formatNumber: (value: number) => string;
}

export default function AdminPropertiesStatusDialog({
  open,
  onOpenChange,
  selectedHouse,
  statusDraft,
  setStatusDraft,
  isActionLoading,
  onUpdate,
  formatNumber,
}: AdminPropertiesStatusDialogProps) {
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
          <DialogTitle>تغییر وضعیت ملک</DialogTitle>
          <DialogDescription>
            {selectedHouse
              ? `وضعیت ملک ${
                  selectedHouse.title ?? `#${formatNumber(selectedHouse.id)}`
                } را انتخاب کنید.`
              : "وضعیت جدید ملک را انتخاب کنید."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={statusDraft} onValueChange={setStatusDraft}>
            <SelectTrigger className="justify-between">
              <SelectValue placeholder="انتخاب وضعیت" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
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

