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

interface AdminPropertiesFiltersProps {
  sellerFilterDraft: string;
  setSellerFilterDraft: (value: string) => void;
  sellerFilter: string;
  setSellerFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  order: "ASC" | "DESC";
  setOrder: (value: "ASC" | "DESC") => void;
  setPage: (value: number | ((prev: number) => number)) => void;
  isLoading: boolean;
  onApplyFilters: (event?: React.FormEvent<HTMLFormElement>) => void;
  onResetFilters: () => void;
}

export default function AdminPropertiesFilters({
  sellerFilterDraft,
  setSellerFilterDraft,
  sellerFilter,
  setSellerFilter,
  order,
  setOrder,
  setPage,
  isLoading,
  onApplyFilters,
  onResetFilters,
}: AdminPropertiesFiltersProps) {
  const activeFilterTags = useMemo<AdminFilterTag[]>(() => {
    const tags: AdminFilterTag[] = [];
    if (sellerFilter.trim()) {
      tags.push({
        key: "sellerId",
        label: "شناسه فروشنده",
        value: sellerFilter.trim(),
        onRemove: () => {
          setSellerFilter("");
          setSellerFilterDraft("");
          setPage(1);
        },
      });
    }
    if (order === "ASC") {
      tags.push({
        key: "order",
        label: "مرتب‌سازی",
        value: "قدیمی‌ترین‌ها",
        onRemove: () => {
          setOrder("DESC");
          setPage(1);
        },
      });
    }
    return tags;
  }, [sellerFilter, order, setSellerFilter, setSellerFilterDraft, setOrder, setPage]);

  return (
    <Card className="border-border/70">
      <CardHeader className="space-y-4 pb-4 text-right">
        <CardTitle className="text-base font-semibold">فیلتر املاک</CardTitle>
        <form className="space-y-3" onSubmit={onApplyFilters}>
          <div className="flex flex-wrap gap-3">
            <div className="md:col-span-2">
              <AdminSearchInput
                placeholder="شناسه فروشنده"
                value={sellerFilterDraft}
                onChange={(event) => {
                  if (/^\d*$/.test(event.target.value)) {
                    setSellerFilterDraft(event.target.value);
                  }
                }}
                inputMode="numeric"
                onClear={() => {
                  setSellerFilterDraft("");
                  setSellerFilter("");
                  setPage(1);
                }}
              />
            </div>

            <Select
              value={order}
              onValueChange={(value: "ASC" | "DESC") => {
                setOrder(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="justify-between text-right">
                <SelectValue placeholder="مرتب‌سازی" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DESC">جدیدترین‌ها</SelectItem>
                <SelectItem value="ASC">قدیمی‌ترین‌ها</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" variant="secondary" disabled={isLoading}>
              {isLoading ? "در حال اعمال..." : "اعمال فیلترها"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onResetFilters}
              disabled={isLoading}
            >
              حذف فیلترها
            </Button>
          </div>
        </form>
        <AdminFiltersBar tags={activeFilterTags} />
      </CardHeader>
    </Card>
  );
}

