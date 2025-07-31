"use client";
import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import CommonButton from "@/components/common/buttons/common/CommonButton";
import { useTranslations } from "next-intl";
import { INotification } from "@/utils/service/api/notifications/getNotifications";
import { convertToJalaliString } from "@/utils/helper/shamsiDate/ShamsDate";
import { markAsRead } from "@/utils/service/api/notifications/markAsRead";
import { showToast } from "@/core/toast/toast";

interface IProps {
  notifications: INotification[];
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalCount: number;
  totalPages: number;
  setRefetch: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
}

export default function ContentNotifications({
  notifications,
  page,
  setPage,
  totalPages,
  setRefetch,
  loading,
}: IProps) {
  const t = useTranslations("dashboardBuyer.notifications");
  const [openUnread, setOpenUnread] = useState(true);
  const [openRead, setOpenRead] = useState(false);

  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);

  const mark = useCallback(
    async (id: number) => {
      const response = await markAsRead(id);
      if (response) {
        showToast("success", " اعلان شما با موفقیت خوانده شد. ");
        setPage(1);
        setRefetch(true);
      }
    },
    [setPage, setRefetch]
  );

  return (
    <div className="flex flex-col gap-8">
      <Table className="text-right max-lg:hidden overflow-hidden w-full">
        <TableHeader className="bg-subBg2 rounded-t-2xl text-foreground">
          <TableRow className="text-right">
            <TableHead className="text-right text-foreground">
              {t("notification")}
            </TableHead>
            <TableHead className="text-right text-foreground">
              {t("date")}
            </TableHead>
            <TableHead className="text-right text-foreground"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8">
                <span className="text-muted-foreground">در حال بارگذاری...</span>
              </TableCell>
            </TableRow>
          ) : (
            <>
              <TableRow
                onClick={() => setOpenUnread((v) => !v)}
                className="cursor-pointer bg-subBg"
              >
                <TableCell
                  colSpan={3}
                  className="flex w-fit gap-4 justify-between items-center py-3"
                >
                  {t("unread")} ({unread.length})
                  {openUnread ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </TableCell>
              </TableRow>

              {openUnread &&
                unread.map((not, idx) => (
                  <TableRow key={idx} className="hover:bg-subBg2 relative">
                    <TableCell className="py-4 whitespace-nowrap flex gap-4 items-center">
                      {not.title}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {convertToJalaliString(not.createdAt)}
                    </TableCell>
                    <TableCell>
                      <CommonButton
                        title={t("markAsRead")}
                        icon={<CheckCircle2 size={14} />}
                        classname="flex-row-reverse"
                        onclick={() => mark(Number(not.id))}
                      />
                    </TableCell>
                  </TableRow>
                ))}

              <TableRow
                onClick={() => setOpenRead((v) => !v)}
                className="cursor-pointer bg-subBg"
              >
                <TableCell
                  colSpan={3}
                  className="flex w-fit gap-4 justify-between items-center py-3"
                >
                  {t("read")} ({read.length})
                  {openRead ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </TableCell>
              </TableRow>

              {openRead &&
                read.map((not, idx) => (
                  <TableRow key={idx} className="hover:bg-subBg2 opacity-70">
                    <TableCell className="py-4 whitespace-nowrap">
                      {not.title}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {convertToJalaliString(not.createdAt)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))}
            </>
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-4 lg:hidden">
        {loading ? (
          <div className="text-center text-muted-foreground py-8">
            در حال بارگذاری...
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div
                onClick={() => setOpenUnread((v) => !v)}
                className="flex justify-between items-center bg-subBg2 px-4 py-2 rounded-lg cursor-pointer"
              >
                <span>
                  {t("unread")} ({unread.length})
                </span>
                {openUnread ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              {openUnread &&
                unread.map((not, i) => (
                  <div key={i} className="bg-subBg2 p-4 rounded-lg space-y-2">
                    <p className="font-medium flex gap-4">{not.title}</p>
                    <p className="text-sm text-muted-foreground">{not.message}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {convertToJalaliString(not.createdAt)}
                      </span>
                      <div
                        onClick={() => mark(Number(not.id))}
                        className="inline-flex items-center gap-1 bg-primary text-primary-foreground cursor-pointer px-2 py-1 rounded-lg text-xs"
                      >
                        <CheckCircle2 size={12} /> {t("mark")}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="space-y-2">
              <div
                onClick={() => setOpenRead((v) => !v)}
                className="flex justify-between items-center bg-subBg2 px-4 py-2 rounded-lg cursor-pointer"
              >
                <span>
                  {t("read")} ({read.length})
                </span>
                {openRead ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              {openRead &&
                read.map((not, i) => (
                  <div
                    key={i}
                    className="bg-subBg2 p-4 rounded-lg opacity-70 space-y-2"
                  >
                    <p className="font-medium">{not.title}</p>
                    <p className="text-sm text-muted-foreground">{not.message}</p>
                    <span className="text-xs text-muted-foreground">
                      {convertToJalaliString(not.createdAt)}
                    </span>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>

      <div className="flex w-full justify-end items-center">
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
  );
}
