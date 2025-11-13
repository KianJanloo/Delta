'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarClock, Home, Pencil, Plus, RefreshCcw, TicketPercent, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable, { type AdminTableColumn } from "@/components/dashboard/admin/shared/AdminResourceTable";
import AdminFiltersBar, { type AdminFilterTag } from "@/components/dashboard/admin/shared/AdminFiltersBar";
import AdminSearchInput from "@/components/dashboard/admin/shared/AdminSearchInput";
import AdminPaginationControls from "@/components/dashboard/admin/shared/AdminPaginationControls";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import { showToast } from "@/core/toast/toast";
import { getDiscountCodes } from "@/utils/service/api/discount-codes/getDiscountCodes";
import { createDiscountCode, type CreateDiscountCodePayload, type IDiscountCode } from "@/utils/service/api/discount-codes/createDiscountCode";
import { updateDiscountCode, type UpdateDiscountCodePayload } from "@/utils/service/api/discount-codes/updateDiscountCode";
import { deleteDiscountCode } from "@/utils/service/api/discount-codes/deleteDiscountCode";
import { getAdminHouses, type AdminHouse } from "@/utils/service/api/admin/houses";

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

  const activeFilterTags = useMemo<AdminFilterTag[]>(() => {
    const tags: AdminFilterTag[] = [];
    if (searchValue.trim()) {
      tags.push({
        key: "search",
        label: "کد تخفیف",
        value: searchValue.trim(),
        onRemove: () => {
          setSearchValue("");
          setSearchDraft("");
          setPage(1);
        },
      });
    }
    return tags;
  }, [searchValue]);

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

  const columns = useMemo<AdminTableColumn<IDiscountCode>[]>(() => [
    {
      key: "code",
      header: "کد",
      className: "w-36 whitespace-nowrap font-semibold text-foreground",
      cell: (item) => item.code,
    },
    {
      key: "house",
      header: "اقامتگاه",
      className: "w-60 whitespace-nowrap text-muted-foreground",
      cell: (item) => {
        const houseId = item.house_id ?? null;
        const houseTitle = houseId ? houseLookup[houseId] : undefined;
        if (!houseId) {
          return "ثبت نشده";
        }
        return (
          <span className="inline-flex items-center gap-2">
            <Home className="size-4 text-muted-foreground" />
            <span className="flex flex-col leading-tight">
              <span className="font-medium text-foreground">{houseTitle ?? `شناسه ${houseId}`}</span>
              <span className="text-xs text-muted-foreground">ID: {houseId}</span>
            </span>
          </span>
        );
      },
    },
    {
      key: "discount_percentage",
      header: "درصد تخفیف",
      className: "w-32 whitespace-nowrap text-muted-foreground",
      cell: (item) => `${formatDecimal(item.discount_percentage)}٪`,
    },
    {
      key: "valid_until",
      header: "انقضا",
      className: "w-48 whitespace-nowrap text-muted-foreground",
      cell: (item) => {
        const validUntil = item.valid_until ?? item.expiresAt ?? null;
        if (!validUntil) {
          return "بدون محدودیت";
        }
        const isExpired = new Date(validUntil) < new Date();
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${
              isExpired
                ? "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-300"
                : "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
            }`}
          >
            <CalendarClock className="size-3.5" />
            {formatDateTime(validUntil)}
          </span>
        );
      },
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
  ], [formatDateTime, formatDecimal, houseLookup, openDialog]);

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

      <Card className="border-border/70">
        <CardHeader className="space-y-4 text-right">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-semibold">جستجو و مرتب‌سازی</CardTitle>
              <p className="text-sm text-muted-foreground">
                کدهای تخفیف را بر اساس کد، تاریخ ایجاد یا میزان تخفیف مدیریت کنید.
              </p>
            </div>
          </div>

          <form className="space-y-3" onSubmit={handleApplyFilters}>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <AdminSearchInput
                placeholder="جستجو بر اساس کد تخفیف"
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                onClear={() => {
                  setSearchDraft("");
                  setSearchValue("");
                  setPage(1);
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

      <Card className="border-dashed border-border/60 bg-subBg/40 text-right dark:bg-muted/10">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <TicketPercent className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">راهنمای استفاده</CardTitle>
              <p className="text-sm text-muted-foreground">
                برای جلوگیری از سوءاستفاده، کدهای تاریخ گذشته را حذف و ظرفیت مصرف‌شده را به‌صورت دوره‌ای بررسی کنید.
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Dialog open={isFormDialogOpen} onOpenChange={(open) => (!open ? closeDialog() : null)}>
        <DialogContent className="max-w-lg text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>{dialogMode === "edit" ? "ویرایش کد تخفیف" : "کد تخفیف جدید"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "edit"
                ? "مشخصات کد تخفیف را بروزرسانی کنید. تغییرات فوراً اعمال خواهند شد."
                : "برای ایجاد کد تخفیف جدید، کد، درصد تخفیف و در صورت نیاز تاریخ انقضا یا محدودیت استفاده را مشخص کنید."}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmitDiscountCode}>
            <div className="space-y-2">
              <Label htmlFor="discount-code">کد تخفیف</Label>
              <Input
                className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl"
                id="discount-code"
                placeholder="مثلاً: DELTA25"
                value={codeDraft}
                onChange={(event) => setCodeDraft(event.target.value.toUpperCase())}
                disabled={isActionLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount-house">اقامتگاه مرتبط</Label>
              {houses.length > 0 ? (
                <Select
                  value={houseDraft || undefined}
                  onValueChange={setHouseDraft}
                  disabled={isActionLoading || isHousesLoading}
                >
                  <SelectTrigger className="border-border bg-subBg px-4 py-2 text-right">
                    <SelectValue
                      placeholder={
                        isHousesLoading
                          ? "در حال بارگذاری..."
                          : "اقامتگاه مورد نظر را انتخاب کنید"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-72" position="popper" sideOffset={8}>
                    {houses.map((house) => (
                      <SelectItem key={house.id} value={house.id.toString()}>
                        <div className="flex flex-col text-right">
                          <span className="font-medium">{house.title ?? `شناسه ${house.id}`}</span>
                          <span className="text-xs text-muted-foreground">ID: {house.id}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="rounded-xl border border-dashed border-border/60 bg-subBg px-3 py-2 text-sm text-muted-foreground">
                  {isHousesLoading
                    ? "در حال بارگذاری فهرست اقامتگاه‌ها..."
                    : "هیچ اقامتگاهی برای انتخاب یافت نشد. می‌توانید شناسه را به صورت دستی وارد کنید."}
                </div>
              )}
              <Input
                className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl remove-number-spin"
                id="discount-house"
                type="number"
                min="1"
                placeholder="شناسه اقامتگاه را وارد کنید"
                value={houseDraft}
                onChange={(event) => setHouseDraft(event.target.value)}
                disabled={isActionLoading}
                autoComplete="off"
                required
              />
              <p className="text-xs text-muted-foreground">
                برای انتخاب سریع یکی از اقامتگاه‌های ثبت‌شده، از فهرست بالا استفاده کنید.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="discount-percentage">درصد تخفیف</Label>
                <Input
                  className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl remove-number-spin"
                  id="discount-percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  placeholder="مثلاً: 15"
                  value={percentageDraft}
                  onChange={(event) => setPercentageDraft(event.target.value)}
                  disabled={isActionLoading}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount-expiration">تاریخ انقضا (اختیاری)</Label>
                <Input
                  className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl"
                  id="discount-expiration"
                  type="date"
                  value={expirationDraft}
                  onChange={(event) => setExpirationDraft(event.target.value)}
                  disabled={isActionLoading}
                />
              </div>
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
            <DialogTitle>حذف کد تخفیف</DialogTitle>
            <DialogDescription>
              {selectedCode
                ? `آیا از حذف کد تخفیف «${selectedCode.code}» مطمئن هستید؟`
                : "آیا از حذف این کد تخفیف مطمئن هستید؟"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:flex-row-reverse">
            <Button
              variant="destructive"
              onClick={handleDeleteDiscountCode}
              disabled={isActionLoading}
            >
              {isActionLoading ? "در حال حذف..." : "حذف کد"}
            </Button>
            <Button type="button" variant="outline" onClick={closeDialog} disabled={isActionLoading}>
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom style for removing number input spinners */}
      <style jsx global>{`
        /* Chrome, Safari, Edge, Opera */
        .remove-number-spin::-webkit-inner-spin-button,
        .remove-number-spin::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        /* Firefox */
        .remove-number-spin[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default AdminDiscountCodesContent;


