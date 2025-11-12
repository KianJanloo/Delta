'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminPaginationControlsProps {
  page: number;
  hasNextPage: boolean;
  isLoading?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  formatNumber: (value: unknown) => string;
  summary?: string;
  className?: string;
}

const AdminPaginationControls = ({
  page,
  hasNextPage,
  isLoading,
  onPrevious,
  onNext,
  formatNumber,
  summary,
  className,
}: AdminPaginationControlsProps) => {
  const handlePrevious = () => {
    if (page > 1 && !isLoading) {
      onPrevious();
    }
  };

  const handleNext = () => {
    if (hasNextPage && !isLoading) {
      onNext();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-dashed border-border/60 pt-4 text-xs text-muted-foreground",
        className,
      )}
      dir="rtl"
    >
      {summary ? <span>{summary}</span> : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handlePrevious}
            disabled={page <= 1 || isLoading}
          >
            <ChevronRight className="size-4" />
            <span>قبلی</span>
          </Button>

          <div className="rounded-full border border-border/60 bg-background/80 px-4 py-1 text-sm font-semibold text-foreground">
            صفحه {formatNumber(page)}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleNext}
            disabled={!hasNextPage || isLoading}
          >
            <span>بعدی</span>
            <ChevronLeft className="size-4" />
          </Button>
        </div>
        <span className="text-[11px] text-muted-foreground/80">
          {hasNextPage
            ? `صفحه ${formatNumber(page + 1)} در دسترس است.`
            : "به انتهای فهرست رسیده‌اید."}
        </span>
      </div>
    </div>
  );
};

export default AdminPaginationControls;

