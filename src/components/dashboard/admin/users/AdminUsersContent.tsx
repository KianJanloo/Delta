'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { Users2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { showToast } from "@/core/toast/toast";
import { deleteAdminUser, getAdminUsers, updateAdminUserRole, type AdminUser } from "@/utils/service/api/admin";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable, { type AdminTableColumn } from "@/components/dashboard/admin/shared/AdminResourceTable";
import { normalizeList } from "@/components/dashboard/admin/shared/normalize";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import { cn } from "@/lib/utils";
import AdminPaginationControls from "@/components/dashboard/admin/shared/AdminPaginationControls";
import AdminFiltersBar, { type AdminFilterTag } from "@/components/dashboard/admin/shared/AdminFiltersBar";
import AdminSearchInput from "@/components/dashboard/admin/shared/AdminSearchInput";

const PAGE_SIZE = 10;

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

const AdminUsersContent = () => {
  const { formatDateTime, formatNumber } = useAdminFormatters();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [emailFilterDraft, setEmailFilterDraft] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roleDraft, setRoleDraft] = useState<string>("buyer");
  const [isActionLoading, setIsActionLoading] = useState(false);

  const totalRenderedUsers = useMemo(
    () => (page - 1) * PAGE_SIZE + users.length,
    [page, users.length],
  );

  const handleFetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await getAdminUsers({
        page,
        limit: PAGE_SIZE,
        sort: "createdAt",
        order,
        email: emailFilter.trim() ? emailFilter.trim() : undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
      });
      const list = normalizeList<AdminUser>(payload);
      setUsers(list);
      setHasNextPage(list.length === PAGE_SIZE);
    } catch (err) {
      console.error("Failed to fetch admin users", err);
      setUsers([]);
      setHasNextPage(false);
      setError("بارگذاری کاربران با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  }, [page, order, emailFilter, roleFilter]);

  useEffect(() => {
    handleFetchUsers();
  }, [handleFetchUsers]);

  const handleOpenRoleDialog = useCallback((user: AdminUser) => {
    const normalizedRole = user.role?.toLowerCase();
    setSelectedUser(user);
    setRoleDraft(
      normalizedRole && ROLE_LABELS[normalizedRole] ? normalizedRole : "guest",
    );
    setIsRoleDialogOpen(true);
  }, []);

  const handleOpenDeleteDialog = useCallback((user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleApplyFilters = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setPage(1);
    setEmailFilter(emailFilterDraft);
  };

  const handleResetFilters = () => {
    setEmailFilterDraft("");
    setEmailFilter("");
    setRoleFilter("all");
    setOrder("DESC");
    setPage(1);
  };

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
  }, [emailFilter, roleFilter, order]);

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    setIsActionLoading(true);
    try {
      await updateAdminUserRole(selectedUser.id, roleDraft);
      showToast("success", "نقش کاربر با موفقیت به‌روزرسانی شد.");
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
      await handleFetchUsers();
    } catch (err) {
      console.error("Failed to update user role", err);
      showToast("error", "به‌روزرسانی نقش کاربر با خطا مواجه شد.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setIsActionLoading(true);
    try {
      await deleteAdminUser(selectedUser.id);
      showToast("success", "کاربر با موفقیت حذف شد.");
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      const shouldGoPrevPage = users.length === 1 && page > 1 && !hasNextPage;
      if (shouldGoPrevPage) {
        setPage((prev) => Math.max(prev - 1, 1));
      } else {
        await handleFetchUsers();
      }
    } catch (err) {
      console.error("Failed to delete user", err);
      showToast("error", "حذف کاربر با خطا مواجه شد.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const columns = useMemo<AdminTableColumn<AdminUser>[]>(() => [
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
          <Button size="sm" variant="outline" onClick={() => handleOpenRoleDialog(user)}>
            تغییر نقش
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleOpenDeleteDialog(user)}
          >
            حذف
          </Button>
        </div>
      ),
    },
  ], [formatNumber, formatDateTime, handleOpenRoleDialog, handleOpenDeleteDialog]);

  const summaryLabel =
    users.length > 0
      ? `نمایش ${formatNumber(users.length)} کاربر از ابتدای فهرست تا ${formatNumber(totalRenderedUsers)}`
      : "کاربری برای نمایش موجود نیست.";

  return (
    <div className="space-y-6" dir="rtl">
      <AdminPageHeader
        title="مدیریت کاربران"
        description="لیست کامل کاربران سامانه دلتا شامل نقش‌ها، وضعیت و تاریخچه فعالیت."
        actions={
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => handleFetchUsers()}
            disabled={isLoading}
          >
            <Users2 className="size-4" />
            {isLoading ? "در حال بروزرسانی..." : "بروزرسانی لیست"}
          </Button>
        }
        hint={`تعداد کاربران در این صفحه: ${formatNumber(users.length)}`}
      />

      <Card className="border-border/70">
        <CardHeader className="space-y-4 pb-4 text-right">
          <CardTitle className="text-base font-semibold">فیلتر و جستجو</CardTitle>
          <form className="space-y-3" onSubmit={handleApplyFilters}>
            <div className="grid gap-3 md:grid-cols-4">
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
              <Button type="button" variant="ghost" onClick={handleResetFilters} disabled={isLoading}>
                حذف فیلترها
              </Button>
            </div>
          </form>
          <AdminFiltersBar tags={activeFilterTags} />
        </CardHeader>
        <CardContent className="space-y-4 text-right">
          <AdminResourceTable
            columns={columns}
            data={users}
            isLoading={isLoading}
            errorMessage={error}
            emptyMessage="کاربری با این مشخصات یافت نشد."
            getKey={(user) => `user-${user.id}`}
          />

          <AdminPaginationControls
            page={page}
            hasNextPage={hasNextPage}
            isLoading={isLoading}
            onPrevious={() => setPage((prev) => Math.max(prev - 1, 1))}
            onNext={() => setPage((prev) => (hasNextPage ? prev + 1 : prev))}
            formatNumber={formatNumber}
            summary={summaryLabel}
          />
        </CardContent>
      </Card>

      <Dialog
        open={isRoleDialogOpen}
        onOpenChange={(open) => {
          setIsRoleDialogOpen(open);
          if (!open) {
            setIsActionLoading(false);
            setSelectedUser(null);
          }
        }}
      >
        <DialogContent className="text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>تغییر نقش کاربر</DialogTitle>
            <DialogDescription>
              {selectedUser
                ? `نقش کاربر ${selectedUser.email ?? `#${formatNumber(selectedUser.id)}`} را انتخاب کنید.`
                : "نقش جدید کاربر را انتخاب کنید."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={roleDraft} onValueChange={setRoleDraft}>
              <SelectTrigger className="justify-between">
                <SelectValue placeholder="انتخاب نقش" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-2 sm:flex-row-reverse sm:space-x-reverse sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRoleDialogOpen(false)}
              disabled={isActionLoading}
            >
              انصراف
            </Button>
            <Button onClick={handleUpdateRole} disabled={isActionLoading}>
              {isActionLoading ? "در حال ذخیره..." : "ثبت تغییرات"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) {
            setIsActionLoading(false);
            setSelectedUser(null);
          }
        }}
      >
        <DialogContent className="text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف کاربر</DialogTitle>
            <DialogDescription>
              {selectedUser
                ? `آیا از حذف کاربر ${selectedUser.email ?? `#${formatNumber(selectedUser.id)}`} مطمئن هستید؟ این عملیات بازگشت‌پذیر نیست.`
                : "این عملیات بازگشت‌پذیر نیست."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:flex-row-reverse sm:space-x-reverse sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isActionLoading}
            >
              انصراف
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isActionLoading}
            >
              {isActionLoading ? "در حال حذف..." : "حذف کاربر"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersContent;

