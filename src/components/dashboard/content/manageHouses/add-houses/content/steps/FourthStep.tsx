/* eslint-disable */
"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDirection } from "@/utils/hooks/useDirection";
import { useHouseIdStore, useHouseStore } from "@/utils/zustand/house";
import CommonButton from "@/components/common/buttons/common/CommonButton";
import mainImage from "@/assets/MainImage.png";
import addImage from "@/assets/AddImage.png";
import { showToast } from "@/core/toast/toast";
import { uploadHousePhotos } from "@/utils/service/api/houses/uploadPhotos";

const FourthStep: React.FC<{ setStep: Dispatch<SetStateAction<number>> }> = ({
  setStep,
}) => {
  const t = useTranslations("dashboardSeller.fourthStep");
  const dir = useDirection();
  const { houseId } = useHouseIdStore();
  const { setData } = useHouseStore();

  const [images, setImages] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageSelect = (index: number, file: File | null) => {
    const newImages = [...images];
    const newPreviews = [...previewUrls];

    if (file) {
      newImages[index] = file;
      newPreviews[index] = URL.createObjectURL(file);
    } else {
      newImages[index] = null;
      newPreviews[index] = null;
    }

    setImages(newImages);
    setPreviewUrls(newPreviews);
  };

  const handleSubmit = async () => {
    const filteredImages = images.filter((img): img is File => img !== null);
    if (!houseId || filteredImages.length === 0) {
      showToast("error", "ابتدا تصاویر را انتخاب کنید.");
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadHousePhotos(String(houseId), filteredImages);
      if (res && Array.isArray(res.photos)) {
        setData({ photos: res.photos });
        showToast("success", "تصاویر با موفقیت آپلود شدند");
        setStep((prev) => prev + 1);
      } else {
        showToast("error", "آپلود ناموفق بود.");
      }
    } catch (err) {
      showToast("error", "خطا در آپلود تصاویر");
    } finally {
      setIsUploading(false);
    }
  };

  const renderFileInput = (index: number) => (
    <label key={index} className="relative w-[189px] h-[189px] cursor-pointer">
      {previewUrls[index] && (
        <div
          onClick={() => handleImageSelect(index, null)}
          className="rounded-full bg-background text-danger flex justify-center items-center absolute z-20 -right-2 -top-2 p-2 cursor-pointer"
        >
          <X size={16} />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleImageSelect(index, e.target.files[0]);
          }
        }}
        className="hidden"
        id={`image-${index}`}
      />
      <img
        src={previewUrls[index] || (index === 0 ? mainImage.src : addImage.src)}
        alt="preview"
        className="object-cover rounded-2xl w-full h-full"
      />
    </label>
  );

  return (
    <div dir={dir} className="flex flex-col gap-24">
      <div className="flex flex-col gap-4">
        <h2>{t("title")}</h2>
        <span>
          <span className="text-primary">{t("desc1")}</span>
          {t("desc2")}
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {[0, 1, 2, 3].map(renderFileInput)}
      </div>

      <div className="w-full flex justify-end gap-4">
        <CommonButton
          type="button"
          title="مرحله قبل"
          classname="w-fit flex-row-reverse bg-subText text-[#000000]"
          icon={<ChevronRight size={16} />}
          onclick={() => setStep((prev) => prev - 1)}
          disabled={isUploading}
        />
        <CommonButton
          type="button"
          title={isUploading ? "در حال آپلود..." : "مرحله بعد"}
          classname="w-fit"
          icon={<ChevronLeft size={16} />}
          onclick={handleSubmit}
          disabled={isUploading}
        />
      </div>
    </div>
  );
};

export default FourthStep;
