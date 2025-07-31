"use client";

import CommonSelect from "@/components/common/inputs/common/CommonSelect";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertToJalaliString } from "@/utils/helper/shamsiDate/ShamsDate";
import { SplitNumber } from "@/utils/helper/spliter/SplitNumber";
import {
  getAllCustomersPayments,
  IPayment,
} from "@/utils/service/api/seller-finance/getAllCustomersPayments";
import {
  CheckCircle2,
  Clock,
  Coins,
  Flower,
  LayoutGrid,
  Phone,
  Rocket,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

const PaymentsDetail = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const limit = 5;

  const [statusFilter, setStatusFilter] = useState<string>();
  const [typeFilter, setTypeFilter] = useState<string>();

  const fetchPayments = useCallback(async () => {
    setPage(1);
    const data = {
      page,
      limit,
      paymentStatus: statusFilter,
      transactionType: typeFilter,
    };

    const response = await getAllCustomersPayments(data);
    setPayments(response?.data || []);
    setTotalCount(response?.totalCount || 0);
  }, [page, statusFilter, typeFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="bg-subBg px-4 py-2 rounded-2xl flex flex-col gap-4">
      <div className="flex w-full max-md:flex-col gap-4 justify-between items-start md:items-center">
        <h2 className="text-lg max-lg:text-base">
          {"لیست تراکنش های مشتریان"} ({totalCount})
        </h2>
        <div className="flex gap-4 md:w-fit w-full">
          <CommonSelect
            label={"وضعیت پرداخت"}
            placeholder={"وضعیت"}
            selectItems={[
              { label: "همه", value: "all" },
              { label: "تایید شده", value: "completed" },
              { label: "در حال بررسی", value: "pending" },
              { label: "لغو شده", value: "canceled" },
            ]}
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val === "all" ? "" : val)}
            classname="border px-8 border-subText py-5"
          />
          <CommonSelect
            label={"نوع تراکنش"}
            placeholder={"نوع"}
            selectItems={[
              { label: "رزرو", value: "booking" },
              { label: "شارژ", value: "charge" },
            ]}
            value={typeFilter}
            onValueChange={setTypeFilter}
            classname="border px-8 border-subText py-5"
          />
        </div>
      </div>

      <div className="flex flex-col justify-between gap-8">
        {/* Desktop Table */}
        <Table className="text-right max-lg:hidden overflow-hidden">
          <TableHeader className="bg-subBg2 rounded-2xl text-foreground">
            <TableRow>
              <TableHead className="text-right">{"تاریخ"}</TableHead>
              <TableHead className="text-right">{"شماره پیگیری"}</TableHead>
              <TableHead className="text-right">{"مبلغ"}</TableHead>
              <TableHead className="text-right">{"وضعیت پرداخت"}</TableHead>
              <TableHead className="text-right">{"نوع تراکنش"}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  {convertToJalaliString(payment.createdAt)}
                </TableCell>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{SplitNumber(payment.amount)}</TableCell>
                <TableCell>
                  <div
                    className={`px-2 py-1 flex gap-2 rounded-[16px] w-fit items-center ${
                      payment.status === "completed" &&
                      "bg-primary text-primary-foreground"
                    } ${
                      payment.status === "canceled" &&
                      "bg-danger text-accent-foreground"
                    }
                      ${
                        payment.status === "pending" &&
                        "bg-orange text-orange-foreground"
                      }
                    `}
                  >
                    {payment.status === "completed" && (
                      <CheckCircle2 size={14} />
                    )}
                    {payment.status === "pending" && <Clock size={14} />}
                    {payment.status === "canceled" && <X size={14} />}
                    {payment.status === "completed" && "تایید شده"}
                    {payment.status === "pending" && "در حال بررسی"}
                    {payment.status === "canceled" && "لغو شده"}
                  </div>
                </TableCell>
                <TableCell>{payment.transactionId}</TableCell>
                <TableCell>
                  <Link href={payment.paymentUrl}>مشاهده رسید</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Mobile Card View */}
        <div className="flex flex-col gap-4 w-full lg:hidden">
          {payments.map((payment, idx) => (
            <div
              key={idx}
              className="w-full max-sm:flex-col bg-subBg2 px-4 py-4 rounded-xl flex gap-4"
            >
              <div className="flex flex-col gap-4 text-base">
                <div className="flex gap-4 items-center flex-wrap">
                  <Rocket size={20} className="text-subText" />
                  <p className="text-subText">تاریخ :</p>
                  <span>{convertToJalaliString(payment.createdAt)}</span>
                </div>
                <div className="flex gap-4 items-center flex-wrap">
                  <LayoutGrid size={20} className="text-subText" />
                  <p className="text-subText">نوع تراکنش :</p>
                  <span>{payment.transactionId}</span>
                </div>
                <div className="flex gap-4 items-center flex-wrap">
                  <Phone size={20} className="text-subText" />
                  <p className="text-subText">شماره پیگیری :</p>
                  <span>{payment.id}</span>
                </div>
                <div className="flex gap-4 items-center flex-wrap">
                  <Coins size={20} className="text-subText" />
                  <p className="text-subText">مبلغ :</p>
                  <span>{SplitNumber(payment.amount)} تومان</span>
                </div>
                <div className="flex gap-4 items-center flex-wrap">
                  <Flower size={20} className="text-subText" />
                  <div
                    className={`px-2 py-1 flex gap-2 rounded-[16px] w-fit items-center ${
                      payment.status === "completed" &&
                      "bg-primary text-primary-foreground"
                    } ${
                      payment.status === "canceled" &&
                      "bg-danger text-accent-foreground"
                    }
                      ${
                        payment.status === "pending" &&
                        "bg-orange text-orange-foreground"
                      }
                    `}
                  >
                    {payment.status === "completed" && (
                      <CheckCircle2 size={14} />
                    )}
                    {payment.status === "pending" && <Clock size={14} />}
                    {payment.status === "canceled" && <X size={14} />}
                    {payment.status === "completed" && "تایید شده"}
                    {payment.status === "pending" && "در حال بررسی"}
                    {payment.status === "canceled" && "لغو شده"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex w-full flex-wrap justify-end">
          <Pagination className="w-fit">
            <PaginationContent className="justify-center mt-6">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage(page - 1)}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    className={
                      page === i + 1 ? "bg-primary text-primary-foreground" : ""
                    }
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && setPage(page + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default PaymentsDetail;
