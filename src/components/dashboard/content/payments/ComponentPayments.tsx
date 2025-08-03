"use client";

import React, { useCallback, useEffect, useState } from "react";
import HeaderPayments from "./header/HeaderPayments";
import ContentPayment from "./content/ContentPayments";
import { BlurFade } from "@/components/magicui/blur-fade";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getPayments } from "@/utils/service/api/payment/getPayments";
import { IPayment } from "@/utils/service/api/seller-finance/getAllCustomersPayments";

const ComponentPayments = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const limit = 5;
  const [filters, setFilters] = useState<{ status: string }>({ status: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    const paymentsData = await getPayments({
      page,
      limit,
      status: filters?.status || "",
    });
    if (paymentsData) {
      setPayments(paymentsData.payments);
      setTotalCount(paymentsData.totalCount);
    }

    setIsLoading(false);
  }, [page, limit, , filters?.status]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <BlurFade className="px-4 bg-subBg rounded-xl py-4 flex flex-col gap-8">
      <HeaderPayments filters={filters} setFilters={setFilters} />

      <svg
        width="100%"
        height="2"
        viewBox="0 0 1131 2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="-0.00439453"
          y1="0.881836"
          x2="1131"
          y2="0.881836"
          stroke="#888888"
          strokeOpacity="0.26"
          strokeDasharray="7 7"
        />
      </svg>

      {isLoading ? (
        <div className="mx-auto text-subText animate-pulse">
          در حال دریافت اطلاعات...
        </div>
      ) : payments.length > 0 ? (
        <ContentPayment payments={payments} />
      ) : (
        <div className="mx-auto text-subText">هیچ پرداختی ثبت نشده است</div>
      )}

      <div className="flex w-full flex-wrap justify-end items-end">
        <div>
          <Pagination className="w-fit">
            <PaginationContent className="justify-center mt-6">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage(page - 1)}
                />
              </PaginationItem>

              <PaginationItem className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationLink
                    key={i}
                    onClick={() => setPage(i + 1)}
                    isActive={i + 1 === page}
                    className={
                      i + 1 === page ? "bg-primary text-primary-foreground" : ""
                    }
                  >
                    {i + 1}
                  </PaginationLink>
                ))}
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && setPage(page + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </BlurFade>
  );
};

export default ComponentPayments;
