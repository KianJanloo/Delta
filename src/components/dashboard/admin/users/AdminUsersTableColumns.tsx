"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  type AdminTableColumn,
} from "@/components/dashboard/admin/shared/AdminResourceTable";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/utils/service/api/admin";

const ROLE_LABELS: Record<string, string> = {
  admin: "مدیر سیستم",
  seller: "فروشنده",
  buyer: "خریدار",
  guest: "کاربر مهمان",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-primary/10 text-primary border-transparent",
  seller: "bg-amber-500/10 text-amber-600 border-transparent",
  buyer: "bg-emerald-500/10 text-emerald-600 border-transparent",
  guest: "bg-muted text-muted-foreground border-dashed",
};

interface AdminUsersTableColumnsProps {
  formatDateTime: (value: string) => string;
  formatNumber: (value: number) => string;
  onRoleChange: (item: AdminUser) => void;
  onDelete: (item: AdminUser) => void;
}

export function useUsersTableColumns({
  formatDateTime,
  formatNumber,
  onRoleChange,
  onDelete,
}: AdminUsersTableColumnsProps) {
  return useMemo<AdminTableColumn<AdminUser>[]>(
    () => [
      {
        key: "id",
        header: "شناسه",
        className: "whitespace-nowrap",
        cell: (user) => (
          <span className="font-medium text-foreground">
            #{formatNumber(user.id)}
          </span>
        ),
      },
      {
        key: "email",
        header: "آدرس ایمیل",
        cell: (user) => (
          <div className="flex flex-col">
            <span className="font-medium">{user.email}</span>
            <span className="text-xs text-muted-foreground">
              ایجاد شده در {formatDateTime(user.createdAt)}
            </span>
          </div>
        ),
      },
      {
        key: "role",
        header: "نقش کاربر",
        className: "whitespace-nowrap",
        cell: (user) => {
          const roleKey = user.role?.toLowerCase() ?? "guest";
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
                ROLE_COLORS[roleKey] ?? ROLE_COLORS.guest,
              )}
            >
              {ROLE_LABELS[roleKey] ?? user.role ?? "نامشخص"}
            </span>
          );
        },
      },
      {
        key: "updatedAt",
        header: "آخرین بروزرسانی",
        className: "whitespace-nowrap",
        cell: (user) => formatDateTime(user.updatedAt),
      },
      {
        key: "actions",
        header: "عملیات",
        className: "w-[190px]",
        cell: (user) => (
          <div className="flex items-center justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => onRoleChange(user)}>
              تغییر نقش
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(user)}
            >
              حذف
            </Button>
          </div>
        ),
        renderMobile: (user) => (
          <div className="flex flex-col gap-2 w-full">
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full justify-center"
              onClick={() => onRoleChange(user)}
            >
              تغییر نقش
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="w-full justify-center"
              onClick={() => onDelete(user)}
            >
              حذف
            </Button>
          </div>
        ),
      },
    ],
    [formatDateTime, formatNumber, onRoleChange, onDelete]
  );
}

