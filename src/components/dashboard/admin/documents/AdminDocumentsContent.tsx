'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, RefreshCcw, ShieldAlert, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable, { type AdminTableColumn } from "@/components/dashboard/admin/shared/AdminResourceTable";
import AdminPaginationControls from "@/components/dashboard/admin/shared/AdminPaginationControls";
import AdminSearchInput from "@/components/dashboard/admin/shared/AdminSearchInput";
import AdminFiltersBar, { type AdminFilterTag } from "@/components/dashboard/admin/shared/AdminFiltersBar";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import { showToast } from "@/core/toast/toast";
import { deleteDocument, getDocuments, signDocument, type IDocument } from "@/utils/service/api/documents";

const PAGE_SIZE = 10;

type SignedFilter = "all" | "signed" | "pending";

const DIGIT_MAP: Record<string, string> = {
  "۰": "0",
  "۱": "1",
  "۲": "2",
  "۳": "3",
  "۴": "4",
  "۵": "5",
  "۶": "6",
  "۷": "7",
  "۸": "8",
  "۹": "9",
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
};

const toEnglishDigits = (value: string) =>
  value.replace(/[۰-۹٠-٩]/g, (char) => DIGIT_MAP[char] ?? char);


const AdminDocumentsContent = () => {
  const { formatNumber, formatDateTime } = useAdminFormatters();
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [signedFilter, setSignedFilter] = useState<SignedFilter>("all");
  const [typeDraft, setTypeDraft] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<IDocument | null>(null);
  const [actionMode, setActionMode] = useState<"sign" | "delete" | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleFetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await getDocuments({
        page,
        limit: PAGE_SIZE,
        sort: "createdAt",
        order: "DESC",
        documentType: typeFilter.trim() ? typeFilter.trim() : undefined,
        signed:
          signedFilter === "all"
            ? undefined
            : signedFilter === "signed",
      });
      setDocuments(payload.documents);
    } catch (err) {
      console.error("Failed to fetch admin documents", err);
      setDocuments([]);
      setHasNextPage(false);
      setError("دریافت اطلاعات مدارک با خطا مواجه شد.");
    } finally {
      setIsLoading(false);
    }
  }, [page, typeFilter, signedFilter]);

  useEffect(() => {
    handleFetchDocuments();
  }, [handleFetchDocuments]);

  const filteredDocuments = useMemo(() => {
    if (!searchValue.trim()) {
      return documents;
    }
    const query = searchValue.trim().toLowerCase();
    const digitsQuery = toEnglishDigits(query);
    return documents.filter((item) => {
      const matchesId = String(item.id).includes(digitsQuery);
      const matchesHouse = item.houseId ? String(item.houseId).includes(digitsQuery) : false;
      const matchesUser = item.userId ? String(item.userId).includes(digitsQuery) : false;
      const matchesType = item.documentType?.toLowerCase().includes(query) ?? false;
      return matchesId || matchesHouse || matchesUser || matchesType;
    });
  }, [documents, searchValue]);

  const handleApplyFilters = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setTypeFilter(typeDraft.trim());
    setSearchValue(searchDraft.trim());
    setPage(1);
  };

  const handleResetFilters = () => {
    setTypeDraft("");
    setTypeFilter("");
    setSignedFilter("all");
    setSearchDraft("");
    setSearchValue("");
    setPage(1);
  };

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
  }, [typeFilter, searchValue]);

  const handleOpenActionDialog = (document: IDocument, mode: "sign" | "delete") => {
    setSelectedDocument(document);
    setActionMode(mode);
  };

  const closeDialogs = () => {
    setSelectedDocument(null);
    setActionMode(null);
    setIsActionLoading(false);
  };

  const handleSignDocument = async () => {
    if (!selectedDocument) return;
    setIsActionLoading(true);
    try {
      await signDocument(selectedDocument.id);
      showToast("success", "مدرک با موفقیت تایید شد.");
      closeDialogs();
      await handleFetchDocuments();
    } catch (err) {
      console.error("Failed to sign document", err);
      showToast("error", "تایید مدرک با خطا مواجه شد.");
      setIsActionLoading(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!selectedDocument) return;
    setIsActionLoading(true);
    try {
      await deleteDocument(selectedDocument.id);
      showToast("success", "مدرک با موفقیت حذف شد.");
      const shouldGoPrevPage = documents.length === 1 && page > 1 && !hasNextPage;
      closeDialogs();
      if (shouldGoPrevPage) {
        setPage((prev) => Math.max(prev - 1, 1));
      } else {
        await handleFetchDocuments();
      }
    } catch (err) {
      console.error("Failed to delete document", err);
      showToast("error", "حذف مدرک با خطا مواجه شد.");
      setIsActionLoading(false);
    }
  };

  const columns = useMemo<AdminTableColumn<IDocument>[]>(() => [
    {
      key: "id",
      header: "شناسه",
      className: "whitespace-nowrap",
      cell: (item) => `#${formatNumber(item.id)}`,
    },
    {
      key: "documentType",
      header: "نوع سند",
      className: "whitespace-nowrap",
      cell: (item) => item.documentType ?? "—",
    },
    {
      key: "houseId",
      header: "شناسه ملک",
      className: "whitespace-nowrap",
      cell: (item) => (item.houseId ? formatNumber(item.houseId) : "—"),
    },
    {
      key: "createdAt",
      header: "تاریخ ثبت",
      className: "whitespace-nowrap",
      cell: (item) => formatDateTime(item.createdAt),
    },
    {
      key: "actions",
      header: "عملیات",
      className: "w-[240px]",
      cell: (item) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            asChild
          >
            <a href={item.filePath} target="_blank" rel="noopener noreferrer">
              مشاهده فایل
            </a>
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="gap-2"
            onClick={() => handleOpenActionDialog(item, "delete")}
          >
            <Trash2 className="size-4" />
            حذف
          </Button>
        </div>
      ),
    },
  ], [formatNumber, formatDateTime]);

  const summaryLabel =
    filteredDocuments.length > 0
      ? `نمایش ${formatNumber(filteredDocuments.length)} مدرک در صفحه ${formatNumber(page)}`
      : "مدرکی برای نمایش وجود ندارد.";

  const dialogTitle = actionMode === "sign" ? "تایید مدرک" : "حذف مدرک";
  const dialogDescription =
    actionMode === "sign"
      ? selectedDocument
        ? `آیا از تایید مدرک شماره ${formatNumber(selectedDocument.id)} مطمئن هستید؟`
        : "این عملیات قابل بازگشت نیست."
      : selectedDocument
        ? `آیا از حذف مدرک شماره ${formatNumber(selectedDocument.id)} مطمئن هستید؟`
        : "این عملیات قابل بازگشت نیست.";

  return (
    <div className="space-y-6" dir="rtl">
      <AdminPageHeader
        title="مدارک و مستندات"
        description="نظارت بر وضعیت اسناد کاربران، تایید مدارک و مدیریت بارگذاری‌ها."
        actions={
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => handleFetchDocuments()}
            disabled={isLoading}
          >
            <RefreshCcw className="size-4" />
            {isLoading ? "در حال بروزرسانی..." : "بروزرسانی لیست"}
          </Button>
        }
        hint="مدارک جدید در انتظار تایید را روزانه بررسی کنید."
      />

      <Card className="border-border/70">
        <CardHeader className="space-y-4 pb-4 text-right">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold">جستجوی مدارک</CardTitle>
            </div>
          </div>
          <form className="space-y-3" onSubmit={handleApplyFilters}>
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
            data={filteredDocuments}
            isLoading={isLoading}
            errorMessage={error}
            emptyMessage="مدرکی با این مشخصات یافت نشد."
            getKey={(item) => `document-${item.id}`}
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

      <Card className="border-dashed border-border/60 bg-subBg/40 text-right dark:bg-muted/10">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">راهنمای کنترل مدارک</CardTitle>
            <p className="text-sm text-muted-foreground">
              فقط مدارکی را تایید کنید که از صحت اطلاعات کاربر یا ملک اطمینان دارید. در صورت وجود تناقض، وضعیت را بازبینی کنید.
            </p>
          </div>
        </CardHeader>
      </Card>

      <Dialog open={Boolean(actionMode)} onOpenChange={(open) => (!open ? closeDialogs() : null)}>
        <DialogContent className="text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          {actionMode === "sign" ? (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="size-4" />
              تایید مدرک باعث دسترسی کامل کاربر به امکانات مربوطه خواهد شد.
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-300">
              <ShieldAlert className="size-4" />
              حذف مدرک غیرقابل بازگشت است. در صورت نیاز کاربر باید دوباره مدرک را بارگذاری کند.
            </div>
          )}
          <DialogFooter className="gap-2 sm:flex-row-reverse sm:space-x-reverse sm:space-x-2">
            <Button type="button" variant="outline" onClick={closeDialogs} disabled={isActionLoading}>
              انصراف
            </Button>
            {actionMode === "sign" ? (
              <Button onClick={handleSignDocument} disabled={isActionLoading}>
                {isActionLoading ? "در حال تایید..." : "تایید مدرک"}
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleDeleteDocument} disabled={isActionLoading}>
                {isActionLoading ? "در حال حذف..." : "حذف مدرک"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDocumentsContent;


