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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IDiscountCode } from "@/utils/service/api/discount-codes/createDiscountCode";
import type { AdminHouse } from "@/utils/service/api/admin/houses";

interface AdminDiscountCodesFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  selectedCode: IDiscountCode | null;
  codeDraft: string;
  setCodeDraft: (value: string) => void;
  percentageDraft: string;
  setPercentageDraft: (value: string) => void;
  expirationDraft: string;
  setExpirationDraft: (value: string) => void;
  houseDraft: string;
  setHouseDraft: (value: string) => void;
  houses: AdminHouse[];
  isHousesLoading: boolean;
  isActionLoading: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function AdminDiscountCodesFormDialog({
  open,
  onOpenChange,
  mode,
  codeDraft,
  setCodeDraft,
  percentageDraft,
  setPercentageDraft,
  expirationDraft,
  setExpirationDraft,
  houseDraft,
  setHouseDraft,
  houses,
  isHousesLoading,
  isActionLoading,
  onSubmit,
}: AdminDiscountCodesFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => (!open ? onOpenChange(false) : null)}>
      <DialogContent className="max-w-lg text-right" dir="rtl">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "ویرایش کد تخفیف" : "کد تخفیف جدید"}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "مشخصات کد تخفیف را بروزرسانی کنید. تغییرات فوراً اعمال خواهند شد."
              : "برای ایجاد کد تخفیف جدید، کد، درصد تخفیف و در صورت نیاز تاریخ انقضا یا محدودیت استفاده را مشخص کنید."}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="discount-code">کد تخفیف</Label>
            <Input
              className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl"
              id="discount-code"
              placeholder="مثلاً: DELTA25"
              value={codeDraft}
              onChange={(event) => setCodeDraft(event.target.value.toUpperCase())}
              disabled={isActionLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount-house">اقامتگاه مرتبط</Label>
            {houses.length > 0 ? (
              <Select
                value={houseDraft || undefined}
                onValueChange={setHouseDraft}
                disabled={isActionLoading || isHousesLoading}
              >
                <SelectTrigger className="border-border bg-subBg px-4 py-2 text-right">
                  <SelectValue
                    placeholder={
                      isHousesLoading
                        ? "در حال بارگذاری..."
                        : "اقامتگاه مورد نظر را انتخاب کنید"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-72" position="popper" sideOffset={8}>
                  {houses.map((house) => (
                    <SelectItem key={house.id} value={house.id.toString()}>
                      <div className="flex flex-col text-right">
                        <span className="font-medium">{house.title ?? `شناسه ${house.id}`}</span>
                        <span className="text-xs text-muted-foreground">ID: {house.id}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 bg-subBg px-3 py-2 text-sm text-muted-foreground">
                {isHousesLoading
                  ? "در حال بارگذاری فهرست اقامتگاه‌ها..."
                  : "هیچ اقامتگاهی برای انتخاب یافت نشد. می‌توانید شناسه را به صورت دستی وارد کنید."}
              </div>
            )}
            <Input
              className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl remove-number-spin"
              id="discount-house"
              type="number"
              min="1"
              placeholder="شناسه اقامتگاه را وارد کنید"
              value={houseDraft}
              onChange={(event) => setHouseDraft(event.target.value)}
              disabled={isActionLoading}
              autoComplete="off"
              required
            />
            <p className="text-xs text-muted-foreground">
              برای انتخاب سریع یکی از اقامتگاه‌های ثبت‌شده، از فهرست بالا استفاده کنید.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="discount-percentage">درصد تخفیف</Label>
              <Input
                className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl remove-number-spin"
                id="discount-percentage"
                type="number"
                min="0"
                max="100"
                step="0.5"
                placeholder="مثلاً: 15"
                value={percentageDraft}
                onChange={(event) => setPercentageDraft(event.target.value)}
                disabled={isActionLoading}
                required
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount-expiration">تاریخ انقضا (اختیاری)</Label>
              <Input
                className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl"
                id="discount-expiration"
                type="date"
                value={expirationDraft}
                onChange={(event) => setExpirationDraft(event.target.value)}
                disabled={isActionLoading}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:flex-row-reverse">
            <Button type="submit" disabled={isActionLoading}>
              {isActionLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isActionLoading}>
              انصراف
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

