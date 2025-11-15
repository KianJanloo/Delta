"use client";

import { CheckCircle2, ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { IDocument } from "@/utils/service/api/documents";

interface AdminDocumentsActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionMode: "sign" | "delete" | null;
  selectedDocument: IDocument | null;
  isActionLoading: boolean;
  formatNumber: (value: number) => string;
  onSign: () => void;
  onDelete: () => void;
}

export default function AdminDocumentsActionDialog({
  open,
  onOpenChange,
  actionMode,
  selectedDocument,
  isActionLoading,
  formatNumber,
  onSign,
  onDelete,
}: AdminDocumentsActionDialogProps) {
  const dialogTitle = actionMode === "sign" ? "تایید مدرک" : "حذف مدرک";
  const dialogDescription =
    actionMode === "sign"
      ? selectedDocument
        ? `آیا از تایید مدرک شماره ${formatNumber(selectedDocument.id)} مطمئن هستید؟`
        : "این عملیات قابل بازگشت نیست."
      : selectedDocument
        ? `آیا از حذف مدرک شماره ${formatNumber(selectedDocument.id)} مطمئن هستید؟`
        : "این عملیات قابل بازگشت نیست.";

  return (
    <Dialog open={open} onOpenChange={(open) => (!open ? onOpenChange(false) : null)}>
      <DialogContent className="text-right" dir="rtl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        {actionMode === "sign" ? (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="size-4" />
            تایید مدرک باعث دسترسی کامل کاربر به امکانات مربوطه خواهد شد.
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-300">
            <ShieldAlert className="size-4" />
            حذف مدرک غیرقابل بازگشت است. در صورت نیاز کاربر باید دوباره مدرک را بارگذاری کند.
          </div>
        )}
        <DialogFooter className="gap-2 sm:flex-row-reverse sm:space-x-reverse sm:space-x-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isActionLoading}>
            انصراف
          </Button>
          {actionMode === "sign" ? (
            <Button onClick={onSign} disabled={isActionLoading}>
              {isActionLoading ? "در حال تایید..." : "تایید مدرک"}
            </Button>
          ) : (
            <Button variant="destructive" onClick={onDelete} disabled={isActionLoading}>
              {isActionLoading ? "در حال حذف..." : "حذف مدرک"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

