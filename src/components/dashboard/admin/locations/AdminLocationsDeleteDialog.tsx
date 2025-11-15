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

type LocationItem = {
  id: string;
  area_name?: string | null;
};

interface AdminLocationsDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLocation: LocationItem | null;
  isActionLoading: boolean;
  onDelete: () => void;
}

export default function AdminLocationsDeleteDialog({
  open,
  onOpenChange,
  selectedLocation,
  isActionLoading,
  onDelete,
}: AdminLocationsDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => (!open ? onOpenChange(false) : null)}>
      <DialogContent className="max-w-md text-right" dir="rtl">
        <DialogHeader>
          <DialogTitle>حذف موقعیت</DialogTitle>
          <DialogDescription>
            {selectedLocation
              ? `آیا از حذف موقعیت «${selectedLocation.area_name}» مطمئن هستید؟ این عملیات قابل بازگشت نیست.`
              : "آیا از حذف این موقعیت مطمئن هستید؟"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:flex-row-reverse">
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isActionLoading}
          >
            {isActionLoading ? "در حال حذف..." : "حذف موقعیت"}
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isActionLoading}>
            انصراف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

