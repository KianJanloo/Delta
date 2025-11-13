'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { MapPin, Pencil, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable, { type AdminTableColumn } from "@/components/dashboard/admin/shared/AdminResourceTable";
import AdminSearchInput from "@/components/dashboard/admin/shared/AdminSearchInput";
import AdminFiltersBar, { type AdminFilterTag } from "@/components/dashboard/admin/shared/AdminFiltersBar";
import AdminPaginationControls from "@/components/dashboard/admin/shared/AdminPaginationControls";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import { normalizeList } from "@/components/dashboard/admin/shared/normalize";
import { showToast } from "@/core/toast/toast";
import { getallLocations } from "@/utils/service/api/locations/getAllLocations";
import { createLocation } from "@/utils/service/api/locations/createLocation";
import { editLocation } from "@/utils/service/api/locations/editLocation";
import { removeLocation } from "@/utils/service/api/locations/removeLocation";
import type { ICreateLocation, ILocation } from "@/types/locations-type/locations-type";

type DialogMode = "create" | "edit" | "delete" | null;

type LocationItem = ILocation & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

const PAGE_SIZE = 10;

const AdminLocationsContent = () => {
  const { formatNumber } = useAdminFormatters();
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [areaFilterDraft, setAreaFilterDraft] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [latDraft, setLatDraft] = useState("");
  const [lngDraft, setLngDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchLocations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await getallLocations(
        page,
        PAGE_SIZE,
        areaFilter.trim() ? areaFilter.trim() : "",
      );
      const list = normalizeList<LocationItem>(payload);
      setLocations(list);
      const rawTotal =
        payload && typeof payload === "object" && "totalCount" in payload
          ? Number((payload as { totalCount?: number }).totalCount)
          : null;
      if (rawTotal !== null && Number.isFinite(rawTotal)) {
        setTotalCount(rawTotal);
        setHasNextPage(page * PAGE_SIZE < rawTotal);
      } else {
        setTotalCount(null);
        setHasNextPage(list.length === PAGE_SIZE);
      }
    } catch (err) {
      console.error("Failed to fetch locations", err);
      setLocations([]);
      setHasNextPage(false);
      setError("بارگذاری موقعیت‌ها با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  }, [page, areaFilter]);

  useEffect(() => {
    handleFetchLocations();
  }, [handleFetchLocations]);

  const filteredLocations = useMemo(() => {
    if (!areaFilter.trim()) {
      return locations;
    }
    const query = areaFilter.trim().toLowerCase();
    return locations.filter((location) => {
      const nameMatch = location.area_name?.toLowerCase().includes(query) ?? false;
      const idMatch = location.id?.toLowerCase?.().includes(query) ?? false;
      const latMatch = location.lat?.toString().toLowerCase().includes(query) ?? false;
      const lngMatch = location.lng?.toString().toLowerCase().includes(query) ?? false;
      return nameMatch || idMatch || latMatch || lngMatch;
    });
  }, [areaFilter, locations]);

  const activeFilterTags = useMemo<AdminFilterTag[]>(() => {
    const tags: AdminFilterTag[] = [];
    if (areaFilter.trim()) {
      tags.push({
        key: "area",
        label: "منطقه",
        value: areaFilter.trim(),
        onRemove: () => {
          setAreaFilter("");
          setAreaFilterDraft("");
          setPage(1);
        },
      });
    }
    return tags;
  }, [areaFilter]);

  const openDialog = useCallback(
    (mode: Exclude<DialogMode, null>, location?: LocationItem) => {
      setDialogMode(mode);
      if (location) {
        setSelectedLocation(location);
        setNameDraft(location.area_name ?? "");
        setLatDraft(location.lat ? String(location.lat) : "");
        setLngDraft(location.lng ? String(location.lng) : "");
      } else {
        setSelectedLocation(null);
        setNameDraft("");
        setLatDraft("");
        setLngDraft("");
      }
    },
    [],
  );

  const closeDialog = useCallback(() => {
    setDialogMode(null);
    setSelectedLocation(null);
    setNameDraft("");
    setLatDraft("");
    setLngDraft("");
    setIsActionLoading(false);
  }, []);

  const handleApplyFilters = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setAreaFilter(areaFilterDraft.trim());
    setPage(1);
  };

  const handleSubmitLocation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = nameDraft.trim();
    const trimmedLat = latDraft.trim();
    const trimmedLng = lngDraft.trim();

    if (!trimmedName) {
      showToast("error", "لطفاً نام منطقه را وارد کنید.");
      return;
    }
    if (!trimmedLat || Number.isNaN(Number(trimmedLat))) {
      showToast("error", "مختصات عرض جغرافیایی نامعتبر است.");
      return;
    }
    if (!trimmedLng || Number.isNaN(Number(trimmedLng))) {
      showToast("error", "مختصات طول جغرافیایی نامعتبر است.");
      return;
    }

    const payload: ICreateLocation = {
      area_name: trimmedName,
      lat: Number(trimmedLat),
      lng: Number(trimmedLng),
    };

    setIsActionLoading(true);
    try {
      if (dialogMode === "create") {
        await createLocation(payload);
        showToast("success", "موقعیت جدید با موفقیت ایجاد شد.");
      } else if (dialogMode === "edit" && selectedLocation) {
        await editLocation(payload, selectedLocation.id);
        showToast("success", "موقعیت با موفقیت بروزرسانی شد.");
      }
      closeDialog();
      await handleFetchLocations();
    } catch (err) {
      console.error("Failed to submit location", err);
      showToast("error", "عملیات ذخیره موقعیت با خطا مواجه شد.");
      setIsActionLoading(false);
    }
  };

  const handleDeleteLocation = async () => {
    if (!selectedLocation) return;
    setIsActionLoading(true);
    try {
      await removeLocation(selectedLocation.id);
      showToast("success", "موقعیت با موفقیت حذف شد.");
      const shouldGoPrevPage = locations.length === 1 && page > 1 && !hasNextPage;
      closeDialog();
      if (shouldGoPrevPage) {
        setPage((prev) => Math.max(prev - 1, 1));
      } else {
        await handleFetchLocations();
      }
    } catch (err) {
      console.error("Failed to delete location", err);
      showToast("error", "حذف موقعیت با خطا مواجه شد.");
      setIsActionLoading(false);
    }
  };

  const columns = useMemo<AdminTableColumn<LocationItem>[]>(() => [
    {
      key: "id",
      header: "شناسه",
      className: "w-24 whitespace-nowrap",
      cell: (item) => `#${item.id}`,
    },
    {
      key: "area_name",
      header: "نام منطقه",
      className: "w-64 whitespace-nowrap font-medium text-foreground",
      cell: (item) => item.area_name ?? "—",
    },
    {
      key: "lat",
      header: "عرض جغرافیایی",
      className: "w-40 whitespace-nowrap text-muted-foreground",
      cell: (item) => item.lat ?? "—",
    },
    {
      key: "lng",
      header: "طول جغرافیایی",
      className: "w-40 whitespace-nowrap text-muted-foreground",
      cell: (item) => item.lng ?? "—",
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
  ], [openDialog]);

  const totalPages =
    totalCount !== null ? Math.max(Math.ceil(totalCount / PAGE_SIZE), 1) : null;

  const summaryLabel =
    totalPages !== null
      ? `صفحه ${formatNumber(page)} از ${formatNumber(totalPages)} • مجموع ${formatNumber(totalCount ?? 0)} موقعیت`
      : `نمایش ${formatNumber(filteredLocations.length)} موقعیت در صفحه ${formatNumber(page)}`;

  const isFormDialogOpen = dialogMode === "create" || dialogMode === "edit";
  const isDeleteDialogOpen = dialogMode === "delete";

  return (
    <div className="space-y-6" dir="rtl">
      <AdminPageHeader
        title="مدیریت موقعیت‌ها"
        description="موقعیت‌های جغرافیایی سیستم را بررسی، اضافه و بروزرسانی کنید."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => handleFetchLocations()}
              disabled={isLoading}
            >
              <RefreshCcw className="size-4" />
              {isLoading ? "در حال بروزرسانی..." : "بروزرسانی"}
            </Button>
            <Button className="gap-2" onClick={() => openDialog("create")}>
              <Plus className="size-4" />
              موقعیت جدید
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
              <CardTitle className="text-base font-semibold">فیلتر و مرتب‌سازی</CardTitle>
              <p className="text-sm text-muted-foreground">
                نتایج را بر اساس نام منطقه فیلتر کرده و ترتیب نمایش را مدیریت کنید.
              </p>
            </div>
          </div>

          <form className="space-y-3" onSubmit={handleApplyFilters}>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <AdminSearchInput
                placeholder="جستجو بر اساس نام منطقه یا شناسه"
                value={areaFilterDraft}
                onChange={(event) => setAreaFilterDraft(event.target.value)}
                onClear={() => {
                  setAreaFilterDraft("");
                  setAreaFilter("");
                  setPage(1);
                }}
              />
            </div>

            
          </form>

          <AdminFiltersBar tags={activeFilterTags} />
        </CardHeader>

        <CardContent className="space-y-4 text-right">
          <AdminResourceTable
            columns={columns}
            data={filteredLocations}
            isLoading={isLoading}
            emptyMessage="موقعیتی با این مشخصات یافت نشد."
            getKey={(item) => `location-${item.id}`}
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
              <MapPin className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">راهنمای دقت مختصات</CardTitle>
              <p className="text-sm text-muted-foreground">
                مختصات را بر حسب درجه اعشاری و با دقت حداقل چهار رقم اعشار وارد کنید تا جستجو و نمایش در نقشه دقیق باشد.
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Dialog open={isFormDialogOpen} onOpenChange={(open) => (!open ? closeDialog() : null)}>
        <DialogContent className="max-w-lg text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>{dialogMode === "edit" ? "ویرایش موقعیت" : "موقعیت جدید"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "edit"
                ? "اطلاعات موقعیت را بروزرسانی کنید. مختصات صحیح را با دقت وارد کنید."
                : "برای افزودن موقعیت جدید، نام منطقه و مختصات جغرافیایی را وارد کنید."}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmitLocation}>
            <div className="space-y-2">
              <Label htmlFor="location-name">نام منطقه</Label>
              <Input
                className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl remove-number-spin"
                id="location-name"
                placeholder="مثلاً: نیاوران"
                value={nameDraft}
                onChange={(event) => setNameDraft(event.target.value)}
                disabled={isActionLoading}
                required
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="space-y-2">
                <Label htmlFor="location-lat">عرض جغرافیایی (Latitude)</Label>
                <Input
                  className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl remove-number-spin"
                  id="location-lat"
                  type="number"
                  step="0.0001"
                  placeholder="مثلاً: 35.7476"
                  value={latDraft}
                  onChange={(event) => setLatDraft(event.target.value)}
                  disabled={isActionLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location-lng">طول جغرافیایی (Longitude)</Label>
                <Input
                  className="border w-full outline-none border-border bg-subBg px-4 py-2 placeholder:text-muted-foreground rounded-2xl remove-number-spin"
                  id="location-lng"
                  type="number"
                  step="0.0001"
                  placeholder="مثلاً: 51.4244"
                  value={lngDraft}
                  onChange={(event) => setLngDraft(event.target.value)}
                  disabled={isActionLoading}
                  required
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
            <DialogTitle>حذف موقعیت</DialogTitle>
            <DialogDescription>
              {selectedLocation
                ? `آیا از حذف موقعیت «${selectedLocation.area_name}» مطمئن هستید؟ این عملیات قابل بازگشت نیست.`
                : "آیا از حذف این موقعیت مطمئن هستید؟"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:flex-row-reverse">
            <Button
              variant="destructive"
              onClick={handleDeleteLocation}
              disabled={isActionLoading}
            >
              {isActionLoading ? "در حال حذف..." : "حذف موقعیت"}
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

export default AdminLocationsContent;


