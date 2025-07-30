/* eslint-disable */

"use client";
import { BlurFade } from "@/components/magicui/blur-fade";
import React, { useCallback, useEffect, useState } from "react";
import ReservesHeader from "./header/ReservesHeader";
import ReservesContent from "./content/ReservesContent";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Booking, getCustomersBookings } from "@/utils/service/api/booking/getCustomersBookings";
import { useSession } from "next-auth/react";

const ReservesComponent = () => {
  const [reserves, setReserves] = useState<Booking[]>([]);
  const [filteredReserves, setFilteredReserves] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const limit = 5;

  const session = useSession() as any;

  const [filters, setFilters] = useState<{
    startDate: Date | null;
    endDate: Date | null;
    status: string | null;
  }>({
    startDate: null,
    endDate: null,
    status: null,
  });

  const handleApplyFilter = () => {
    let temp = [...reserves];

    if (filters.startDate) {
      temp = temp.filter(
        (item) => new Date(item.createdAt) >= filters.startDate!
      );
    }

    if (filters.endDate) {
      temp = temp.filter(
        (item) => new Date(item.createdAt) <= filters.endDate!
      );
    }

    if (filters.status) {
      temp = temp.filter((item) => item.status === filters.status);
    }

    setFilteredReserves(temp);
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      status: null,
    });
    setFilteredReserves(reserves);
  };

  const fetchReserves = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCustomersBookings(session.data?.userInfo?.id, currentPage, limit, "created_at", "DESC");
      setReserves(response?.bookings || []);
      setFilteredReserves(response?.bookings || []);
      setTotal(response?.totalCount || 0);
    } catch {
      setError("خطا در دریافت اطلاعات رزروها");
    } finally {
      setLoading(false);
    }
  }, [currentPage, session.data?.userInfo?.id]);

  useEffect(() => {
    fetchReserves();
  }, [fetchReserves]);

  return (
    <BlurFade className="px-4 bg-subBg rounded-xl py-4 flex flex-col gap-6">
      <ReservesHeader
        filters={filters}
        setFilters={setFilters}
        onApplyFilter={handleApplyFilter}
        onClearFilters={handleClearFilters}
      />

      <svg
        width="100%"
        height="1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          y1="0.5"
          x2="100%"
          y2="1"
          stroke="#888888"
          strokeOpacity="0.26"
          strokeDasharray="7 7"
        />
      </svg>

      {loading ? (
        <div className="mx-auto">در حال بارگذاری...</div>
      ) : error ? (
        <div className="text-red-500 mx-auto">{error}</div>
      ) : (
        <ReservesContent
          reset={fetchReserves}
          reserves={filteredReserves}
        />
      )}

      <div className="flex w-full flex-wrap justify-between items-end">
        <div></div>
        <div>
          <Pagination className="w-fit">
            <PaginationContent className="justify-center mt-6">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                />
              </PaginationItem>

              {total &&
                Array.from({ length: Math.ceil(total / limit) }, (_, idx) => (
                  <PaginationItem key={idx + 1}>
                    <PaginationLink
                      isActive={currentPage === idx + 1}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={
                        currentPage === idx + 1
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }
                    >
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </BlurFade>
  );
};

export default ReservesComponent;
