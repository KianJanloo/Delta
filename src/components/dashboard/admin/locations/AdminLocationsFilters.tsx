"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import AdminSearchInput from "@/components/dashboard/admin/shared/AdminSearchInput";
import AdminFiltersBar, {
  type AdminFilterTag,
} from "@/components/dashboard/admin/shared/AdminFiltersBar";

interface AdminLocationsFiltersProps {
  areaFilterDraft: string;
  setAreaFilterDraft: (value: string) => void;
  areaFilter: string;
  setAreaFilter: (value: string) => void;
  setPage: (value: number | ((prev: number) => number)) => void;
  onApplyFilters: (event?: React.FormEvent<HTMLFormElement>) => void;
}

export default function AdminLocationsFilters({
  areaFilterDraft,
  setAreaFilterDraft,
  areaFilter,
  setAreaFilter,
  setPage,
  onApplyFilters,
}: AdminLocationsFiltersProps) {
  const activeFilterTags = useMemo<AdminFilterTag[]>(() => {
    const tags: AdminFilterTag[] = [];
    if (areaFilter.trim()) {
      tags.push({
        key: "area",
        label: "منطقه",
        value: areaFilter.trim(),
        onRemove: () => {
          setAreaFilter("");
          setAreaFilterDraft("");
          setPage(1);
        },
      });
    }
    return tags;
  }, [areaFilter, setAreaFilter, setAreaFilterDraft, setPage]);

  return (
    <Card className="border-border/70">
      <CardHeader className="space-y-4 text-right">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">فیلتر و مرتب‌سازی</CardTitle>
            <p className="text-sm text-muted-foreground">
              نتایج را بر اساس نام منطقه فیلتر کرده و ترتیب نمایش را مدیریت کنید.
            </p>
          </div>
        </div>

        <form className="space-y-3" onSubmit={onApplyFilters}>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <AdminSearchInput
              placeholder="جستجو بر اساس نام منطقه یا شناسه"
              value={areaFilterDraft}
              onChange={(event) => setAreaFilterDraft(event.target.value)}
              onClear={() => {
                setAreaFilterDraft("");
                setAreaFilter("");
                setPage(1);
              }}
            />
          </div>
        </form>

        <AdminFiltersBar tags={activeFilterTags} />
      </CardHeader>
    </Card>
  );
}

