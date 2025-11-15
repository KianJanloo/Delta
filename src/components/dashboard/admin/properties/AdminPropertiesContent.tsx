"use client";

import { useCallback, useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable from "@/components/dashboard/admin/shared/AdminResourceTable";
import { normalizeList } from "@/components/dashboard/admin/shared/normalize";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import { showToast } from "@/core/toast/toast";
import {
  deleteAdminHouse,
  getAdminHouses,
  updateAdminHouse,
  type AdminHouse,
  type UpdateAdminHousePayload,
} from "@/utils/service/api/admin";
import { uploadHousePhotos } from "@/utils/service/api/houses/uploadPhotos";
import AdminPaginationControls from "@/components/dashboard/admin/shared/AdminPaginationControls";
import AdminPropertiesFilters from "./AdminPropertiesFilters";
import { usePropertiesTableColumns } from "./AdminPropertiesTableColumns";
import AdminPropertiesStatusDialog from "./AdminPropertiesStatusDialog";
import AdminPropertiesDeleteDialog from "./AdminPropertiesDeleteDialog";
import AdminPropertiesEditDialog from "./AdminPropertiesEditDialog";
import AdminPropertiesPhotosDialog from "./AdminPropertiesPhotosDialog";

const PAGE_SIZE = 10;

const AdminPropertiesContent = () => {
  const { formatCurrency, formatNumber } = useAdminFormatters();
  const [properties, setProperties] = useState<AdminHouse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [sellerFilterDraft, setSellerFilterDraft] = useState("");
  const [sellerFilter, setSellerFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");
  const [selectedHouse, setSelectedHouse] = useState<AdminHouse | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPhotosDialogOpen, setIsPhotosDialogOpen] = useState(false);
  const [statusDraft, setStatusDraft] = useState<string>("draft");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [editDraft, setEditDraft] = useState<Partial<UpdateAdminHousePayload>>(
    {}
  );
  const [photosDraft, setPhotosDraft] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);

  const handleFetchProperties = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await getAdminHouses({
        page,
        limit: PAGE_SIZE,
        order,
        sort: "createdAt",
        sellerId: sellerFilter.trim() ? Number(sellerFilter.trim()) : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      const list = normalizeList<AdminHouse>(payload);
      setProperties(list);
      setHasNextPage(list.length === PAGE_SIZE);
    } catch (err) {
      console.error("Failed to fetch admin houses", err);
      setProperties([]);
      setHasNextPage(false);
      setError("بارگذاری اطلاعات املاک با خطا مواجه شد.");
    } finally {
      setIsLoading(false);
    }
  }, [page, order, sellerFilter, statusFilter]);

  useEffect(() => {
    handleFetchProperties();
  }, [handleFetchProperties]);

  const handleOpenDeleteDialog = useCallback((item: AdminHouse) => {
    setSelectedHouse(item);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleOpenEditDialog = useCallback(async (item: AdminHouse) => {
    setSelectedHouse(item);
    setEditDraft({
      title: item.title,
      address: item.address || "",
      price: item.price,
      status: item.status || "draft",
      transactionType: item.transactionType,
      capacity: item.capacity,
      bathrooms: item.bathrooms,
      rooms: item.rooms,
      parking: item.parking,
      yardType: item.yardType,
      description: item.summary || "",
    });
    setIsEditDialogOpen(true);
  }, []);

  const handleOpenPhotosDialog = useCallback(async (item: AdminHouse) => {
    setSelectedHouse(item);
    setPhotosDraft(item.photos || []);
    setUploadedFiles([]);
    setFileInputKey((prev) => prev + 1);
    setIsPhotosDialogOpen(true);
  }, []);

  const handleUpdateHouse = async () => {
    if (!selectedHouse) return;
    setIsActionLoading(true);
    try {
      await updateAdminHouse(selectedHouse.id, editDraft);
      showToast("success", "ملک با موفقیت به‌روزرسانی شد.");
      setIsEditDialogOpen(false);
      setSelectedHouse(null);
      setEditDraft({});
      await handleFetchProperties();
    } catch (err) {
      console.error("Failed to update house", err);
      showToast("error", "به‌روزرسانی ملک با خطا مواجه شد.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUpdatePhotos = async () => {
    if (!selectedHouse) return;
    setIsActionLoading(true);
    try {
      if (uploadedFiles.length > 0) {
        const response = await uploadHousePhotos(
          selectedHouse.id.toString(),
          uploadedFiles
        );
        if (response && response.photos) {
          showToast("success", "عکس‌های ملک با موفقیت آپلود شد.");
          setIsPhotosDialogOpen(false);
          setSelectedHouse(null);
          setPhotosDraft([]);
          setUploadedFiles([]);
          setFileInputKey((prev) => prev + 1);
          await handleFetchProperties();
        } else {
          throw new Error("آپلود عکس‌ها ناموفق بود");
        }
      } else {
        showToast("warning", "لطفا حداقل یک عکس انتخاب کنید.");
      }
    } catch (err) {
      console.error("Failed to upload photos", err);
      showToast("error", "آپلود عکس‌ها با خطا مواجه شد.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setUploadedFiles((prev) => [...prev, ...fileArray]);
    }
  };

  const handleRemoveUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingPhoto = async (index: number) => {
    if (!selectedHouse) return;
    const updatedPhotos = photosDraft.filter((_, i) => i !== index);
    try {
      await updateAdminHouse(selectedHouse.id, { photos: updatedPhotos });
      setPhotosDraft(updatedPhotos);
      showToast("success", "عکس با موفقیت حذف شد.");
      await handleFetchProperties();
    } catch (err) {
      console.error("Failed to remove photo", err);
      showToast("error", "حذف عکس با خطا مواجه شد.");
    }
  };

  const handleApplyFilters = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setSellerFilter(sellerFilterDraft);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSellerFilterDraft("");
    setSellerFilter("");
    setStatusFilter("all");
    setOrder("DESC");
    setPage(1);
  };

  const handleUpdateHouseStatus = async () => {
    if (!selectedHouse) return;
    setIsActionLoading(true);
    try {
      await updateAdminHouse(selectedHouse.id, { status: statusDraft });
      showToast("success", "وضعیت ملک با موفقیت به‌روزرسانی شد.");
      setIsStatusDialogOpen(false);
      setSelectedHouse(null);
      await handleFetchProperties();
    } catch (err) {
      console.error("Failed to update house status", err);
      showToast("error", "به‌روزرسانی وضعیت ملک با خطا مواجه شد.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteHouse = async () => {
    if (!selectedHouse) return;
    setIsActionLoading(true);
    try {
      await deleteAdminHouse(selectedHouse.id);
      showToast("success", "ملک با موفقیت حذف شد.");
      setIsDeleteDialogOpen(false);
      setSelectedHouse(null);
      const shouldGoPrevPage =
        properties.length === 1 && page > 1 && !hasNextPage;
      if (shouldGoPrevPage) {
        setPage((prev) => Math.max(prev - 1, 1));
      } else {
        await handleFetchProperties();
      }
    } catch (err) {
      console.error("Failed to delete house", err);
      showToast("error", "حذف ملک با خطا مواجه شد.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const columns = usePropertiesTableColumns({
    formatCurrency,
    formatNumber,
    onEdit: handleOpenEditDialog,
    onPhotos: handleOpenPhotosDialog,
    onDelete: handleOpenDeleteDialog,
  });

  const summaryLabel =
    properties.length > 0
      ? `نمایش ${formatNumber(properties.length)} ملک در صفحه ${formatNumber(
          page
        )}`
      : "ملکی برای نمایش موجود نیست.";

  return (
    <div className="space-y-6" dir="rtl">
      <AdminPageHeader
        title="مدیریت املاک"
        description="پایش املاک ثبت‌شده، وضعیت انتشار و جزئیات قیمت‌گذاری فروشندگان."
        actions={
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => handleFetchProperties()}
            disabled={isLoading}
          >
            <Building2 className="size-4" />
            {isLoading ? "در حال بروزرسانی..." : "بروزرسانی لیست"}
          </Button>
        }
        hint={`تعداد املاک در این صفحه: ${formatNumber(properties.length)}`}
      />

      <AdminPropertiesFilters
        sellerFilterDraft={sellerFilterDraft}
        setSellerFilterDraft={setSellerFilterDraft}
        sellerFilter={sellerFilter}
        setSellerFilter={setSellerFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
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
            data={properties}
            isLoading={isLoading}
            errorMessage={error}
            emptyMessage="ملکی با این مشخصات پیدا نشد."
            getKey={(item) => `house-${item.id}`}
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

      <AdminPropertiesStatusDialog
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        selectedHouse={selectedHouse}
        statusDraft={statusDraft}
        setStatusDraft={setStatusDraft}
        isActionLoading={isActionLoading}
        onUpdate={handleUpdateHouseStatus}
        formatNumber={formatNumber}
      />

      <AdminPropertiesDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        selectedHouse={selectedHouse}
        isActionLoading={isActionLoading}
        onDelete={handleDeleteHouse}
        formatNumber={formatNumber}
      />

      <AdminPropertiesEditDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setIsActionLoading(false);
            setSelectedHouse(null);
            setEditDraft({});
          }
        }}
        selectedHouse={selectedHouse}
        editDraft={editDraft}
        setEditDraft={setEditDraft}
        isActionLoading={isActionLoading}
        onUpdate={handleUpdateHouse}
        formatNumber={formatNumber}
      />

      <AdminPropertiesPhotosDialog
        open={isPhotosDialogOpen}
        onOpenChange={(open) => {
          setIsPhotosDialogOpen(open);
          if (!open) {
            setIsActionLoading(false);
            setSelectedHouse(null);
            setPhotosDraft([]);
            setUploadedFiles([]);
            setFileInputKey((prev) => prev + 1);
          }
        }}
        selectedHouse={selectedHouse}
        photosDraft={photosDraft}
        uploadedFiles={uploadedFiles}
        fileInputKey={fileInputKey}
        isActionLoading={isActionLoading}
        onFileSelect={handleFileSelect}
        onRemoveUploadedFile={handleRemoveUploadedFile}
        onRemoveExistingPhoto={handleRemoveExistingPhoto}
        onUpdate={handleUpdatePhotos}
        formatNumber={formatNumber}
      />
    </div>
  );
};

export default AdminPropertiesContent;
