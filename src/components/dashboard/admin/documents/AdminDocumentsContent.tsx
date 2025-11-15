"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable from "@/components/dashboard/admin/shared/AdminResourceTable";
import AdminPaginationControls from "@/components/dashboard/admin/shared/AdminPaginationControls";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import { showToast } from "@/core/toast/toast";
import { deleteDocument, getDocuments, signDocument, type IDocument } from "@/utils/service/api/documents";
import AdminDocumentsFilters from "./AdminDocumentsFilters";
import { useDocumentsTableColumns } from "./AdminDocumentsTableColumns";
import AdminDocumentsActionDialog from "./AdminDocumentsActionDialog";

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

  const columns = useDocumentsTableColumns({
    formatDateTime,
    formatNumber,
    onDelete: (item) => handleOpenActionDialog(item, "delete"),
  });

  const summaryLabel =
    filteredDocuments.length > 0
      ? `نمایش ${formatNumber(filteredDocuments.length)} مدرک در صفحه ${formatNumber(page)}`
      : "مدرکی برای نمایش وجود ندارد.";

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

      <AdminDocumentsFilters
        searchDraft={searchDraft}
        setSearchDraft={setSearchDraft}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        typeDraft={typeDraft}
        setTypeDraft={setTypeDraft}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        signedFilter={signedFilter}
        setSignedFilter={setSignedFilter}
        setPage={setPage}
        isLoading={isLoading}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      <Card className="border-border/70">
        <CardContent className="space-y-4 text-right pt-6">
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

      <AdminDocumentsActionDialog
        open={Boolean(actionMode)}
        onOpenChange={(open) => (!open ? closeDialogs() : null)}
        actionMode={actionMode}
        selectedDocument={selectedDocument}
        isActionLoading={isActionLoading}
        formatNumber={formatNumber}
        onSign={handleSignDocument}
        onDelete={handleDeleteDocument}
      />
    </div>
  );
};

export default AdminDocumentsContent;
