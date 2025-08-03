"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SplitNumber } from "@/utils/helper/spliter/SplitNumber";
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
import React from "react";
import { useTranslations } from "next-intl";
import { IPayment } from "@/utils/service/api/seller-finance/getAllCustomersPayments";
import { convertToJalaliString } from "@/utils/helper/shamsiDate/ShamsDate";

const ContentPayment = ({ payments }: { payments: IPayment[] }) => {
  const t = useTranslations("dashboardBuyer.payments");

  return (
    <div className="flex flex-col justify-between gap-8">
      <Table className="text-right max-lg:hidden overflow-hidden">
        <TableHeader className="bg-subBg2 rounded-2xl text-foreground">
          <TableRow className="text-right">
            <TableHead className="text-right text-foreground">
              {t("date")}
            </TableHead>
            <TableHead className="text-right text-foreground">
              {t("trackingNumber")}
            </TableHead>
            <TableHead className="text-right text-foreground">
              {t("amount")}
            </TableHead>
            <TableHead className="text-right text-foreground">
              {t("paymentStatus")}
            </TableHead>
            <TableHead className="text-right text-foreground">
              {t("transactionType")}
            </TableHead>
            <TableHead className="text-right text-foreground"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment, idx) => (
            <TableRow key={idx}>
              <TableCell className="py-4 whitespace-nowrap">
                {convertToJalaliString(payment.createdAt)}
              </TableCell>
              <TableCell className="whitespace-nowrap">{payment.id}</TableCell>
              <TableCell className="whitespace-nowrap">
                {SplitNumber(Number(payment.amount))} {t("currency")}
              </TableCell>
              <TableCell>
                <div
                  className={`px-2 py-1 flex gap-2 whitespace-nowrap w-fit rounded-[16px] pl-6 items-center ${
                    payment.status === "pending" &&
                    "bg-orange text-orange-foreground"
                  } ${
                    payment.status === "failed" &&
                    "bg-danger text-accent-foreground"
                  } ${
                    payment.status === "completed" &&
                    "bg-primary text-primary-foreground"
                  }`}
                >
                  {payment.status === "completed" && <CheckCircle2 size={14} />}
                  {payment.status === "pending" && <Clock size={14} />}
                  {payment.status === "failed" && <X size={14} />}
                  {payment.status === "pending" && " در حال انتظار "}
                  {payment.status === "completed" && " تایید شده "}
                  {payment.status === "failed" && " لغو شده "}
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {payment.transactionId}
              </TableCell>
              <TableCell className="cursor-pointer whitespace-nowrap">
                {t("showReceipt")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-col gap-4 w-full lg:hidden">
        {payments.map((payment, idx) => (
          <div
            key={idx}
            className="w-full max-sm:flex-col bg-subBg2 px-4 py-4 rounded-xl flex gap-4"
          >
            <div className=" h-full flex flex-col gap-2 max-sm:gap-4 text-base">
              <div className="flex gap-4 items-center flex-wrap">
                <Rocket className="text-subText" size={20} />
                <p className="text-subText">{t("date")} :</p>
                <span> {convertToJalaliString(payment.createdAt)} </span>
              </div>
              <div className="flex gap-4 items-center flex-wrap">
                <LayoutGrid className="text-subText" size={20} />
                <p className="text-subText">{t("transactionType")} :</p>
                <span> {payment.transactionId} </span>
              </div>
              <div className="flex gap-4 items-center flex-wrap">
                <Phone className="text-subText" size={20} />
                <p className="text-subText">{t("trackingNumber")} :</p>
                <span> {payment.id} </span>
              </div>
              <div className="flex gap-4 items-center flex-wrap">
                <Coins className="text-subText" size={20} />
                <p className="text-subText">{t("amount")} :</p>
                <span className="gap-2 flex">
                  {SplitNumber(Number(payment.amount))} <p>{t("currency")}</p>
                </span>
              </div>
              <div className="flex gap-4 items-center flex-wrap">
                <Flower className="text-subText" size={20} />
                <div
                  className={`px-2 py-1 flex gap-2 whitespace-nowrap w-fit rounded-[16px] pl-6 items-center ${
                    payment.status === "pending" &&
                    "bg-orange text-orange-foreground"
                  } ${
                    payment.status === "failed" &&
                    "bg-danger text-accent-foreground"
                  } ${
                    payment.status === "completed" &&
                    "bg-primary text-primary-foreground"
                  }`}
                >
                  {payment.status === "completed" && <CheckCircle2 size={14} />}
                  {payment.status === "pending" && <Clock size={14} />}
                  {payment.status === "failed" && <X size={14} />}
                  {payment.status === "pending" && " در حال انتظار "}
                  {payment.status === "completed" && " تایید شده "}
                  {payment.status === "failed" && " لغو شده "}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentPayment;
