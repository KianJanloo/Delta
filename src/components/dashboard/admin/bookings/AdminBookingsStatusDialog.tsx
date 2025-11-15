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
import type { AdminBooking } from "@/utils/service/api/admin";

const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: "در انتظار بررسی",
  confirmed: "تایید شده",
  canceled: "لغو شده",
};

interface AdminBookingsStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBooking: AdminBooking | null;
  statusDraft: string;
  setStatusDraft: (value: string) => void;
  isActionLoading: boolean;
  formatNumber: (value: number) => string;
  onUpdate: () => void;
}

export default function AdminBookingsStatusDialog({
  open,
  onOpenChange,
  selectedBooking,
  statusDraft,
  setStatusDraft,
  isActionLoading,
  formatNumber,
  onUpdate,
}: AdminBookingsStatusDialogProps) {
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
          <DialogTitle>تغییر وضعیت رزرو</DialogTitle>
          <DialogDescription>
            {selectedBooking
              ? `وضعیت رزرو شماره ${formatNumber(selectedBooking.id)} را انتخاب کنید.`
              : "وضعیت جدید رزرو را انتخاب کنید."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={statusDraft} onValueChange={setStatusDraft}>
            <SelectTrigger className="justify-between">
              <SelectValue placeholder="انتخاب وضعیت" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(BOOKING_STATUS_LABELS).map(([value, label]) => (
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

