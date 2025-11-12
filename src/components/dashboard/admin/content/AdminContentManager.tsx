'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { Megaphone, MessageSquare, RefreshCcw, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";
import { useAdminFormatters } from "@/components/dashboard/admin/shared/useAdminFormatters";
import { normalizeList } from "@/components/dashboard/admin/shared/normalize";
import {
  getAdminComments,
  type AdminComment,
  getAdminChatRooms,
  type AdminChatRoom,
} from "@/utils/service/api/admin";

interface DraftAnnouncement {
  id: string;
  title: string;
  audience: string;
  scheduledAt: string;
  owner: string;
}

const DRAFT_ANNOUNCEMENTS: DraftAnnouncement[] = [
  {
    id: "draft-1",
    title: "به‌روزرسانی شرایط اجاره تابستان",
    audience: "تمام کاربران",
    scheduledAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    owner: "تیم بازاریابی",
  },
  {
    id: "draft-2",
    title: "اطلاعیه امنیتی ورود دو مرحله‌ای",
    audience: "مدیران فروش",
    scheduledAt: new Date(Date.now() + 120 * 60 * 60 * 1000).toISOString(),
    owner: "تیم امنیت",
  },
];

const AdminContentManager = () => {
  const { formatDateTime } = useAdminFormatters();
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [chatRooms, setChatRooms] = useState<AdminChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [commentsPayload, roomsPayload] = await Promise.allSettled([
        getAdminComments({ limit: 6, order: "DESC", sort: "createdAt" }),
        getAdminChatRooms(),
      ]);

      if (commentsPayload.status === "fulfilled") {
        setComments(normalizeList<AdminComment>(commentsPayload.value).slice(0, 6));
      } else {
        console.error(commentsPayload.reason);
        setComments([]);
      }

      if (roomsPayload.status === "fulfilled") {
        setChatRooms(normalizeList<AdminChatRoom>(roomsPayload.value));
      } else {
        console.error(roomsPayload.reason);
        setChatRooms([]);
      }

      if (commentsPayload.status === "rejected" && roomsPayload.status === "rejected") {
        setError("بارگذاری محتوا با خطا روبه‌رو شد. لطفاً دوباره تلاش کنید.");
      } else if (commentsPayload.status === "rejected" || roomsPayload.status === "rejected") {
        setError("برخی اطلاعات در دسترس نیستند. داده‌های فعلی ممکن است ناقص باشند.");
      }
    } catch (err) {
      console.error("Failed to fetch admin content", err);
      setComments([]);
      setChatRooms([]);
      setError("بارگذاری محتوا با خطا روبه‌رو شد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const commentsSummary = useMemo(() => {
    const positive = comments.filter((comment) => comment.rating >= 4).length;
    const negative = comments.filter((comment) => comment.rating <= 2).length;
    return { positive, negative, total: comments.length };
  }, [comments]);

  return (
    <div className="space-y-6" dir="rtl">
      <AdminPageHeader
        title="مدیریت محتوا و ارتباطات"
        description="نظارت بر نظرات کاربران، اتاق‌های گفتگو و برنامه‌ریزی اطلاعیه‌های جدید."
        actions={
          <>
            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => fetchContent()}
              disabled={isLoading}
            >
              <RefreshCcw className="size-4" />
              بروزرسانی داده‌ها
            </Button>
            <Button className="gap-2">
              <Megaphone className="size-4" />
              اطلاعیه جدید
            </Button>
          </>
        }
        hint={`جمع‌بندی نظرات اخیر: ${commentsSummary.total} مورد (${commentsSummary.positive} مثبت، ${commentsSummary.negative} منفی)`}
      />

      {error ? (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:border-amber-300/40 dark:bg-amber-500/10 dark:text-amber-300">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 border-border/70">
          <CardHeader className="flex flex-col gap-2 text-right md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-base font-semibold">بازخورد کاربران</CardTitle>
              <p className="text-sm text-muted-foreground">
                تازه‌ترین نظرات ثبت‌شده توسط کاربران در املاک مختلف
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              آخرین بروزرسانی: {formatDateTime(new Date())}
            </span>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[360px]">
              <div className="space-y-4">
                {isLoading && comments.length === 0
                  ? Array.from({ length: 4 }).map((_, idx) => (
                      <div
                        key={`comment-skeleton-${idx}`}
                        className="rounded-2xl border border-border/60 bg-card/40 p-4"
                      >
                        <div className="flex flex-col gap-3">
                          <Skeleton className="h-4 w-3/4 rounded" />
                          <Skeleton className="h-3 w-full rounded" />
                          <Skeleton className="h-3 w-2/3 rounded" />
                        </div>
                      </div>
                    ))
                  : comments.length > 0
                    ? comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="rounded-2xl border border-border/60 bg-card/40 p-4 transition hover:border-primary/40"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-foreground">
                                کاربر #{comment.userId}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ملک #{comment.houseId} • امتیاز {comment.rating}/5
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDateTime(comment.createdAt)}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            {comment.comment}
                          </p>
                        </div>
                      ))
                    : (
                      <div className="rounded-2xl border border-dashed border-border/60 bg-subBg/40 p-6 text-center text-sm text-muted-foreground">
                        نظری برای نمایش وجود ندارد.
                      </div>
                    )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="text-right">
            <CardTitle className="text-base font-semibold">اتاق‌های گفتگو</CardTitle>
            <p className="text-sm text-muted-foreground">
              کانال‌های پشتیبانی فعال میان کاربران و تیم پشتیبانی
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && chatRooms.length === 0
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <div key={`room-skeleton-${idx}`} className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-4">
                    <Skeleton className="h-4 w-1/2 rounded" />
                    <Skeleton className="h-3 w-1/3 rounded" />
                  </div>
                ))
              : chatRooms.length > 0
                ? chatRooms.map((room) => (
                    <div
                      key={room.room}
                      className="space-y-2 rounded-xl border border-border/60 bg-muted/10 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">
                          اتاق {room.room}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-border/60 px-2 py-0.5 text-xs text-muted-foreground">
                          <MessageSquare className="size-3" />
                          {room.participants} نفر
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        آخرین فعالیت: {room.lastMessageAt ? formatDateTime(room.lastMessageAt) : "نامشخص"}
                      </span>
                    </div>
                  ))
                : (
                  <div className="space-y-2 rounded-xl border border-dashed border-border/60 bg-subBg/40 p-6 text-center text-sm text-muted-foreground">
                    اتاق فعالی وجود ندارد.
                  </div>
                )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70">
        <CardHeader className="flex flex-col gap-2 text-right md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">برنامه انتشار اطلاعیه‌ها</CardTitle>
            <p className="text-sm text-muted-foreground">
              اطلاعیه‌های در صف انتشار را بررسی و زمان‌بندی کنید.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
            <StickyNote className="size-4" />
            {DRAFT_ANNOUNCEMENTS.length} اطلاعیه آماده انتشار
          </span>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {DRAFT_ANNOUNCEMENTS.map((announcement) => (
            <div
              key={announcement.id}
              className="space-y-3 rounded-2xl border border-border/60 bg-card/30 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  {announcement.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(announcement.scheduledAt)}
                </span>
              </div>
              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                <span>مخاطب: {announcement.audience}</span>
                <span>مسئول: {announcement.owner}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                بازبینی و ویرایش
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContentManager;

