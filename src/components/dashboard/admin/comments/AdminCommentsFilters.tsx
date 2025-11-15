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

interface AdminCommentsFiltersProps {
  userFilterDraft: string;
  setUserFilterDraft: (value: string) => void;
  userFilter: string;
  setUserFilter: (value: string) => void;
  houseFilterDraft: string;
  setHouseFilterDraft: (value: string) => void;
  houseFilter: string;
  setHouseFilter: (value: string) => void;
  ratingFilter: string;
  setRatingFilter: (value: string) => void;
  order: "ASC" | "DESC";
  setOrder: (value: "ASC" | "DESC") => void;
  setPage: (value: number | ((prev: number) => number)) => void;
  isLoading: boolean;
  onApplyFilters: (event?: React.FormEvent<HTMLFormElement>) => void;
  onResetFilters: () => void;
}

export default function AdminCommentsFilters({
  userFilterDraft,
  setUserFilterDraft,
  userFilter,
  setUserFilter,
  houseFilterDraft,
  setHouseFilterDraft,
  houseFilter,
  setHouseFilter,
  ratingFilter,
  setRatingFilter,
  order,
  setOrder,
  setPage,
  isLoading,
  onApplyFilters,
  onResetFilters,
}: AdminCommentsFiltersProps) {
  const activeFilterTags = useMemo<AdminFilterTag[]>(() => {
    const tags: AdminFilterTag[] = [];
    if (userFilter.trim()) {
      tags.push({
        key: "userId",
        label: "شناسه کاربر",
        value: userFilter.trim(),
        onRemove: () => {
          setUserFilter("");
          setUserFilterDraft("");
          setPage(1);
        },
      });
    }
    if (houseFilter.trim()) {
      tags.push({
        key: "houseId",
        label: "شناسه ملک",
        value: houseFilter.trim(),
        onRemove: () => {
          setHouseFilter("");
          setHouseFilterDraft("");
          setPage(1);
        },
      });
    }
    if (ratingFilter !== "all") {
      tags.push({
        key: "rating",
        label: "امتیاز",
        value: `${ratingFilter} ستاره`,
        onRemove: () => {
          setRatingFilter("all");
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
  }, [userFilter, houseFilter, ratingFilter, order, setUserFilter, setUserFilterDraft, setHouseFilter, setHouseFilterDraft, setRatingFilter, setOrder, setPage]);

  return (
    <Card className="border-border/70">
      <CardHeader className="space-y-4 pb-4 text-right">
        <CardTitle className="text-base font-semibold">
          فیلتر و جستجوی نظرات
        </CardTitle>
        <form className="space-y-3" onSubmit={onApplyFilters}>
          <div className="flex flex-wrap gap-3">
            <div>
              <AdminSearchInput
                placeholder="شناسه کاربر"
                value={userFilterDraft}
                onChange={(event) => {
                  if (/^\d*$/.test(event.target.value)) {
                    setUserFilterDraft(event.target.value);
                  }
                }}
                inputMode="numeric"
                onClear={() => {
                  setUserFilterDraft("");
                  setUserFilter("");
                  setPage(1);
                }}
              />
            </div>
            <div>
              <AdminSearchInput
                placeholder="شناسه ملک"
                value={houseFilterDraft}
                onChange={(event) => {
                  if (/^\d*$/.test(event.target.value)) {
                    setHouseFilterDraft(event.target.value);
                  }
                }}
                inputMode="numeric"
                onClear={() => {
                  setHouseFilterDraft("");
                  setHouseFilter("");
                  setPage(1);
                }}
              />
            </div>
            <Select
              value={ratingFilter}
              onValueChange={(value) => {
                setRatingFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="justify-between text-right">
                <SelectValue placeholder="امتیاز" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه امتیازها</SelectItem>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <SelectItem key={rating} value={String(rating)}>
                    {rating} ستاره
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

