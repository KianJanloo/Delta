"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminSearchInput from "@/components/dashboard/admin/shared/AdminSearchInput";
import AdminFiltersBar, {
  type AdminFilterTag,
} from "@/components/dashboard/admin/shared/AdminFiltersBar";

type SignedFilter = "all" | "signed" | "pending";

interface AdminDocumentsFiltersProps {
  searchDraft: string;
  setSearchDraft: (value: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  typeDraft: string;
  setTypeDraft: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  signedFilter: SignedFilter;
  setSignedFilter: (value: SignedFilter) => void;
  setPage: (value: number | ((prev: number) => number)) => void;
  isLoading: boolean;
  onApplyFilters: (event?: React.FormEvent<HTMLFormElement>) => void;
  onResetFilters: () => void;
}

export default function AdminDocumentsFilters({
  searchDraft,
  setSearchDraft,
  searchValue,
  setSearchValue,
  typeDraft,
  setTypeDraft,
  typeFilter,
  setTypeFilter,
  signedFilter,
  setSignedFilter,
  setPage,
  isLoading,
  onApplyFilters,
  onResetFilters,
}: AdminDocumentsFiltersProps) {
  const activeFilterTags = useMemo<AdminFilterTag[]>(() => {
    const tags: AdminFilterTag[] = [];
    if (typeFilter.trim()) {
      tags.push({
        key: "documentType",
        label: "نوع سند",
        value: typeFilter.trim(),
        onRemove: () => {
          setTypeFilter("");
          setTypeDraft("");
          setPage(1);
        },
      });
    }
    if (searchValue.trim()) {
      tags.push({
        key: "search",
        label: "جستجو",
        value: searchValue.trim(),
        onRemove: () => {
          setSearchValue("");
          setSearchDraft("");
          setPage(1);
        },
      });
    }
    return tags;
  }, [typeFilter, searchValue, setTypeFilter, setTypeDraft, setSearchValue, setSearchDraft, setPage]);

  return (
    <Card className="border-border/70">
      <CardHeader className="space-y-4 pb-4 text-right">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold">جستجوی مدارک</CardTitle>
          </div>
        </div>
        <form className="space-y-3" onSubmit={onApplyFilters}>
          <div className="flex flex-wrap gap-3">
            <AdminSearchInput
              placeholder="جستجو بر اساس شناسه، کاربر، ملک یا توضیحات"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              onClear={() => {
                setSearchDraft("");
                setSearchValue("");
                setPage(1);
              }}
            />

            <AdminSearchInput
              placeholder="نوع سند (مثلا: ownership)"
              value={typeDraft}
              onChange={(event) => setTypeDraft(event.target.value)}
              onClear={() => {
                setTypeDraft("");
                setTypeFilter("");
                setPage(1);
              }}
            />

            <Select
              value={signedFilter}
              onValueChange={(value: SignedFilter) => {
                setSignedFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="justify-between text-right">
                <SelectValue placeholder="وضعیت تایید" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="signed">تایید شده</SelectItem>
                <SelectItem value="pending">در انتظار تایید</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" variant="secondary" disabled={isLoading}>
              {isLoading ? "در حال اعمال..." : "اعمال فیلترها"}
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

