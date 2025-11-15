"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable from "@/components/dashboard/admin/shared/AdminResourceTable";
import AdminPaginationControls from "@/components/dashboard/admin/shared/AdminPaginationControls";
import { normalizeList } from "@/components/dashboard/admin/shared/normalize";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import { showToast } from "@/core/toast/toast";
import { deleteAdminUser, getAdminUsers, updateAdminUserRole, type AdminUser } from "@/utils/service/api/admin";
import AdminUsersFilters from "./AdminUsersFilters";
import { useUsersTableColumns } from "./AdminUsersTableColumns";
import AdminUsersRoleDialog from "./AdminUsersRoleDialog";
import AdminUsersDeleteDialog from "./AdminUsersDeleteDialog";

const PAGE_SIZE = 10;

const ROLE_LABELS: Record<string, string> = {
  admin: "مدیر سیستم",
  seller: "فروشنده",
  buyer: "خریدار",
  guest: "کاربر مهمان",
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

  const columns = useUsersTableColumns({
    formatDateTime,
    formatNumber,
    onRoleChange: handleOpenRoleDialog,
    onDelete: handleOpenDeleteDialog,
  });

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

      <AdminUsersFilters
        emailFilterDraft={emailFilterDraft}
        setEmailFilterDraft={setEmailFilterDraft}
        emailFilter={emailFilter}
        setEmailFilter={setEmailFilter}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        order={order}
        setOrder={setOrder}
        setPage={setPage}
        isLoading={isLoading}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      <Card className="border-border/70">
        <CardContent className="space-y-4 text-right pt-6">
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

      <AdminUsersRoleDialog
        open={isRoleDialogOpen}
        onOpenChange={(open) => {
          setIsRoleDialogOpen(open);
          if (!open) {
            setIsActionLoading(false);
            setSelectedUser(null);
          }
        }}
        selectedUser={selectedUser}
        roleDraft={roleDraft}
        setRoleDraft={setRoleDraft}
        isActionLoading={isActionLoading}
        formatNumber={formatNumber}
        onUpdate={handleUpdateRole}
      />

      <AdminUsersDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) {
            setIsActionLoading(false);
            setSelectedUser(null);
          }
        }}
        selectedUser={selectedUser}
        isActionLoading={isActionLoading}
        formatNumber={formatNumber}
        onDelete={handleDeleteUser}
      />
    </div>
  );
};

export default AdminUsersContent;
