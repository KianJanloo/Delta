"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable from "@/components/dashboard/admin/shared/AdminResourceTable";
import AdminPaginationControls from "@/components/dashboard/admin/shared/AdminPaginationControls";
import { normalizeList } from "@/components/dashboard/admin/shared/normalize";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import { showToast } from "@/core/toast/toast";
import { getallLocations } from "@/utils/service/api/locations/getAllLocations";
import { createLocation } from "@/utils/service/api/locations/createLocation";
import { editLocation } from "@/utils/service/api/locations/editLocation";
import { removeLocation } from "@/utils/service/api/locations/removeLocation";
import type { ICreateLocation, ILocation } from "@/types/locations-type/locations-type";
import AdminLocationsFilters from "./AdminLocationsFilters";
import { useLocationsTableColumns } from "./AdminLocationsTableColumns";
import AdminLocationsFormDialog from "./AdminLocationsFormDialog";
import AdminLocationsDeleteDialog from "./AdminLocationsDeleteDialog";

type DialogMode = "create" | "edit" | "delete" | null;

export type LocationItem = ILocation & {
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

  const columns = useLocationsTableColumns({
    onEdit: (item) => openDialog("edit", item),
    onDelete: (item) => openDialog("delete", item),
  });

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

      <AdminLocationsFilters
        areaFilterDraft={areaFilterDraft}
        setAreaFilterDraft={setAreaFilterDraft}
        areaFilter={areaFilter}
        setAreaFilter={setAreaFilter}
        setPage={setPage}
        onApplyFilters={handleApplyFilters}
      />

      <Card className="border-border/70">
        <CardContent className="space-y-4 text-right pt-6">
          <AdminResourceTable
            columns={columns}
            data={filteredLocations}
            isLoading={isLoading}
            errorMessage={error}
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

      <AdminLocationsFormDialog
        open={isFormDialogOpen}
        onOpenChange={(open) => (!open ? closeDialog() : null)}
        mode={dialogMode === "edit" ? "edit" : "create"}
        nameDraft={nameDraft}
        setNameDraft={setNameDraft}
        latDraft={latDraft}
        setLatDraft={setLatDraft}
        lngDraft={lngDraft}
        setLngDraft={setLngDraft}
        isActionLoading={isActionLoading}
        onSubmit={handleSubmitLocation}
      />

      <AdminLocationsDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => (!open ? closeDialog() : null)}
        selectedLocation={selectedLocation}
        isActionLoading={isActionLoading}
        onDelete={handleDeleteLocation}
      />
    </div>
  );
};

export default AdminLocationsContent;
