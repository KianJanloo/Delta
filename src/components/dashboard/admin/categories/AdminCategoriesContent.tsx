'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable, { type AdminTableColumn } from "@/components/dashboard/admin/shared/AdminResourceTable";
import AdminSearchInput from "@/components/dashboard/admin/shared/AdminSearchInput";
import AdminFiltersBar, { type AdminFilterTag } from "@/components/dashboard/admin/shared/AdminFiltersBar";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import { normalizeList } from "@/components/dashboard/admin/shared/normalize";
import { showToast } from "@/core/toast/toast";
import { createCategory } from "@/utils/service/api/categories/createCategory";
import { updateCategory } from "@/utils/service/api/categories/updateCategory";
import { deleteCategory } from "@/utils/service/api/categories/deleteCategory";
import { getAllCategories } from "@/utils/service/api/categories/getAllCategories";
import type { Category } from "@/types/categories-type/categories-type";

type CategoryWithMeta = Category & {
  description?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  slug?: string | null;
};

type DialogMode = "create" | "edit" | "delete" | null;

const AdminCategoriesContent = () => {
  const { formatNumber } = useAdminFormatters();
  const [categories, setCategories] = useState<CategoryWithMeta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchDraft, setSearchDraft] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithMeta | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [descriptionDraft, setDescriptionDraft] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleFetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await getAllCategories();
      const list = normalizeList<CategoryWithMeta>(payload);
      setCategories(list);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setCategories([]);
      setError("بارگذاری دسته‌بندی‌ها با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleFetchCategories();
  }, [handleFetchCategories]);

  const filteredCategories = useMemo(() => {
    if (!searchValue.trim()) {
      return categories;
    }
    const query = searchValue.trim().toLowerCase();
    return categories.filter((category) => {
      const nameMatch = category.name?.toLowerCase().includes(query);
      const descriptionMatch = category.description?.toLowerCase().includes(query) ?? false;
      const slugMatch = category.slug?.toLowerCase().includes(query) ?? false;
      return Boolean(nameMatch || descriptionMatch || slugMatch);
    });
  }, [categories, searchValue]);

  const activeFilterTags = useMemo<AdminFilterTag[]>(() => {
    const tags: AdminFilterTag[] = [];
    if (searchValue.trim()) {
      tags.push({
        key: "search",
        label: "جستجو",
        value: searchValue.trim(),
        onRemove: () => {
          setSearchValue("");
          setSearchDraft("");
        },
      });
    }
    return tags;
  }, [searchValue]);

  const openDialog = useCallback(
    (mode: Exclude<DialogMode, null>, category?: CategoryWithMeta) => {
      setDialogMode(mode);
      if (category) {
        setSelectedCategory(category);
        setNameDraft(category.name ?? "");
        setDescriptionDraft(category.description ?? "");
      } else {
        setSelectedCategory(null);
        setNameDraft("");
        setDescriptionDraft("");
      }
    },
    [],
  );

  const closeDialog = useCallback(() => {
    setDialogMode(null);
    setSelectedCategory(null);
    setNameDraft("");
    setDescriptionDraft("");
    setIsActionLoading(false);
  }, []);

  const handleApplyFilters = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setSearchValue(searchDraft.trim());
  };

  const handleResetFilters = () => {
    setSearchDraft("");
    setSearchValue("");
  };

  const handleSubmitCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = nameDraft.trim();
    const trimmedDescription = descriptionDraft.trim();

    if (!trimmedName) {
      showToast("error", "لطفاً نام دسته‌بندی را وارد کنید.");
      return;
    }

    setIsActionLoading(true);
    try {
      if (dialogMode === "create") {
        await createCategory({ name: trimmedName });
        showToast("success", "دسته‌بندی جدید با موفقیت ایجاد شد.");
      } else if (dialogMode === "edit" && selectedCategory) {
        await updateCategory(Number(selectedCategory.id), {
          name: trimmedName,
          ...(trimmedDescription ? { description: trimmedDescription } : {}),
        });
        showToast("success", "دسته‌بندی با موفقیت بروزرسانی شد.");
      }
      closeDialog();
      await handleFetchCategories();
    } catch (err) {
      console.error("Failed to submit category", err);
      showToast("error", "عملیات ذخیره دسته‌بندی با خطا مواجه شد.");
      setIsActionLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    setIsActionLoading(true);
    try {
      await deleteCategory(Number(selectedCategory.id));
      showToast("success", "دسته‌بندی با موفقیت حذف شد.");
      closeDialog();
      await handleFetchCategories();
    } catch (err) {
      console.error("Failed to delete category", err);
      showToast("error", "حذف دسته‌بندی با خطا مواجه شد.");
      setIsActionLoading(false);
    }
  };

  const columns = useMemo<AdminTableColumn<CategoryWithMeta>[]>(() => [
    {
      key: "id",
      header: "شناسه",
      className: "w-24 whitespace-nowrap",
      cell: (item) => `#${formatNumber(item.id)}`,
    },
    {
      key: "name",
      header: "عنوان",
      className: "w-64 whitespace-nowrap font-medium text-foreground",
      cell: (item) => item.name ?? "—",
    },
    {
      key: "actions",
      header: "عملیات",
      className: "w-48 whitespace-nowrap",
      cell: (item) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => openDialog("edit", item)}
          >
            <Pencil className="size-4" />
            ویرایش
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-destructive hover:bg-destructive/10"
            onClick={() => openDialog("delete", item)}
          >
            <Trash2 className="size-4" />
            حذف
          </Button>
        </div>
      ),
    },
  ], [formatNumber, openDialog]);

  const summaryLabel =
    filteredCategories.length > 0
      ? `نمایش ${formatNumber(filteredCategories.length)} دسته‌بندی`
      : "دسته‌بندی ثبت شده‌ای وجود ندارد.";

  const isFormDialogOpen = dialogMode === "create" || dialogMode === "edit";
  const isDeleteDialogOpen = dialogMode === "delete";

  return (
    <div className="space-y-6" dir="rtl">
      <AdminPageHeader
        title="مدیریت دسته‌بندی‌ها"
        description="دسته‌بندی‌های سیستم را ایجاد، ویرایش و مدیریت کنید."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => handleFetchCategories()}
              disabled={isLoading}
            >
              <RefreshCcw className="size-4" />
              {isLoading ? "در حال بروزرسانی..." : "بروزرسانی"}
            </Button>
            <Button className="gap-2" onClick={() => openDialog("create")}>
              <Plus className="size-4" />
              دسته‌بندی جدید
            </Button>
          </div>
        }
        hint={summaryLabel}
      />

      {error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:border-rose-400/30 dark:bg-rose-500/5 dark:text-rose-300">
          {error}
        </div>
      ) : null}

      <Card className="border-border/70">
        <CardHeader className="space-y-4 text-right">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-semibold">جستجو و فیلتر</CardTitle>
              <p className="text-sm text-muted-foreground">
                نتایج را بر اساس عنوان یا توضیحات دسته‌بندی محدود کنید.
              </p>
            </div>
          </div>
          <form className="space-y-3" onSubmit={handleApplyFilters}>
            <div className="flex flex-wrap gap-3">
              <AdminSearchInput
                placeholder="جستجو بر اساس عنوان، توضیحات یا شناسه"
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                onClear={() => {
                  setSearchDraft("");
                  setSearchValue("");
                }}
              />
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" variant="secondary" disabled={isLoading}>
                {isLoading ? "در حال اعمال..." : "اعمال فیلتر"}
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
            data={filteredCategories}
            isLoading={isLoading}
            emptyMessage="دسته‌بندی مطابق جستجو یافت نشد."
            getKey={(item) => `category-${item.id}`}
          />
          <div className="text-xs text-muted-foreground">{summaryLabel}</div>
        </CardContent>
      </Card>

      <Dialog open={isFormDialogOpen} onOpenChange={(open) => (!open ? closeDialog() : null)}>
        <DialogContent className="max-w-lg text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>{dialogMode === "edit" ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "edit"
                ? "جزئیات دسته‌بندی را بروزرسانی کنید. تغییرات بلافاصله اعمال خواهند شد."
                : "برای افزودن دسته‌بندی جدید، حداقل عنوان آن را وارد کنید."}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmitCategory}>
            <div className="space-y-2">
              <Label htmlFor="category-name">عنوان دسته‌بندی</Label>
              <Input
                className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-border rounded-2xl"
                id="category-name"
                placeholder="مثلاً: ویلاهای ساحلی"
                value={nameDraft}
                onChange={(event) => setNameDraft(event.target.value)}
                disabled={isActionLoading}
                required
              />
            </div>
            <DialogFooter className="gap-2 sm:flex-row-reverse">
              <Button type="submit" disabled={isActionLoading}>
                {isActionLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </Button>
              <Button type="button" variant="outline" onClick={closeDialog} disabled={isActionLoading}>
                انصراف
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => (!open ? closeDialog() : null)}>
        <DialogContent className="max-w-md text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف دسته‌بندی</DialogTitle>
            <DialogDescription>
              {selectedCategory
                ? `آیا از حذف دسته‌بندی «${selectedCategory.name}» مطمئن هستید؟ این عملیات قابل بازگشت نیست.`
                : "آیا از حذف این دسته‌بندی مطمئن هستید؟"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:flex-row-reverse">
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={isActionLoading}
            >
              {isActionLoading ? "در حال حذف..." : "حذف دسته‌بندی"}
            </Button>
            <Button type="button" variant="outline" onClick={closeDialog} disabled={isActionLoading}>
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategoriesContent;


