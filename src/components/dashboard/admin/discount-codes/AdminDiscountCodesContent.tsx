"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable from "@/components/dashboard/admin/shared/AdminResourceTable";
import AdminPaginationControls from "@/components/dashboard/admin/shared/AdminPaginationControls";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import { showToast } from "@/core/toast/toast";
import { getDiscountCodes } from "@/utils/service/api/discount-codes/getDiscountCodes";
import { createDiscountCode, type CreateDiscountCodePayload, type IDiscountCode } from "@/utils/service/api/discount-codes/createDiscountCode";
import { updateDiscountCode, type UpdateDiscountCodePayload } from "@/utils/service/api/discount-codes/updateDiscountCode";
import { deleteDiscountCode } from "@/utils/service/api/discount-codes/deleteDiscountCode";
import { getAdminHouses, type AdminHouse } from "@/utils/service/api/admin/houses";
import AdminDiscountCodesFilters from "./AdminDiscountCodesFilters";
import { useDiscountCodesTableColumns } from "./AdminDiscountCodesTableColumns";
import AdminDiscountCodesFormDialog from "./AdminDiscountCodesFormDialog";
import AdminDiscountCodesDeleteDialog from "./AdminDiscountCodesDeleteDialog";

type DialogMode = "create" | "edit" | "delete" | null;

const PAGE_SIZE = 10;

const AdminDiscountCodesContent = () => {
  const { formatDateTime, formatNumber, formatDecimal } = useAdminFormatters();
  const [discountCodes, setDiscountCodes] = useState<IDiscountCode[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchDraft, setSearchDraft] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedCode, setSelectedCode] = useState<IDiscountCode | null>(null);
  const [codeDraft, setCodeDraft] = useState("");
  const [percentageDraft, setPercentageDraft] = useState("");
  const [expirationDraft, setExpirationDraft] = useState("");
  const [houseDraft, setHouseDraft] = useState("");
  const [houses, setHouses] = useState<AdminHouse[]>([]);
  const [isHousesLoading, setIsHousesLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHouses = async () => {
      setIsHousesLoading(true);
      try {
        const response = await getAdminHouses({ limit: 200, order: "DESC" });
        const normalizedHouses = Array.isArray(response)
          ? response
          : Array.isArray((response as { data?: AdminHouse[] } | undefined)?.data)
            ? ((response as { data: AdminHouse[] }).data)
            : [];
        setHouses(normalizedHouses);
      } catch (err) {
        console.error("Failed to fetch houses for discount codes", err);
        setHouses([]);
      } finally {
        setIsHousesLoading(false);
      }
    };

    void fetchHouses();
  }, []);

  const handleFetchDiscountCodes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await getDiscountCodes({
        page,
        limit: PAGE_SIZE,
        ...(searchValue.trim() ? { code: searchValue.trim() } : {}),
      });
      setDiscountCodes(payload);
      setHasNextPage(payload.length === PAGE_SIZE);
    } catch (err) {
      console.error("Failed to fetch discount codes", err);
      setDiscountCodes([]);
      setHasNextPage(false);
      setError("بارگذاری کدهای تخفیف با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchValue]);

  useEffect(() => {
    handleFetchDiscountCodes();
  }, [handleFetchDiscountCodes]);

  const filteredDiscountCodes = useMemo(() => {
    if (!searchValue.trim()) {
      return discountCodes;
    }
    const query = searchValue.trim().toLowerCase();
    return discountCodes.filter((item) => item.code.toLowerCase().includes(query));
  }, [discountCodes, searchValue]);

  const openDialog = useCallback(
    (mode: Exclude<DialogMode, null>, discountCode?: IDiscountCode) => {
      setDialogMode(mode);
      if (discountCode) {
        setSelectedCode(discountCode);
        setCodeDraft(discountCode.code);
        setPercentageDraft(discountCode.discount_percentage.toString());
        setExpirationDraft(
          (discountCode.valid_until ?? discountCode.expiresAt ?? "").slice(0, 10),
        );
        setHouseDraft(
          typeof discountCode.house_id === "number"
            ? discountCode.house_id.toString()
            : "",
        );
      } else {
        setSelectedCode(null);
        setCodeDraft("");
        setPercentageDraft("");
        setExpirationDraft("");
        setHouseDraft("");
      }
    },
    [],
  );

  const closeDialog = useCallback(() => {
    setDialogMode(null);
    setSelectedCode(null);
    setCodeDraft("");
    setPercentageDraft("");
    setExpirationDraft("");
    setHouseDraft("");
    setIsActionLoading(false);
  }, []);

  const handleApplyFilters = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setSearchValue(searchDraft.trim());
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchDraft("");
    setSearchValue("");
    setPage(1);
  };

  const handleSubmitDiscountCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedCode = codeDraft.trim();
    const trimmedPercentage = percentageDraft.trim();
    const trimmedHouseId = houseDraft.trim();

    if (!trimmedCode) {
      showToast("error", "لطفاً کد تخفیف را وارد کنید.");
      return;
    }
    if (!trimmedPercentage || Number.isNaN(Number(trimmedPercentage))) {
      showToast("error", "درصد تخفیف نامعتبر است.");
      return;
    }
    const parsedPercentage = Number(trimmedPercentage);
    if (parsedPercentage < 0 || parsedPercentage > 100) {
      showToast("error", "درصد تخفیف باید بین ۰ تا ۱۰۰ باشد.");
      return;
    }
    if (!trimmedHouseId || Number.isNaN(Number(trimmedHouseId))) {
      showToast("error", "شناسه اقامتگاه نامعتبر است.");
      return;
    }
    const parsedHouseId = Number(trimmedHouseId);
    if (!Number.isInteger(parsedHouseId) || parsedHouseId <= 0) {
      showToast("error", "شناسه اقامتگاه باید یک عدد صحیح مثبت باشد.");
      return;
    }

    const validUntilIso = expirationDraft ? new Date(expirationDraft).toISOString() : null;

    const basePayload: CreateDiscountCodePayload = {
      code: trimmedCode,
      house_id: parsedHouseId,
      discount_percentage: parsedPercentage,
      ...(validUntilIso ? { valid_until: validUntilIso } : {}),
    };

    setIsActionLoading(true);
    try {
      if (dialogMode === "create") {
        await createDiscountCode(basePayload);
        showToast("success", "کد تخفیف جدید با موفقیت ایجاد شد.");
      } else if (dialogMode === "edit" && selectedCode) {
        const updatePayload: UpdateDiscountCodePayload = {
          code: basePayload.code,
          house_id: basePayload.house_id,
          discount_percentage: basePayload.discount_percentage,
          valid_until: validUntilIso,
        };
        await updateDiscountCode(selectedCode.id, updatePayload);
        showToast("success", "کد تخفیف با موفقیت بروزرسانی شد.");
      }
      closeDialog();
      await handleFetchDiscountCodes();
    } catch (err) {
      console.error("Failed to submit discount code", err);
      showToast("error", "عملیات ذخیره کد تخفیف با خطا مواجه شد.");
      setIsActionLoading(false);
    }
  };

  const handleDeleteDiscountCode = async () => {
    if (!selectedCode) return;
    setIsActionLoading(true);
    try {
      await deleteDiscountCode(selectedCode.id);
      showToast("success", "کد تخفیف با موفقیت حذف شد.");
      const shouldGoPrevPage = discountCodes.length === 1 && page > 1 && !hasNextPage;
      closeDialog();
      if (shouldGoPrevPage) {
        setPage((prev) => Math.max(prev - 1, 1));
      } else {
        await handleFetchDiscountCodes();
      }
    } catch (err) {
      console.error("Failed to delete discount code", err);
      showToast("error", "حذف کد تخفیف با خطا مواجه شد.");
      setIsActionLoading(false);
    }
  };

  const houseLookup = useMemo(() => {
    return houses.reduce<Record<number, string>>((acc, house) => {
      acc[house.id] = house.title;
      return acc;
    }, {});
  }, [houses]);

  const columns = useDiscountCodesTableColumns({
    formatDateTime,
    formatDecimal,
    houseLookup,
    onEdit: (item) => openDialog("edit", item),
    onDelete: (item) => openDialog("delete", item),
  });

  const summaryLabel =
    filteredDiscountCodes.length > 0
      ? `نمایش ${formatNumber(filteredDiscountCodes.length)} کد تخفیف در صفحه ${formatNumber(page)}`
      : "کد تخفیفی برای نمایش وجود ندارد.";

  const isFormDialogOpen = dialogMode === "create" || dialogMode === "edit";
  const isDeleteDialogOpen = dialogMode === "delete";

  return (
    <div className="space-y-6" dir="rtl">
      <AdminPageHeader
        title="مدیریت کدهای تخفیف"
        description="کدهای تخفیف فعال را ایجاد، ویرایش و کنترل کنید."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => handleFetchDiscountCodes()}
              disabled={isLoading}
            >
              <RefreshCcw className="size-4" />
              {isLoading ? "در حال بروزرسانی..." : "بروزرسانی"}
            </Button>
            <Button className="gap-2" onClick={() => openDialog("create")}>
              <Plus className="size-4" />
              کد تخفیف جدید
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

      <AdminDiscountCodesFilters
        searchDraft={searchDraft}
        setSearchDraft={setSearchDraft}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setPage={setPage}
        isLoading={isLoading}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      <Card className="border-border/70">
        <CardContent className="space-y-4 text-right pt-6">
          <AdminResourceTable
            columns={columns}
            data={filteredDiscountCodes}
            isLoading={isLoading}
            emptyMessage="کد تخفیفی مطابق با جستجو یافت نشد."
            getKey={(item) => `discount-code-${item.id}`}
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

      <AdminDiscountCodesFormDialog
        open={isFormDialogOpen}
        onOpenChange={(open) => (!open ? closeDialog() : null)}
        mode={dialogMode === "edit" ? "edit" : "create"}
        selectedCode={selectedCode}
        codeDraft={codeDraft}
        setCodeDraft={setCodeDraft}
        percentageDraft={percentageDraft}
        setPercentageDraft={setPercentageDraft}
        expirationDraft={expirationDraft}
        setExpirationDraft={setExpirationDraft}
        houseDraft={houseDraft}
        setHouseDraft={setHouseDraft}
        houses={houses}
        isHousesLoading={isHousesLoading}
        isActionLoading={isActionLoading}
        onSubmit={handleSubmitDiscountCode}
      />

      <AdminDiscountCodesDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => (!open ? closeDialog() : null)}
        selectedCode={selectedCode}
        isActionLoading={isActionLoading}
        onDelete={handleDeleteDiscountCode}
      />

      <style jsx global>{`
        .remove-number-spin::-webkit-inner-spin-button,
        .remove-number-spin::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .remove-number-spin[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default AdminDiscountCodesContent;
