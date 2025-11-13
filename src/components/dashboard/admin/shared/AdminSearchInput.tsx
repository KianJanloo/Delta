'use client';

import { forwardRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminSearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

const AdminSearchInput = forwardRef<HTMLInputElement, AdminSearchInputProps>(
  ({ className, value, onClear, placeholder, ...props }, ref) => {
    const hasValue =
      (typeof value === "string" && value.length > 0) ||
      (typeof value === "number" && !Number.isNaN(value));

    return (
      <div className="relative flex items-center" dir="rtl">
        <Search
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
        />
        <Input
          ref={ref}
          value={value}
          placeholder={placeholder}
          className={cn(
            "text-right bg-background border border-border/70 rounded-lg py-2 pr-8 pl-2",
            className
          )}
          {...props}
        />
        {hasValue && onClear ? (
          <Button
            type="button"
            tabIndex={-1}
            variant="ghost"
            size="icon"
            className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={onClear}
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>
    );
  }
);

AdminSearchInput.displayName = "AdminSearchInput";

export default AdminSearchInput;
