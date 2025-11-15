"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminSearchInput from "@/components/dashboard/admin/shared/AdminSearchInput";
import AdminFiltersBar, {
  type AdminFilterTag,
} from "@/components/dashboard/admin/shared/AdminFiltersBar";

interface AdminDiscountCodesFiltersProps {
  searchDraft: string;
  setSearchDraft: (value: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  setPage: (value: number | ((prev: number) => number)) => void;
  isLoading: boolean;
  onApplyFilters: (event?: React.FormEvent<HTMLFormElement>) => void;
  onResetFilters: () => void;
}

export default function AdminDiscountCodesFilters({
  searchDraft,
  setSearchDraft,
  searchValue,
  setSearchValue,
  setPage,
  isLoading,
  onApplyFilters,
  onResetFilters,
}: AdminDiscountCodesFiltersProps) {
  const activeFilterTags = useMemo<AdminFilterTag[]>(() => {
    const tags: AdminFilterTag[] = [];
    if (searchValue.trim()) {
      tags.push({
        key: "search",
        label: "کد تخفیف",
        value: searchValue.trim(),
        onRemove: () => {
          setSearchValue("");
          setSearchDraft("");
          setPage(1);
        },
      });
    }
    return tags;
  }, [searchValue, setSearchValue, setSearchDraft, setPage]);

  return (
    <Card className="border-border/70">
      <CardHeader className="space-y-4 text-right">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">جستجو و مرتب‌سازی</CardTitle>
            <p className="text-sm text-muted-foreground">
              کدهای تخفیف را بر اساس کد، تاریخ ایجاد یا میزان تخفیف مدیریت کنید.
            </p>
          </div>
        </div>

        <form className="space-y-3" onSubmit={onApplyFilters}>
          <div className="flex flex-wrap gap-3">
            <AdminSearchInput
              placeholder="جستجو بر اساس کد تخفیف"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              onClear={() => {
                setSearchDraft("");
                setSearchValue("");
                setPage(1);
              }}
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" variant="secondary" disabled={isLoading}>
              {isLoading ? "در حال اعمال..." : "اعمال فیلتر"}
            </Button>
            <Button type="button" variant="ghost" onClick={onResetFilters} disabled={isLoading}>
              حذف فیلترها
            </Button>
          </div>
        </form>

        <AdminFiltersBar tags={activeFilterTags} />
      </CardHeader>
    </Card>
  );
}

