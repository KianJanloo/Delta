'use client'
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getAllBookings } from "@/utils/service/api/booking/getAllBookings";
import { useCallback, useEffect, useState } from "react";
import { IReserveType } from "@/types/reserves-type/reserves-type";
import { convertToJalaliString } from "@/utils/helper/shamsiDate/ShamsDate";

export default function ReservesModals({ houseId }: { houseId: number }) {
  const t = useTranslations("modals.reservesList");
  const t2 = useTranslations("modals.reserveModal");
  const [reserves, setReserves] = useState<IReserveType[]>([]);

  const fetchReserves = useCallback(async () => {
    const response = await getAllBookings(1, 10, "created_at", "DESC", houseId) as {data: IReserveType[], total: number};
    setReserves(response.data);
  }, [houseId])

  useEffect(() => {
    fetchReserves();
  }, [fetchReserves])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="rounded-xl bg-primary px-6 py-2 text-background"
        >
          {t2("reserves")}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl text-right pt-[50px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-xl font-bold text-foreground">
            {t("title")}
            <DialogClose asChild>
              <button
                className="flex items-center gap-2 border border-danger text-danger px-4 py-1 rounded-full"
              >
                {t("close")} <X size={16} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-hidden rounded-xl">
          <table className="w-full text-sm text-center border-collapse">
            <thead className="bg-subText text-foreground">
              <tr className="bg-textComment dark:bg-subText rounded-xl">
                <th className="p-2 rounded-r">{t("date")}</th>
                <th className="p-2 rounded-r">{t("guestCount")}</th>
              </tr>
            </thead>
            <tbody>
              {reserves?.map((reserve, index) => (
                <tr key={index} className="bg-subBg">
                  <td className="p-2"> {convertToJalaliString(reserve.createdAt)} </td>
                  <td className="p-2 text-primary cursor-pointer">
                    {reserve.traveler_details.length} مسافر حاضر
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
