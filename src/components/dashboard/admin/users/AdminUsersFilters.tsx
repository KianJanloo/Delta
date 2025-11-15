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

const ROLE_LABELS: Record<string, string> = {
  admin: "مدیر سیستم",
  seller: "فروشنده",
  buyer: "خریدار",
  guest: "کاربر مهمان",
};

interface AdminUsersFiltersProps {
  emailFilterDraft: string;
  setEmailFilterDraft: (value: string) => void;
  emailFilter: string;
  setEmailFilter: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  order: "ASC" | "DESC";
  setOrder: (value: "ASC" | "DESC") => void;
  setPage: (value: number | ((prev: number) => number)) => void;
  isLoading: boolean;
  onApplyFilters: (event?: React.FormEvent<HTMLFormElement>) => void;
  onResetFilters: () => void;
}

export default function AdminUsersFilters({
  emailFilterDraft,
  setEmailFilterDraft,
  emailFilter,
  setEmailFilter,
  roleFilter,
  setRoleFilter,
  order,
  setOrder,
  setPage,
  isLoading,
  onApplyFilters,
  onResetFilters,
}: AdminUsersFiltersProps) {
  const activeFilterTags = useMemo<AdminFilterTag[]>(() => {
    const tags: AdminFilterTag[] = [];
    if (emailFilter.trim()) {
      tags.push({
        key: "email",
        label: "ایمیل",
        value: emailFilter.trim(),
        onRemove: () => {
          setEmailFilter("");
          setEmailFilterDraft("");
          setPage(1);
        },
      });
    }
    if (roleFilter !== "all") {
      tags.push({
        key: "role",
        label: "نقش",
        value: ROLE_LABELS[roleFilter] ?? roleFilter,
        onRemove: () => {
          setRoleFilter("all");
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
  }, [emailFilter, roleFilter, order, setEmailFilter, setEmailFilterDraft, setRoleFilter, setOrder, setPage]);

  return (
    <Card className="border-border/70">
      <CardHeader className="space-y-4 pb-4 text-right">
        <CardTitle className="text-base font-semibold">فیلتر و جستجو</CardTitle>
        <form className="space-y-3" onSubmit={onApplyFilters}>
          <div className="flex flex-wrap gap-3">
            <div className="md:col-span-2">
              <AdminSearchInput
                placeholder="جستجو بر اساس ایمیل"
                value={emailFilterDraft}
                onChange={(event) => setEmailFilterDraft(event.target.value)}
                autoComplete="off"
                onClear={() => {
                  setEmailFilterDraft("");
                  setEmailFilter("");
                  setPage(1);
                }}
              />
            </div>
            <Select
              value={roleFilter}
              onValueChange={(value) => {
                setRoleFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="justify-between text-right">
                <SelectValue placeholder="نقش کاربر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه نقش‌ها</SelectItem>
                <SelectItem value="admin">مدیران</SelectItem>
                <SelectItem value="seller">فروشندگان</SelectItem>
                <SelectItem value="buyer">خریداران</SelectItem>
                <SelectItem value="guest">مهمان</SelectItem>
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

