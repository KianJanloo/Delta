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

interface AdminLocationsFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  nameDraft: string;
  setNameDraft: (value: string) => void;
  latDraft: string;
  setLatDraft: (value: string) => void;
  lngDraft: string;
  setLngDraft: (value: string) => void;
  isActionLoading: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function AdminLocationsFormDialog({
  open,
  onOpenChange,
  mode,
  nameDraft,
  setNameDraft,
  latDraft,
  setLatDraft,
  lngDraft,
  setLngDraft,
  isActionLoading,
  onSubmit,
}: AdminLocationsFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => (!open ? onOpenChange(false) : null)}>
      <DialogContent className="max-w-lg text-right" dir="rtl">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "ویرایش موقعیت" : "موقعیت جدید"}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "اطلاعات موقعیت را بروزرسانی کنید. مختصات صحیح را با دقت وارد کنید."
              : "برای افزودن موقعیت جدید، نام منطقه و مختصات جغرافیایی را وارد کنید."}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="location-name">نام منطقه</Label>
            <Input
              className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl remove-number-spin"
              id="location-name"
              placeholder="مثلاً: نیاوران"
              value={nameDraft}
              onChange={(event) => setNameDraft(event.target.value)}
              disabled={isActionLoading}
              required
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="space-y-2">
              <Label htmlFor="location-lat">عرض جغرافیایی (Latitude)</Label>
              <Input
                className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl remove-number-spin"
                id="location-lat"
                type="number"
                step="0.0001"
                placeholder="مثلاً: 35.7476"
                value={latDraft}
                onChange={(event) => setLatDraft(event.target.value)}
                disabled={isActionLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location-lng">طول جغرافیایی (Longitude)</Label>
              <Input
                className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl remove-number-spin"
                id="location-lng"
                type="number"
                step="0.0001"
                placeholder="مثلاً: 51.4244"
                value={lngDraft}
                onChange={(event) => setLngDraft(event.target.value)}
                disabled={isActionLoading}
                required
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

