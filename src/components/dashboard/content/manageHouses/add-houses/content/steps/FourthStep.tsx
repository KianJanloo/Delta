/* eslint-disable */
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import type { StaticImageData } from "next/image";
import mainImage from "@/assets/MainImage.png";
import addImage from "@/assets/AddImage.png";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDirection } from "@/utils/hooks/useDirection";
import CommonButton from "@/components/common/buttons/common/CommonButton";
import { useHouseStore } from "@/utils/zustand/house";
import { useUploadThing } from "@/utils/helper/uploadthing";
import { Label } from "@/components/ui/label";
import { showToast } from "@/core/toast/toast";

interface FileImageProps {
  defaultImage: StaticImageData;
  selectedImage: string | null;
  onImageChange: (image: string | null) => void;
}

const FileImage: React.FC<FileImageProps> = ({
  defaultImage,
  selectedImage,
  onImageChange,
}) => {
  const { startUpload, isUploading } = useUploadThing("imageUploader");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      try {
        const res = await startUpload([file]);
        if (res && res[0].serverData.url) {
          onImageChange(res[0].serverData.url);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const handleClear = () => {
    onImageChange(null);
  };

  const imgSrc = selectedImage || defaultImage.src;

  return (
    <label
      className={`relative w-[189px] h-[189px] ${
        !selectedImage ? "cursor-pointer" : ""
      }`}
    >
      {selectedImage && (
        <div
          onClick={handleClear}
          className="rounded-full bg-background text-danger flex justify-center items-center absolute z-20 -right-2 -top-2 p-2 cursor-pointer"
        >
          <X size={16} />
        </div>
      )}
      {!selectedImage && (
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={isUploading}
        />
      )}
      <img
        src={imgSrc}
        alt="uploaded"
        className="object-cover rounded-2xl w-full h-full"
      />
    </label>
  );
};

const FourthStep: React.FC<{ setStep: Dispatch<SetStateAction<number>> }> = ({
  setStep,
}) => {
  const t = useTranslations("dashboardSeller.fourthStep");
  const dir = useDirection();
  const { data: house, setData } = useHouseStore();

  const [selectedImages, setSelectedImages] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [photos, setPhotos] = useState<string[]>(house.photos || []);
  const [input, setInput] = useState("");

  const removePhotos = (indexToRemove: any) => {
    setPhotos(photos.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmitPhotos = () => {
    setData({
      photos: photos,
    });
    showToast("success", " تصاویر با موفقیت ثبت شد ");
  };

  const handleKeyDown = (e: any) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      const newTag = input.trim();
      if (!photos.includes(newTag)) {
        setPhotos([...photos, newTag]);
      }
      setInput("");
    } else if (e.key === "Backspace" && !input && photos.length) {
      setPhotos(photos.slice(0, -1));
    }
  };

  useEffect(() => {
    const initialPhotos = house.photos || [];
    const newImages: (string | null)[] = [null, null, null, null];
    for (let i = 0; i < newImages.length; i++) {
      newImages[i] = initialPhotos[i] || null;
    }
    setSelectedImages(newImages);
  }, [house.photos]);

  const handleImageChange = (index: number, url: string | null) => {
    setSelectedImages((prev) => {
      const newArr = [...prev];
      newArr[index] = url;
      return newArr;
    });
  };

  const nextStep = () => {
    const photos = selectedImages.filter((img): img is string => img !== null);
    setData({ photos });
    setStep((prev) => prev + 1);
  };

  return (
    <div dir={dir} className="flex flex-col gap-24">
      <div className="flex flex-col gap-4">
        <h2>{t("title")}</h2>
        <span>
          <span className="text-primary">{t("desc1")}</span>
          {t("desc2")}
        </span>
      </div>
      <div className="flex gap-4 max-w-[800px] items-end">
        <CommonButton
          title=" ثبت تصاویر "
          onclick={() => handleSubmitPhotos()}
        />
        <div className="w-full flex flex-col gap-2">
          <Label htmlFor="tags" className="text-subText text-sm">
            تصاویر ملک
          </Label>
          <div className="flex flex-wrap gap-2 px-4 py-2 border border-subText rounded-xl">
            {photos.map((tag, index) => (
              <div
                key={index}
                className="flex items-center bg-primary text-primary-foreground gap-1 px-2 py-1 rounded-lg text-sm max-w-[200px] truncate line-clamp-1"
              >
                <button
                  type="button"
                  className="ml-1 text-primary-foreground"
                  onClick={() => removePhotos(index)}
                >
                  <X size={14} />
                </button>
                {tag}
              </div>
            ))}
            <input
              id="photos"
              name="photos"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow bg-transparent text-subText text-sm focus:outline-none"
              placeholder=" تصویر ملک را وارد و Enter بزنید "
            />
          </div>
        </div>
      </div>
      <div className="flex max-xl:flex-wrap max-xl:items-center w-full justify-center gap-8">
        <FileImage
          defaultImage={mainImage}
          selectedImage={selectedImages[0]}
          onImageChange={(url) => handleImageChange(0, url)}
        />
        <FileImage
          defaultImage={addImage}
          selectedImage={selectedImages[1]}
          onImageChange={(url) => handleImageChange(1, url)}
        />
        <FileImage
          defaultImage={addImage}
          selectedImage={selectedImages[2]}
          onImageChange={(url) => handleImageChange(2, url)}
        />
        <FileImage
          defaultImage={addImage}
          selectedImage={selectedImages[3]}
          onImageChange={(url) => handleImageChange(3, url)}
        />
      </div>
      <div className="w-full flex justify-end gap-4">
        <CommonButton
          type="button"
          title="مرحله قبل"
          classname="w-fit flex-row-reverse bg-subText text-[#000000]"
          icon={<ChevronRight size={16} />}
          onclick={() => setStep((prev) => prev - 1)}
        />
        <CommonButton
          type="button"
          title="مرحله بعد"
          classname="w-fit"
          icon={<ChevronLeft size={16} />}
          onclick={nextStep}
        />
      </div>
    </div>
  );
};

export default FourthStep;
