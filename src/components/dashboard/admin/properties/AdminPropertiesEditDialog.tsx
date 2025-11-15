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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AdminHouse, UpdateAdminHousePayload } from "@/utils/service/api/admin";

interface AdminPropertiesEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedHouse: AdminHouse | null;
  editDraft: Partial<UpdateAdminHousePayload>;
  setEditDraft: (draft: Partial<UpdateAdminHousePayload> | ((prev: Partial<UpdateAdminHousePayload>) => Partial<UpdateAdminHousePayload>)) => void;
  isActionLoading: boolean;
  onUpdate: () => void;
  formatNumber: (value: number) => string;
}

export default function AdminPropertiesEditDialog({
  open,
  onOpenChange,
  selectedHouse,
  editDraft,
  setEditDraft,
  isActionLoading,
  onUpdate,
  formatNumber,
}: AdminPropertiesEditDialogProps) {
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
        className="max-w-2xl max-h-[90vh] overflow-y-auto text-right"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle>ویرایش ملک</DialogTitle>
          <DialogDescription>
            {selectedHouse
              ? `ویرایش اطلاعات ملک ${
                  selectedHouse.title ?? `#${formatNumber(selectedHouse.id)}`
                }`
              : "ویرایش اطلاعات ملک"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">عنوان</Label>
            <Input
              className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl"
              id="edit-title"
              value={editDraft.title || ""}
              onChange={(e) =>
                setEditDraft((prev: Partial<UpdateAdminHousePayload>) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="عنوان ملک"
              disabled={isActionLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-address">آدرس</Label>
            <Input
              className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl"
              id="edit-address"
              value={editDraft.address || ""}
              onChange={(e) =>
                setEditDraft((prev: Partial<UpdateAdminHousePayload>) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
              placeholder="آدرس ملک"
              disabled={isActionLoading}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-price">قیمت</Label>
              <Input
                className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl"
                id="edit-price"
                type="number"
                value={editDraft.price || ""}
                onChange={(e) =>
                  setEditDraft((prev: Partial<UpdateAdminHousePayload>) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                placeholder="قیمت"
                disabled={isActionLoading}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-capacity">ظرفیت</Label>
              <Input
                className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl"
                id="edit-capacity"
                type="number"
                value={editDraft.capacity || ""}
                onChange={(e) =>
                  setEditDraft((prev: Partial<UpdateAdminHousePayload>) => ({
                    ...prev,
                    capacity: Number(e.target.value),
                  }))
                }
                placeholder="ظرفیت"
                disabled={isActionLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-rooms">تعداد اتاق</Label>
              <Input
                className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl"
                id="edit-rooms"
                type="number"
                value={editDraft.rooms || ""}
                onChange={(e) =>
                  setEditDraft((prev: Partial<UpdateAdminHousePayload>) => ({
                    ...prev,
                    rooms: Number(e.target.value),
                  }))
                }
                placeholder="تعداد اتاق"
                disabled={isActionLoading}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-bathrooms">تعداد حمام</Label>
              <Input
                className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl"
                id="edit-bathrooms"
                type="number"
                value={editDraft.bathrooms || ""}
                onChange={(e) =>
                  setEditDraft((prev: Partial<UpdateAdminHousePayload>) => ({
                    ...prev,
                    bathrooms: Number(e.target.value),
                  }))
                }
                placeholder="تعداد حمام"
                disabled={isActionLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-parking">پارکینگ</Label>
              <Input
                className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl"
                id="edit-parking"
                type="number"
                value={editDraft.parking || ""}
                onChange={(e) =>
                  setEditDraft((prev: Partial<UpdateAdminHousePayload>) => ({
                    ...prev,
                    parking: Number(e.target.value),
                  }))
                }
                placeholder="تعداد پارکینگ"
                disabled={isActionLoading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">توضیحات</Label>
            <Textarea
              className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl"
              id="edit-description"
              value={editDraft.description || ""}
              onChange={(e) =>
                setEditDraft((prev: Partial<UpdateAdminHousePayload>) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="توضیحات ملک"
              rows={4}
              disabled={isActionLoading}
            />
          </div>
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

