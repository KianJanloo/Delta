'use client';

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AdminFilterTag {
  key: string;
  label: string;
  value: string;
  onRemove?: () => void;
}

interface AdminFiltersBarProps {
  tags: AdminFilterTag[];
  className?: string;
}

const AdminFiltersBar = ({ tags, className }: AdminFiltersBarProps) => {
  if (!tags.length) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl border border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between",
        className,
      )}
      dir="rtl"
    >
      <span className="font-medium text-foreground/80">فیلترهای فعال</span>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag.key}
            className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-3 py-1 text-[11px] font-medium text-foreground"
          >
            <span>{tag.label}</span>
            <span className="text-muted-foreground/80">•</span>
            <span className="text-muted-foreground">{tag.value}</span>
            {tag.onRemove ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-muted-foreground hover:text-foreground"
                onClick={tag.onRemove}
              >
                <X className="size-3.5" />
              </Button>
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AdminFiltersBar;

