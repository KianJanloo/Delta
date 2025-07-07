/* eslint-disable */

'use client'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bath, BedDouble, Car, LucideCopy, Star, Trees, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import PaymentListModal from "./PaymentListModal";
import ReservesModals from "./ReservesModal";
import { useTranslations } from "next-intl";
import { getHouseById } from "@/utils/service/api/houses-api";
import { IHouse } from "@/types/houses-type/house-type";
import { SplitNumber } from "@/utils/helper/spliter/SplitNumber";
import { showToast } from "@/core/toast/toast";
import { Lens } from "@/components/magicui/lense";

interface ReserveModalProps {
  button: React.ReactNode,
  houseId: string
}

export default function ReserveModal({ houseId, button }: ReserveModalProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const t = useTranslations("modals.reserveModal");

  const [house, setHouse] = useState<IHouse | null>(null)

  const getHouse = useCallback(async () => {
    const response = await getHouseById(houseId);
    setHouse(response)
  }, [houseId])

  const handleCopy = async () => {
    if (typeof window === 'undefined') return;

    try {
      await navigator.clipboard.writeText(`reserve/reserve-house/${houseId}`)
      showToast('success', " کپی شد ")
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }

  useEffect(() => {
    getHouse()
  }, [getHouse])

  return (
    <>
      <Dialog>
        <DialogTrigger> {button} </DialogTrigger>
        <DialogContent className="max-w-6xl w-[95%] text-right overflow-y-auto max-h-[90vh] bg-border p-6">
          <DialogHeader>
            <DialogTitle className="mb-4 w-full text-right mt-[40px] font-bold text-foreground lg:text-2xl md:text-2xl sm:text-2xl">
              {house?.title}
            </DialogTitle>
          </DialogHeader>

          <DialogClose
            className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-danger px-4 py-1 text-danger hover:bg-subBg"
          >
            {t("close")} <X />
          </DialogClose>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2" dir="ltr">
            <div className="space-y-4">
              <p className="text-sm leading-7 text-subText"> {house?.caption || "اطلاعاتی یافت نشد"} </p>
              <div className="flex flex-wrap items-center gap-3 text-sm" dir="rtl">
                <span className="text-subText">{t("tags")} :</span>
                {house?.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-md border border-primary px-4 py-1 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative h-64 w-full rounded-2xl bg-subBg">
              <Lens>
                <img
                  alt=""
                  src={house?.photos[0] || " "}
                  className="absolute inset-0 flex items-center justify-center text-2xl"
                />
              </Lens>
              <button onClick={handleCopy} className="absolute left-3 top-3 rounded-md bg-primary p-1.5 text-foreground shadow-md">
                <LucideCopy className="text-primary-foreground" size={20} />
              </button>
              <div className="absolute right-3 top-3 rounded-md bg-gradient-to-r from-accent to-accent px-3 py-1 text-foreground shadow-md">
                <span className="flex items-center gap-1 text-sm text-bacgkroundW">
                  <Star className="text-bacgkroundW" /> {house?.rate || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t pt-4 text-sm text-gray-600">
            <p className="mb-2 text-foreground">
              <strong>{t("addressLabel")} :</strong> {house?.address}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-foreground">
              <span className="flex items-center gap-1">
                <BedDouble size={16} /> {house?.rooms}
                <span> اتاق </span>
              </span>
              |
              <span className="flex items-center gap-1">
                <Car size={16} /> {house?.parking}
                <span> پارکینگ </span>
              </span>
              |
              <span className="flex items-center gap-1">
                <Bath size={16} /> {house?.bathrooms}
                <span> حمام </span>
              </span>
              |
              <span className="flex items-center gap-1">
                <Trees size={16} /> {house?.yard_type}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="text-md text-subText">
              <strong>{t("priceLabel")} :</strong>
              <span className="ml-2 rounded-md bg-border px-4 py-1 text-subText">
                {SplitNumber(house?.price || "")}
              </span>
            </div>

            <div className="flex gap-4">
              <ReservesModals houseId={Number(houseId)} />
              {/* <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="rounded-xl border border-primary px-6 py-2 text-background bg-primary"
              >
                {t("payments")}
              </button> */}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PaymentListModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </>
  );
}
