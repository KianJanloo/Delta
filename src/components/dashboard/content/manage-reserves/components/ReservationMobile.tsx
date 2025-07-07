/* eslint-disable */

import { MoreHorizontal, Info, Delete } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect, useCallback } from "react";
import CommonModal from "@/components/dashboard/modal/CommonModal";
import { getHouseById } from "@/utils/service/api/houses-api";
import { IHouse } from "@/types/houses-type/house-type";
import { convertToJalaliString } from "@/utils/helper/shamsiDate/ShamsDate";
import GuestCount from "../GuestCount";
import { Reservation } from "@/types/reserves-type/reserves-type";
import ReserveModal from "../ReserveModal";
import { deleteBooking } from "@/utils/service/api/booking/deleteBooking";
import { showToast } from "@/core/toast/toast";

interface ReservationMobileProps {
  reservations: Reservation[];
  renderStatusBadge: (status: string) => React.ReactNode;
  onDeleteSuccess: () => void;
}

export default function ReservationMobile({
  reservations,
  renderStatusBadge,
  onDeleteSuccess
}: ReservationMobileProps) {
  const t = useTranslations("dashboardBuyer.manageReserves");
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const moreRef = useRef<HTMLDivElement | null>(null);
  const [housesData, setHousesData] = useState<Record<string, IHouse>>({});

  const fetchHouses = useCallback(async () => {
    const houses: Record<string, IHouse> = {};
    for (const reservation of reservations) {
      if (!houses[reservation.houseId]) {
        try {
          const house = await getHouseById(reservation.houseId);
          houses[reservation.houseId] = house;
        } catch (error) {
          console.error('Error fetching house:', error);
        }
      }
    }
    setHousesData(houses);
  }, [reservations])

  useEffect(() => {

    if (reservations.length > 0) {
      fetchHouses();
    }
  }, [reservations, fetchHouses]);

  return (
    <div className="flex flex-col gap-4 lg:hidden">
      {reservations.map((reservation, idx) => {
        const house = housesData[reservation.houseId];
        return (
          <div key={reservation.id} className="bg-subBg2 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center flex-wrap gap-2">
                <img
                  src={house?.photos?.[0] || " "}
                  alt=" "
                  className="w-[107] h-[72] rounded-[12px] bg-card-light flex-shrink-0"
                />
                <div className="text-right">
                  <h3 className="font-bold">{house?.title || reservation.hotelName}</h3>
                  <p className="text-sm text-subText">{convertToJalaliString(reservation.date)}</p>
                </div>
              </div>
              <div className="relative" ref={idx === openModalIndex ? moreRef : null}>
                <MoreHorizontal
                  onClick={() => {
                    setOpenModalIndex((prev) => (prev === idx ? null : idx));
                  }}
                  className="cursor-pointer"
                />
                {openModalIndex === idx && (
                  <div className="flex absolute left-full top-0 flex-col rounded-xl gap-2 p-2 z-20 bg-subBg shadow-2xl">
                    <ReserveModal button={<div
                      className="bg-subBg px-4 py-1 flex gap-2 rounded-xl justify-between flex-row-reverse cursor-pointer hover:bg-border"
                    >
                      {t("details")} <Info size={16} />
                    </div>} houseId={reservation.houseId} />
                    <CommonModal
                      handleClick={t("delete")}
                      title={t("deleteConfirm")}
                      onClick={async () => {
                        const response = await deleteBooking((reservation.id).toString());
                        if (response) {
                          showToast("success", " رزرو با موفقیت حذف شد ")
                          onDeleteSuccess();
                        }
                      }}
                      button={
                        <div className="bg-subBg px-4 py-1 flex gap-2 rounded-xl justify-between flex-row-reverse cursor-pointer hover:bg-border">
                          {t("delete")} <Delete size={16} />
                        </div>
                      }
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-subText">{t("totalPrice")}:</span>
                <span>{house?.price || reservation.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-subText">{t("guestCount")}:</span>
                <GuestCount button={reservation.guestCount} traveler_details={reservation.traveler_details} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-subText">{t("reservationStatus")}:</span>
                {renderStatusBadge(reservation.status)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}