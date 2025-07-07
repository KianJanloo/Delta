"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Filter, Search, CheckCircle, AlertCircle, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllBookings } from "@/utils/service/api/booking/getAllBookings";
import { IReserveType } from "@/types/reserves-type/reserves-type";
import { useTranslations } from "next-intl";
import { BlurFade } from "@/components/magicui/blur-fade";
import FilterModal from "./FilterModal";
import ReservationTable from "./components/ReservationTable";
import ReservationMobile from "./components/ReservationMobile";
import LoadingSkeleton from "./components/LoadingSkeleton";
import ErrorState from "./components/ErrorState";
import ReservationPagination from "./components/ReservationPagination";
import { getHouseById } from "@/utils/service/api/houses-api";
import { IHouse } from "@/types/houses-type/house-type";


interface FilterValues {
  checkInDate: string;
  checkOutDate: string;
  reservationStatus: string;
  propertyType: string;
}

export default function HotelReservationList() {
  const t = useTranslations("dashboardBuyer.manageReserves");
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [housesData, setHousesData] = useState<Record<string, IHouse>>({});

  const { data: bookingsData, isLoading, error, refetch } = useQuery<{ data: IReserveType[] }>({
    queryKey: ['bookings', currentPage],
    queryFn: () => getAllBookings(currentPage, itemsPerPage, 'created_at', 'DESC') as Promise<{ data: IReserveType[] }>
  });

  const fetchHouses = useCallback(async () => {
    const houses: Record<string, IHouse> = {};
    for (const booking of bookingsData?.data || []) {
      if (!houses[booking.houseId]) {
        const house = await getHouseById(booking.houseId.toString());
        houses[booking.houseId] = house;
      }
    }
    setHousesData(houses);
  }, [bookingsData?.data])

  useEffect(() => {
    if (bookingsData?.data.length) {
      fetchHouses();
    }
  }, [bookingsData?.data, fetchHouses]);

  const reservations = useMemo(() =>
    bookingsData?.data.map(booking => ({
      id: booking.id,
      houseId: booking.houseId.toString(),
      hotelName: housesData[booking.houseId]?.title || booking.houseId.toString(),
      date: booking.reservedDates[0]?.value || '',
      price: housesData[booking.houseId]?.price || '0',
      guestCount: `${booking.traveler_details.length} ${t("guest")}`,
      status: booking.status as "confirmed" | "waiting" | "cancelled",
      paymentStatus: "waiting" as const,
      propertyType: housesData[booking.houseId]?.categories?.name || '',
      traveler_details: booking.traveler_details,
    })) || [],
    [bookingsData?.data, t, housesData]
  );

  const filteredReservations = useMemo(() => {
    let filtered = reservations;

    if (searchTerm) {
      filtered = filtered.filter((r) => r.hotelName.includes(searchTerm));
    }

    if (filters) {
      if (filters.reservationStatus && filters.reservationStatus !== "all") {
        filtered = filtered.filter(
          (r) => r.status === filters.reservationStatus
        );
      }
      if (filters.propertyType && filters.propertyType !== "all") {
        filtered = filtered.filter(
          (r) => {
            const house = housesData[r.houseId];
            return house?.categories?.name === filters.propertyType;
          }
        );
      }
      if (filters.checkInDate) {
        filtered = filtered.filter((r) => r.date.includes(filters.checkInDate));
      }
    }

    return filtered;
  }, [searchTerm, filters, reservations, housesData]);

  const handleApplyFilters = (filterValues: FilterValues) => {
    setFilters(filterValues);
  };

  const handleClearFilters = () => {
    setFilters(null);
  };

  const renderStatusBadge = (status: string) => {
    if (status === "confirmed") {
      return (
        <div className="flex items-center w-fit bg-primary text-background text-xs rounded-full px-2 py-1 whitespace-nowrap">
          <CheckCircle className="w-3 h-3 ml-1" />
          <span>{t("confirmed")}</span>
        </div>
      );
    } else if (status === "pending") {
      return (
        <div className="flex items-center bg-yellow-100 text-yellow-700 text-xs rounded-full px-2 py-1 whitespace-nowrap">
          <AlertCircle className="w-3 h-3 ml-1" />
          <span>{t("waiting")}</span>
        </div>
      );
    } else if (status === "cancelled") {
      return (
        <div className="flex items-center w-fit bg-danger text-background text-xs rounded-full px-2 py-1 whitespace-nowrap">
          <X className="w-3 h-3 ml-1" />
          <span>{t("cancelled")}</span>
        </div>
      );
    }
    return null;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReservations = filteredReservations.slice(startIndex, endIndex);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <BlurFade className="flex flex-col justify-between gap-8 bg-subBg p-4 sm:p-6 lg:p-8 rounded-xl w-full min-h-screen">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold text-right text-foreground">
          {t("reservationListTitle")}
        </h1>

        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
          dir="ltr"
        >
          <div className="flex gap-2">
            <button
              className="w-fit bg-primary text-background px-4 py-2 rounded-lg whitespace-nowrap gap-2 flex items-center justify-center"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <Filter className="w-4 h-4 ml-2" />
              {t("filters")}
            </button>
            {filters && (
              <button
                className="w-fit bg-danger text-background px-4 py-2 rounded-lg whitespace-nowrap gap-2 flex items-center justify-center"
                onClick={handleClearFilters}
              >
                <X className="w-5 h-5" />
                حذف فیلتر
              </button>
            )}
          </div>

          <div className="relative flex-grow max-w-full sm:max-w-md lg:max-w-sm">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-foreground" />
            </div>
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="pl-10 pr-4 py-2 rounded-lg border bg-border dark:bg-card text-right w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />

      <ReservationTable
        reservations={currentReservations}
        renderStatusBadge={renderStatusBadge}
        onDeleteSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['bookings'] });
          refetch();
        }}
      />

      <ReservationMobile
        reservations={currentReservations}
        renderStatusBadge={renderStatusBadge}
        onDeleteSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['bookings'] });
          refetch();
        }}
      />

      <div className="flex justify-center mt-4">
        <ReservationPagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </BlurFade>
  );
}