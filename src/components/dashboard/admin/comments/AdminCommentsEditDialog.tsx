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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminCommentsEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editDraft: {
    title: string;
    caption: string;
    rating: number;
  };
  setEditDraft: (draft: {
    title: string;
    caption: string;
    rating: number;
  } | ((prev: {
    title: string;
    caption: string;
    rating: number;
  }) => {
    title: string;
    caption: string;
    rating: number;
  })) => void;
  isActionLoading: boolean;
  onUpdate: () => void;
}

export default function AdminCommentsEditDialog({
  open,
  onOpenChange,
  editDraft,
  setEditDraft,
  isActionLoading,
  onUpdate,
}: AdminCommentsEditDialogProps) {
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
          <DialogTitle>ویرایش نظر</DialogTitle>
          <DialogDescription>
            تغییرات مورد نظر را اعمال کرده و سپس ذخیره کنید. در صورت خالی بودن فیلدی، مقدار فعلی تغییر نخواهد کرد.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="comment-title">عنوان</Label>
            <Input
              className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl"
              id="comment-title"
              placeholder="عنوان نظر"
              value={editDraft.title}
              onChange={(event) =>
                setEditDraft((prev) => ({ ...prev, title: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment-text">متن نظر</Label>
            <Textarea
              className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl"
              id="comment-text"
              placeholder="متن اصلی نظر"
              value={editDraft.caption}
              onChange={(event) =>
                setEditDraft((prev) => ({ ...prev, caption: event.target.value }))
              }
              rows={4}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="comment-rating">امتیاز</Label>
              <Input
                className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl"
                id="comment-rating"
                placeholder="1 تا 5"
                value={editDraft.rating}
                inputMode="numeric"
                onChange={(event) => {
                  if (event.target.value === "" || /^\d*$/.test(event.target.value)) {
                    setEditDraft((prev) => ({ ...prev, rating: Number(event.target.value) }));
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>امتیاز</Label>
              <Select
                value={editDraft.rating ? editDraft.rating.toString() : "5"}
                onValueChange={(value) =>
                  setEditDraft((prev) => ({ ...prev, rating: Number(value) }))
                }
                defaultValue="5"
              >
                <SelectTrigger className="justify-between text-right">
                  <SelectValue placeholder="انتخاب امتیاز" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} ستاره
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

