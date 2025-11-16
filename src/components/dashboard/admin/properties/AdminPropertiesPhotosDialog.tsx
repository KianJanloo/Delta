"use client";

import { Upload, X, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { AdminHouse } from "@/utils/service/api/admin";
import Image from "next/image";

interface AdminPropertiesPhotosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedHouse: AdminHouse | null;
  photosDraft: string[];
  uploadedFiles: File[];
  fileInputKey: number;
  isActionLoading: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveUploadedFile: (index: number) => void;
  onRemoveExistingPhoto: (index: number) => void;
  onUpdate: () => void;
  formatNumber: (value: number) => string;
}

export default function AdminPropertiesPhotosDialog({
  open,
  onOpenChange,
  selectedHouse,
  photosDraft,
  uploadedFiles,
  fileInputKey,
  isActionLoading,
  onFileSelect,
  onRemoveUploadedFile,
  onRemoveExistingPhoto,
  onUpdate,
  formatNumber,
}: AdminPropertiesPhotosDialogProps) {
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
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto text-right"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle>مدیریت عکس‌های ملک</DialogTitle>
          <DialogDescription>
            {selectedHouse
              ? `مدیریت عکس‌های ملک ${
                  selectedHouse.title ?? `#${formatNumber(selectedHouse.id)}`
                }`
              : "مدیریت عکس‌های ملک"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>آپلود عکس‌های جدید</Label>
            <div className="flex items-center gap-2">
              <input
                key={fileInputKey}
                type="file"
                accept="image/*"
                multiple
                onChange={onFileSelect}
                disabled={isActionLoading}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg cursor-pointer hover:bg-secondary-light2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="size-4" />
                <span>انتخاب فایل</span>
              </label>
              {uploadedFiles.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {uploadedFiles.length} فایل انتخاب شده
                </span>
              )}
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>عکس‌های جدید برای آپلود</Label>
              <div className="grid grid-cols-3 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`عکس جدید ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onRemoveUploadedFile(index)}
                      disabled={isActionLoading}
                    >
                      <X className="size-4" />
                    </Button>
                    <div className="absolute bottom-2 right-2 bg-primary/80 text-white text-xs px-2 py-1 rounded">
                      جدید
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {photosDraft.length > 0 && (
            <div className="space-y-2">
              <Label>عکس‌های موجود ({photosDraft.length})</Label>
              <div className="grid grid-cols-3 gap-4">
                {photosDraft.map((photo, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={photo}
                      alt={`عکس ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onRemoveExistingPhoto(index)}
                      disabled={isActionLoading}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {photosDraft.length === 0 && uploadedFiles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              هیچ عکسی موجود نیست. لطفا عکس‌های جدید را آپلود کنید.
            </div>
          )}
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
            {isActionLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

