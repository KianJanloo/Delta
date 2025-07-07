'use client'
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import CommonSelect from "@/components/common/inputs/common/CommonSelect";
import DatePickerInput from "@/components/common/inputs/datePicker/DatePickerInput";
import CommonButton from "@/components/common/buttons/common/CommonButton";
import { DateObject } from "react-multi-date-picker";
import { getCategories } from "@/utils/service/api/categories";
import { Category } from "@/types/categories-type/categories-type";

interface FilterValues {
  checkInDate: string;
  checkOutDate: string;
  reservationStatus: string;
  propertyType: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterValues) => void;
}

const FilterModal = ({ isOpen, onClose, onApplyFilters }: FilterModalProps) => {
  const t = useTranslations("modals.filter2");
  const [checkInDate, setCheckInDate] = useState<DateObject | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<DateObject | null>(null);
  const [reservationStatus, setReservationStatus] = useState(t("approved"));
  const [propertyType, setPropertyType] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  if (!isOpen) return null;

  const categoryOptions = [
    { label: "همه", value: "all" },
    ...categories.map(category => ({
      label: category.name,
      value: category.name
    }))
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl w-full max-w-md overflow-hidden shadow-lg">
        <div
          className="flex justify-between items-center p-4 border-b border-border"
          dir="ltr"
        >
          <CommonButton
            onclick={onClose}
            title={t("close")}
            icon={<X className="h-5 w-5" />}
            classname="border border-danger bg-transparent text-danger"
          />
          <h2 className="text-lg font-bold">{t("filters")}</h2>
        </div>

        <div className="p-4 space-y-6" dir="rtl">
          <div className="grid grid-cols-2 gap-4">
            <DatePickerInput
              label={t("checkInDate")}
              placeholder={t("checkInDatePlaceholder")}
              value={checkInDate}
              onChange={setCheckInDate}
              className="w-full"
            />

            <DatePickerInput
              label={t("checkOutDate")}
              placeholder={t("checkOutDatePlaceholder")}
              value={checkOutDate}
              onChange={setCheckOutDate}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CommonSelect
              label={t("reservationStatus")}
              selectItems={[
                { label: t("approved"), value: "confirmed" },
                { label: t("pending"), value: "pending" },
                { label: t("canceled"), value: "cancelled" },
                { label: " همه ", value: "all" },
              ]}
              value={reservationStatus}
              onValueChange={setReservationStatus}
              placeholder={" همه "}
              color="text-subText"
              classname="border-subText py-5 rounded-xl w-full"
            />

            <CommonSelect
              label={t("propertyType")}
              selectItems={categoryOptions}
              value={propertyType}
              onValueChange={setPropertyType}
              placeholder={" همه "}
              color="text-subText"
              classname="border-subText py-5 rounded-xl w-full"
            />
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-center">
          <CommonButton
            onclick={() => {
              onApplyFilters({
                checkInDate: checkInDate?.toString() || "",
                checkOutDate: checkOutDate?.toString() || "",
                reservationStatus,
                propertyType,
              });
              onClose();
            }}
            title={t("applyFilter")}
            classname="bg-primary text-background px-10 py-2 rounded-full font-medium"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterModal;