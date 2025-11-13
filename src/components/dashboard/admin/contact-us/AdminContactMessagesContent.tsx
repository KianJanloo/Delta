'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { Mail, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import AdminResourceTable, {
  type AdminTableColumn,
} from "@/components/dashboard/admin/shared/AdminResourceTable";
import AdminSearchInput from "@/components/dashboard/admin/shared/AdminSearchInput";
import AdminPaginationControls from "@/components/dashboard/admin/shared/AdminPaginationControls";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import { normalizeList } from "@/components/dashboard/admin/shared/normalize";
import {
  getContactMessages,
  type GetContactMessagesParams,
} from "@/utils/service/api/contact-us/getContactMessages";
import {
  type ContactMessage,
} from "@/types/contact-us-type/contact-message";

type ContactMessageItem = ContactMessage & {
  createdAt?: string | null;
};

const PAGE_SIZE = 10;

const AdminContactMessagesContent = () => {
  const { formatNumber } = useAdminFormatters();
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [searchDraft, setSearchDraft] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchMessages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: GetContactMessagesParams = {
        page,
        limit: PAGE_SIZE,
        title: searchValue.trim() || undefined,
      };

      const payload = await getContactMessages(params);
      const list = normalizeList<ContactMessageItem>(payload);
      setMessages(list);

      const rawTotal =
        payload && typeof payload === "object" && !Array.isArray(payload)
          ? Number(
              "totalCount" in payload ? (payload.totalCount as number) : NaN,
            )
          : null;

      if (rawTotal !== null && Number.isFinite(rawTotal)) {
        setTotalCount(rawTotal);
        setHasNextPage(page * PAGE_SIZE < rawTotal);
      } else {
        setTotalCount(null);
        setHasNextPage(list.length === PAGE_SIZE);
      }
    } catch (err) {
      console.error("Failed to fetch contact messages", err);
      setMessages([]);
      setHasNextPage(false);
      setTotalCount(null);
      setError("بارگذاری پیام‌های تماس با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchValue]);

  useEffect(() => {
    handleFetchMessages();
  }, [handleFetchMessages]);

  const filteredMessages = useMemo(() => {
    if (statusFilter === "all") {
      return messages;
    }
    const filterKey = statusFilter.toLowerCase();
    return messages.filter((message) =>
      String(message.title ?? "").toLowerCase().includes(filterKey),
    );
  }, [messages, statusFilter]);

  const columns = useMemo<
    AdminTableColumn<ContactMessageItem>[]
  >(() => [
    {
      key: "title",
      header: "عنوان",
      className: "w-64 max-w-[280px] font-semibold text-foreground",
      cell: (item) => item.title ?? "—",
    },
    {
      key: "message",
      header: "متن پیام",
      className: "w-56 whitespace-nowrap text-muted-foreground",
      cell: (item) => item.message ?? "—",
    },
  ], []);

  const totalPages =
    totalCount !== null ? Math.max(Math.ceil(totalCount / PAGE_SIZE), 1) : null;

  const summaryLabel =
    totalPages !== null
      ? `صفحه ${formatNumber(page)} از ${formatNumber(totalPages)} • مجموع ${formatNumber(totalCount ?? 0)} پیام`
      : `نمایش ${formatNumber(filteredMessages.length)} پیام در صفحه ${formatNumber(page)}`;

  const handleApplyFilters = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setSearchValue(searchDraft.trim());
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchDraft("");
    setSearchValue("");
    setStatusFilter("all");
    setPage(1);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <AdminPageHeader
        title="پیام‌های تماس با ما"
        description="پیام‌های ارسال‌شده از صفحه تماس با ما را بررسی و مدیریت کنید."
        actions={
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => handleFetchMessages()}
            disabled={isLoading}
          >
            <RefreshCcw className="size-4" />
            {isLoading ? "در حال بروزرسانی..." : "بروزرسانی لیست"}
          </Button>
        }
        hint={summaryLabel}
      />

      <Card className="border-border/70">
        <CardHeader className="space-y-4 pb-4 text-right">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                فیلتر و جستجوی پیام‌ها
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                پیام‌ها را بر اساس عنوان فیلتر کنید.
              </p>
            </div>
          </div>

          <form className="space-y-3" onSubmit={handleApplyFilters}>
            <div className="flex flex-wrap gap-3">
              <AdminSearchInput
                placeholder="جستجو بر اساس عنوان پیام"
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                onClear={() => {
                  setSearchDraft("");
                  setSearchValue("");
                  setPage(1);
                }}
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" variant="secondary" disabled={isLoading}>
                {isLoading ? "در حال اعمال..." : "اعمال فیلترها"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResetFilters}
                disabled={isLoading}
              >
                حذف فیلترها
              </Button>
            </div>
          </form>
        </CardHeader>

        <CardContent className="space-y-4 text-right">
          <AdminResourceTable
            columns={columns}
            data={filteredMessages}
            isLoading={isLoading}
            errorMessage={error}
            emptyMessage="پیامی مطابق با فیلترهای انتخابی یافت نشد."
            getKey={(item) => `contact-message-${item.id}`}
          />

          <AdminPaginationControls
            page={page}
            hasNextPage={hasNextPage}
            isLoading={isLoading}
            onPrevious={() => setPage((prev) => Math.max(prev - 1, 1))}
            onNext={() => setPage((prev) => (hasNextPage ? prev + 1 : prev))}
            formatNumber={formatNumber}
            summary={summaryLabel}
          />
        </CardContent>
      </Card>

      <Card className="border-dashed border-border/60 bg-subBg/40 text-right dark:bg-muted/10">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                راهنمای پیگیری پیام‌ها
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                وضعیت «در حال رسیدگی» برای پیام‌هایی است که پاسخ اولیه برای آن‌ها ارسال شده است و «پاسخ داده شده» برای پیام‌های نهایی شده در نظر گرفته می‌شود.
              </p>
            </div>
          </div>
        </CardHeader>
      </Card> 
    </div>
  );
};

export default AdminContactMessagesContent;

