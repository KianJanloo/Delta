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

const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: "در انتظار بررسی",
  confirmed: "تایید شده",
  canceled: "لغو شده",
};

interface AdminBookingsFiltersProps {
  userFilterDraft: string;
  setUserFilterDraft: (value: string) => void;
  userFilter: string;
  setUserFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  order: "ASC" | "DESC";
  setOrder: (value: "ASC" | "DESC") => void;
  setPage: (value: number | ((prev: number) => number)) => void;
  isLoading: boolean;
  onApplyFilters: (event?: React.FormEvent<HTMLFormElement>) => void;
  onResetFilters: () => void;
}

export default function AdminBookingsFilters({
  userFilterDraft,
  setUserFilterDraft,
  userFilter,
  setUserFilter,
  statusFilter,
  setStatusFilter,
  order,
  setOrder,
  setPage,
  isLoading,
  onApplyFilters,
  onResetFilters,
}: AdminBookingsFiltersProps) {
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
    if (statusFilter !== "all") {
      tags.push({
        key: "status",
        label: "وضعیت",
        value: BOOKING_STATUS_LABELS[statusFilter] ?? statusFilter,
        onRemove: () => {
          setStatusFilter("all");
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
  }, [userFilter, statusFilter, order, setUserFilter, setUserFilterDraft, setStatusFilter, setOrder, setPage]);

  return (
    <Card className="border-border/70">
      <CardHeader className="space-y-4 pb-4 text-right">
        <CardTitle className="text-base font-semibold">فیلتر رزروها</CardTitle>
        <form className="space-y-3" onSubmit={onApplyFilters}>
          <div className="flex flex-wrap gap-3">
            <div className="md:col-span-2">
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

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="justify-between text-right">
                <SelectValue placeholder="وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="pending">در انتظار بررسی</SelectItem>
                <SelectItem value="confirmed">تایید شده</SelectItem>
                <SelectItem value="cancelled">لغو شده</SelectItem>
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

