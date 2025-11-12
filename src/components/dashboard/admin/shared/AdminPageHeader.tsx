'use client';

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  hint?: string;
  actions?: ReactNode;
  className?: string;
}

const AdminPageHeader = ({
  title,
  description,
  hint,
  actions,
  className,
}: AdminPageHeaderProps) => {
  return (
    <section
      className={cn(
        "rounded-3xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 md:p-8",
        className,
      )}
      dir="rtl"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          {hint ? (
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground md:text-sm">
              {hint}
            </span>
          ) : null}
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-3">
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default AdminPageHeader;

