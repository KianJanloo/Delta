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
    const hasValue = Boolean(
      (typeof value === "string" && value.length > 0) ||
        (typeof value === "number" && !Number.isNaN(value)),
    );

    return (
      <div className="relative flex items-center" dir="rtl">
        <Input
          ref={ref}
          value={value}
          placeholder={placeholder}
          className={cn("text-right bg-background border border-border/70 rounded-lg py-2 px-4 pr-10", className)}
          {...props}
        />
        <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
        {hasValue && onClear ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={onClear}
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>
    );
  },
);

AdminSearchInput.displayName = "AdminSearchInput";

export default AdminSearchInput;

