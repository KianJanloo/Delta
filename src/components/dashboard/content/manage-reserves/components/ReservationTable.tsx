/* eslint-disable */
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Info, Delete } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect, useCallback } from "react";
import CommonModal from "@/components/dashboard/modal/CommonModal";
import { getHouseById } from "@/utils/service/api/houses-api";
import { IHouse } from "@/types/houses-type/house-type";
import { convertToJalaliString } from "@/utils/helper/shamsiDate/ShamsDate";
import { SplitNumber } from "@/utils/helper/spliter/SplitNumber";
import GuestCount from "../GuestCount";
import { Reservation } from "@/types/reserves-type/reserves-type";
import ReserveModal from "../ReserveModal";
import { deleteBooking } from "@/utils/service/api/booking/deleteBooking";
import { showToast } from "@/core/toast/toast";
interface ReservationTableProps {
    reservations: Reservation[];
    renderStatusBadge: (status: string) => React.ReactNode;
    onDeleteSuccess: () => void;
}

export default function ReservationTable({
    reservations,
    renderStatusBadge,
    onDeleteSuccess
}: ReservationTableProps) {
    const t = useTranslations("dashboardBuyer.manageReserves");
    const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
    const moreRef = useRef<HTMLTableCellElement | null>(null);
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
    }, [fetchHouses, reservations.length]);

    return (
        <div className="overflow-hidden rounded-xl hidden lg:block">
            <Table className="text-right w-full">
                <TableHeader className="bg-subBg2 text-foreground">
                    <TableRow className="text-right rounded-xl">
                        <TableHead className="text-right text-foreground whitespace-nowrap">
                            {t("hotelName")}
                        </TableHead>
                        <TableHead className="text-right text-foreground whitespace-nowrap">
                            {t("reserveDate")}
                        </TableHead>
                        <TableHead className="text-right text-foreground whitespace-nowrap">
                            {t("totalPrice")}
                        </TableHead>
                        <TableHead className="text-right text-foreground whitespace-nowrap">
                            {t("guestCount")}
                        </TableHead>
                        <TableHead className="text-right text-foreground whitespace-nowrap">
                            {t("reservationStatus")}
                        </TableHead>
                        <TableHead className="text-right text-foreground whitespace-nowrap">
                            {t("paymentStatus")}
                        </TableHead>
                        <TableHead className="text-right text-foreground"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reservations.map((reservation, idx) => {
                        const house = housesData[reservation.houseId];
                        return (
                            <TableRow key={reservation.id}>
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={house?.photos[0] || "/"}
                                            alt=" "
                                            width={107}
                                            height={72}
                                            className="rounded-[12px] bg-card-light flex-shrink-0"
                                        />
                                        <div className="text-right whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                                            {house?.title || reservation.hotelName}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">{convertToJalaliString(reservation.date)}</TableCell>
                                <TableCell className="whitespace-nowrap">{house?.price || SplitNumber(reservation.price)}</TableCell>
                                <TableCell
                                    className="whitespace-nowrap cursor-pointer"
                                >
                                    <GuestCount traveler_details={reservation.traveler_details} button={reservation.guestCount} />
                                </TableCell>
                                <TableCell>{renderStatusBadge(reservation.status)}</TableCell>
                                <TableCell
                                    className="relative"
                                    ref={idx === openModalIndex ? moreRef : null}
                                >
                                    <MoreHorizontal
                                        onClick={() => {
                                            setOpenModalIndex((prev) => (prev === idx ? null : idx));
                                        }}
                                        className="cursor-pointer mr-8"
                                    />
                                    {openModalIndex === idx && (
                                        <div
                                            className={`flex absolute left-full ${idx > 2 ? "bottom-full" : "top-2"
                                                } flex-col rounded-xl gap-2 p-2 z-20 bg-subBg shadow-2xl`}
                                        >
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
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
} 