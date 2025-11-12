'use client';

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Eye, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import { normalizeList } from "@/components/dashboard/admin/shared/normalize";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import {
  getAdminComments,
  getAdminHouses,
  getAdminBookings,
  type AdminComment,
  type AdminHouse,
  type AdminBooking,
} from "@/utils/service/api/admin";

const AdminModerationContent = () => {
  const { formatDateTime, formatNumber } = useAdminFormatters();
  const [flaggedComments, setFlaggedComments] = useState<AdminComment[]>([]);
  const [pendingHouses, setPendingHouses] = useState<AdminHouse[]>([]);
  const [pendingBookings, setPendingBookings] = useState<AdminBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModerationQueues = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        commentsResult,
        housesResult,
        bookingsResult,
      ] = await Promise.allSettled([
        getAdminComments({ limit: 8, order: "DESC", sort: "createdAt" }),
        getAdminHouses({ limit: 6, sort: "createdAt", order: "DESC", status: "pending" }),
        getAdminBookings({ limit: 6, sort: "createdAt", order: "DESC", status: "on_hold" }),
      ]);

      if (commentsResult.status === "fulfilled") {
        const allComments = normalizeList<AdminComment>(commentsResult.value);
        setFlaggedComments(allComments.filter((comment) => comment.rating <= 2).slice(0, 6));
      } else {
        console.error(commentsResult.reason);
        setFlaggedComments([]);
      }

      if (housesResult.status === "fulfilled") {
        setPendingHouses(normalizeList<AdminHouse>(housesResult.value));
      } else {
        console.error(housesResult.reason);
        setPendingHouses([]);
      }

      if (bookingsResult.status === "fulfilled") {
        setPendingBookings(normalizeList<AdminBooking>(bookingsResult.value));
      } else {
        console.error(bookingsResult.reason);
        setPendingBookings([]);
      }

      if (
        commentsResult.status === "rejected" &&
        housesResult.status === "rejected" &&
        bookingsResult.status === "rejected"
      ) {
        setError("امکان دریافت صف‌های نظارت وجود ندارد. لطفاً دوباره تلاش کنید.");
      }
    } catch (err) {
      console.error("Failed to fetch moderation queues", err);
      setFlaggedComments([]);
      setPendingHouses([]);
      setPendingBookings([]);
      setError("امکان دریافت صف‌های نظارت وجود ندارد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModerationQueues();
  }, [fetchModerationQueues]);

  return (
    <div className="space-y-6" dir="rtl">
      <AdminPageHeader
        title="نظارت و رسیدگی"
        description="صف‌های رسیدگی به محتوا و درخواست‌هایی که نیاز به تایید یا بررسی دارند."
        actions={
          <Button
            variant="secondary"
            className="gap-2"
            onClick={() => fetchModerationQueues()}
            disabled={isLoading}
          >
            <ShieldAlert className="size-4" />
            بروزرسانی صف‌ها
          </Button>
        }
        hint={`موارد در انتظار: ${
          formatNumber(flaggedComments.length + pendingHouses.length + pendingBookings.length)
        }`}
      />

      {error ? (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:border-rose-300/40 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="border-border/70">
          <CardHeader className="text-right">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-rose-600 dark:text-rose-300">
              <AlertTriangle className="size-4" />
              نظرات نیازمند بازبینی
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              نظراتی با امتیاز پایین یا محتوای حساس
            </p>
          </CardHeader>
          <CardContent className="space-y-3 text-right">
            {isLoading && flaggedComments.length === 0
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <div key={`comment-skeleton-${idx}`} className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-4">
                    <Skeleton className="h-4 w-2/3 rounded" />
                    <Skeleton className="h-3 w-full rounded" />
                  </div>
                ))
              : flaggedComments.length > 0
                ? flaggedComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="space-y-3 rounded-xl border border-border/60 bg-card/30 p-4"
                    >
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>کاربر #{formatNumber(comment.userId)}</span>
                        <span>امتیاز {comment.rating}/5</span>
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">{comment.comment}</p>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          تایید
                        </Button>
                        <Button variant="destructive" size="sm">
                          حذف
                        </Button>
                      </div>
                    </div>
                  ))
                : (
                  <div className="rounded-xl border border-dashed border-border/60 bg-subBg/40 p-6 text-center text-sm text-muted-foreground">
                    نظر معلقی وجود ندارد.
                  </div>
                )}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="text-right">
            <CardTitle className="text-base font-semibold text-amber-600 dark:text-amber-300">
              املاک در انتظار تایید
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              درخواست‌های جدید فروشندگان برای انتشار ملک
            </p>
          </CardHeader>
          <CardContent className="space-y-3 text-right">
            {isLoading && pendingHouses.length === 0
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <div key={`house-skeleton-${idx}`} className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-4">
                    <Skeleton className="h-4 w-2/3 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                    <Skeleton className="h-3 w-3/4 rounded" />
                  </div>
                ))
              : pendingHouses.length > 0
                ? pendingHouses.map((house) => (
                    <div
                      key={house.id}
                      className="space-y-2 rounded-xl border border-border/60 bg-card/30 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">
                          {house.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          فروشنده #{formatNumber(house.sellerId)}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ثبت شده در {formatDateTime(house.createdAt)}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          جزئیات بیشتر
                        </Button>
                        <Button variant="secondary" size="sm">
                          تایید انتشار
                        </Button>
                      </div>
                    </div>
                  ))
                : (
                  <div className="rounded-xl border border-dashed border-border/60 bg-subBg/40 p-6 text-center text-sm text-muted-foreground">
                    ملک معلقی وجود ندارد.
                  </div>
                )}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="text-right">
            <CardTitle className="text-base font-semibold text-primary">
              رزروهای متوقف شده
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              رزروهایی که نیاز به بررسی دستی دارند
            </p>
          </CardHeader>
          <CardContent className="space-y-3 text-right">
            {isLoading && pendingBookings.length === 0
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <div key={`booking-skeleton-${idx}`} className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-4">
                    <Skeleton className="h-4 w-2/3 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                  </div>
                ))
              : pendingBookings.length > 0
                ? pendingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="space-y-2 rounded-xl border border-border/60 bg-card/30 p-4"
                    >
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>رزرو #{formatNumber(booking.id)}</span>
                        <span>کاربر #{formatNumber(booking.userId)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ایجاد شده در {formatDateTime(booking.createdAt)}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          بازبینی
                        </Button>
                        <Button variant="secondary" size="sm" className="gap-1">
                          <CheckCircle2 className="size-3" />
                          رفع توقف
                        </Button>
                      </div>
                    </div>
                  ))
                : (
                  <div className="rounded-xl border border-dashed border-border/60 bg-subBg/40 p-6 text-center text-sm text-muted-foreground">
                    رزروی در وضعیت توقف وجود ندارد.
                  </div>
                )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed border-border/60 bg-subBg/40 text-right dark:bg-muted/10">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">سیاست‌های نظارت</CardTitle>
            <p className="text-sm text-muted-foreground">
              فرایند نظارت شامل بررسی دستی نظرات حساس و تایید نهایی املاک توسط تیم حقوقی است.
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="size-4" />
            مشاهده دستورالعمل‌ها
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
};

export default AdminModerationContent;

