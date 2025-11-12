'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { BlurFade } from '@/components/magicui/blur-fade';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { getAdminDashboard, type IAdminDashboardSummary } from '@/utils/service/api/admin';
import { getAdminBookings, type AdminBooking } from '@/utils/service/api/admin/bookings';
import { getAdminPayments, type AdminPayment } from '@/utils/service/api/admin/payments';
import { getAdminStatistics, type ICrowdfundingStatistics } from '@/utils/service/api/crowdfunding/getAdminStatistics';
import { getAdminBrokerageStats, type IBrokerageStats } from '@/utils/service/api/brokerage/getAdminBrokerageStats';
import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  CalendarClock,
  Handshake,
  Rocket,
  ShieldCheck,
  Star,
  TrendingUp,
  Users2,
} from 'lucide-react';

type ActivityStatus = 'success' | 'warning' | 'danger' | 'default';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  status: ActivityStatus;
  rawStatus?: string;
  type: 'booking' | 'payment';
  timestamp?: string;
}

interface ActivityDisplayItem extends ActivityItem {
  timestampLabel: string;
}

const statusStyles: Record<ActivityStatus, string> = {
  success: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-500 border border-amber-500/30',
  danger: 'bg-rose-500/10 text-rose-500 border border-rose-500/30',
  default: 'bg-muted text-muted-foreground border border-border/50',
};

const normalizeList = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === 'object') {
    const candidates = ['data', 'items', 'results', 'records'];
    for (const key of candidates) {
      const value = (payload as Record<string, unknown>)[key];
      if (Array.isArray(value)) {
        return value as T[];
      }
    }
  }
  return [];
};

const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

type MetricItem = {
  key: 'users' | 'houses' | 'bookings' | 'rating';
  label: string;
  description: string;
  value: string;
  icon: LucideIcon;
  helper?: string;
};

const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: 'در انتظار بررسی',
  processing: 'در حال پردازش',
  on_hold: 'متوقف موقت',
  confirmed: 'تایید شده',
  completed: 'تکمیل شده',
  approved: 'تایید شده',
  cancelled: 'لغو شده',
  rejected: 'رد شده',
  failed: 'ناموفق',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'در انتظار',
  processing: 'در حال پردازش',
  review: 'نیازمند بازبینی',
  completed: 'پرداخت شده',
  paid: 'پرداخت شده',
  settled: 'تسویه شده',
  success: 'موفق',
  cancelled: 'لغو شده',
  failed: 'ناموفق',
  refunded: 'مسترد شده',
  declined: 'رد شده',
};

const AdminDashboardContent = () => {
  const locale = useLocale();

  const [summary, setSummary] = useState<IAdminDashboardSummary | null>(null);
  const [recentBookings, setRecentBookings] = useState<AdminBooking[]>([]);
  const [recentPayments, setRecentPayments] = useState<AdminPayment[]>([]);
  const [crowdfundingStats, setCrowdfundingStats] = useState<ICrowdfundingStatistics | null>(null);
  const [brokerageStats, setBrokerageStats] = useState<IBrokerageStats | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const currencyLabel = 'تومان';

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US'),
    [locale],
  );

  const decimalFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      }),
    [locale],
  );

  const dateTimeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    [locale],
  );

  const formatInteger = useCallback(
    (value: number | undefined | null) => numberFormatter.format(isFiniteNumber(value) ? value : 0),
    [numberFormatter],
  );

  const formatDecimal = useCallback(
    (value: number | undefined | null) => decimalFormatter.format(isFiniteNumber(value) ? value : 0),
    [decimalFormatter],
  );

  const formatDateTime = useCallback(
    (value?: string | Date | null) => {
      if (!value) return '—';
      const date = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(date.getTime())) return '—';
      return dateTimeFormatter.format(date);
    },
    [dateTimeFormatter],
  );

  const mapBookingStatusToActivityStatus = (status?: string): ActivityStatus => {
    const normalized = status?.toLowerCase();
    if (!normalized) return 'default';
    if (['confirmed', 'completed', 'approved'].includes(normalized)) return 'success';
    if (['pending', 'processing', 'on_hold'].includes(normalized)) return 'warning';
    if (['cancelled', 'rejected', 'failed'].includes(normalized)) return 'danger';
    return 'default';
  };

  const mapPaymentStatusToActivityStatus = (status?: string): ActivityStatus => {
    const normalized = status?.toLowerCase();
    if (!normalized) return 'default';
    if (['completed', 'paid', 'settled', 'success'].includes(normalized)) return 'success';
    if (['pending', 'processing', 'review'].includes(normalized)) return 'warning';
    if (['failed', 'cancelled', 'refunded', 'declined'].includes(normalized)) return 'danger';
    return 'default';
  };

  const getBookingStatusLabel = useCallback((status?: string) => {
    if (!status) return '';
    const normalized = status.toLowerCase();
    return BOOKING_STATUS_LABELS[normalized] ?? status;
  }, []);

  const getPaymentStatusLabel = useCallback((status?: string) => {
    if (!status) return '';
    const normalized = status.toLowerCase();
    return PAYMENT_STATUS_LABELS[normalized] ?? status;
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const errors: string[] = [];

    const [
      summaryResult,
      bookingsResult,
      paymentsResult,
      crowdfundingResult,
      brokerageResult,
    ] = await Promise.allSettled([
      getAdminDashboard(),
      getAdminBookings({ limit: 5, order: 'DESC', sort: 'createdAt' }),
      getAdminPayments({ limit: 5, order: 'DESC', sort: 'createdAt' }),
      getAdminStatistics(),
      getAdminBrokerageStats(),
    ]);

    if (summaryResult.status === 'fulfilled') {
      setSummary(summaryResult.value);
    } else {
      errors.push('summary');
      setSummary(null);
      console.error(summaryResult.reason);
    }

    if (bookingsResult.status === 'fulfilled') {
      const bookings = normalizeList<AdminBooking>(bookingsResult.value).slice(0, 5);
      setRecentBookings(bookings);
    } else {
      errors.push('bookings');
      setRecentBookings([]);
      console.error(bookingsResult.reason);
    }

    if (paymentsResult.status === 'fulfilled') {
      const payments = normalizeList<AdminPayment>(paymentsResult.value).slice(0, 5);
      setRecentPayments(payments);
    } else {
      errors.push('payments');
      setRecentPayments([]);
      console.error(paymentsResult.reason);
    }

    if (crowdfundingResult.status === 'fulfilled') {
      setCrowdfundingStats(crowdfundingResult.value);
    } else {
      errors.push('crowdfunding');
      setCrowdfundingStats(null);
      console.error(crowdfundingResult.reason);
    }

    if (brokerageResult.status === 'fulfilled') {
      setBrokerageStats(brokerageResult.value);
    } else {
      errors.push('brokerage');
      setBrokerageStats(null);
      console.error(brokerageResult.reason);
    }

    if (errors.length === 5) {
      setErrorMessage('بارگذاری اطلاعات با خطا مواجه شد. لطفاً دوباره تلاش کنید.');
    } else if (errors.length > 0) {
      setErrorMessage('برخی از داده‌ها در دسترس نبود. اطلاعات نمایش داده شده ممکن است کامل نباشد.');
    }

    setLastUpdated(new Date());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const metrics = useMemo<MetricItem[]>(() => {
    if (!summary) return [];

    return [
      {
        key: 'users',
        label: 'کاربران فعال',
        description: 'تعداد کاربران احراز شده در سامانه',
        value: formatInteger(summary.totalUsers),
      icon: Users2,
    },
    {
        key: 'houses',
        label: 'املاک و اقامتگاه‌ها',
        description: 'کل املاک منتشر شده و در انتظار انتشار',
        value: formatInteger(summary.totalHouses),
      icon: Building2,
    },
    {
        key: 'bookings',
        label: 'رزروهای ثبت شده',
        description: 'تمام رزروهای تایید شده و در جریان',
        value: formatInteger(summary.totalBookings),
        icon: CalendarClock,
      },
      {
        key: 'rating',
        label: 'میانگین امتیاز',
        description: 'میانگین امتیاز بازخوردها',
        value: formatDecimal(summary.averageRating),
        icon: Star,
        helper: 'براساس امتیازات تأیید شده مهمانان',
      },
    ];
  }, [summary, formatInteger, formatDecimal]);

  const activityItems = useMemo<ActivityDisplayItem[]>(() => {
    const bookingActivities = recentBookings.map<ActivityDisplayItem>((booking) => ({
      id: `booking-${booking.id}`,
      title: `رزرو جدید شماره ${booking.id}`,
      description: `کاربر ${booking.userId ?? '—'} برای ملک ${booking.houseId ?? '—'} درخواست ثبت کرده است.`,
      status: mapBookingStatusToActivityStatus(booking.status),
      rawStatus: booking.status,
      type: 'booking',
      timestamp: booking.createdAt,
      timestampLabel: formatDateTime(booking.createdAt),
    }));

    const paymentActivities = recentPayments.map<ActivityDisplayItem>((payment) => ({
      id: `payment-${payment.id}`,
      title: `پرداخت شماره ${payment.id}`,
      description: `کاربر ${payment.userId ?? '—'} مبلغ ${formatInteger(payment.amount ?? 0)} ${currencyLabel} پرداخت کرده است.`,
      status: mapPaymentStatusToActivityStatus(payment.status),
      rawStatus: payment.status,
      type: 'payment',
      timestamp: payment.createdAt,
      timestampLabel: formatDateTime(payment.createdAt),
    }));

    return [...bookingActivities, ...paymentActivities]
      .sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return timeB - timeA;
      })
      .slice(0, 8);
  }, [recentBookings, recentPayments, formatInteger, currencyLabel, formatDateTime]);

  const quickStats = useMemo(() => {
    const stats: Array<{ key: string; label: string; value: string }> = [];

    if (summary) {
      stats.push({
        key: 'totalBookings',
        label: 'کل رزروها',
        value: formatInteger(summary.totalBookings),
      });
      stats.push({
        key: 'averageRating',
        label: 'میانگین امتیاز',
        value: formatDecimal(summary.averageRating),
      });
    }

    if (crowdfundingStats) {
      stats.push({
        key: 'totalFunded',
        label: 'حجم سرمایه جذب شده',
        value: `${formatInteger(crowdfundingStats.totalFunded)} ${currencyLabel}`,
      });
      stats.push({
        key: 'successRate',
        label: 'نرخ موفقیت پروژه‌ها',
        value: `${formatDecimal(crowdfundingStats.successRate)}%`,
      });
    }

    if (brokerageStats) {
      stats.push({
        key: 'activeBrokers',
        label: 'کارگزاران فعال',
        value: formatInteger(brokerageStats.activeBrokers),
      });
      stats.push({
        key: 'totalSales',
        label: 'کل فروش شبکه',
        value: `${formatInteger(brokerageStats.totalSales)} ${currencyLabel}`,
      });
    }

    return stats.slice(0, 6);
  }, [summary, crowdfundingStats, brokerageStats, formatInteger, formatDecimal, currencyLabel]);

  const renderStatus = (item: ActivityDisplayItem) => {
    if (!item.rawStatus) return null;
    const label =
      item.type === 'booking'
        ? getBookingStatusLabel(item.rawStatus)
        : getPaymentStatusLabel(item.rawStatus);

    return (
      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${statusStyles[item.status]}`}>
        {label}
      </span>
    );
  };

  const renderLoadingState = () => (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 md:p-8">
        <Skeleton className="h-20 w-full" />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-2xl bg-subBg" />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Skeleton className="h-80 rounded-2xl xl:col-span-2 bg-subBg" />
        <Skeleton className="h-80 rounded-2xl bg-subBg" />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-2xl bg-subBg" />
        <Skeleton className="h-72 rounded-2xl bg-subBg" />
      </section>
    </div>
  );

  if (isLoading && !lastUpdated) {
    return renderLoadingState();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
              <CalendarClock className="size-4" />
              <span>
                {lastUpdated
                  ? `آخرین بروزرسانی: ${formatDateTime(lastUpdated)}`
                  : 'آخرین بروزرسانی'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              پنل مدیریتی دلتا
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              نظارت کامل بر کاربران، معاملات و رشد کسب‌وکار در یک نگاه.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-500/10 p-4 text-rose-600 dark:border-rose-400/40 dark:bg-rose-500/10 dark:text-rose-300">
            <span className="text-sm font-semibold">{errorMessage}</span>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={fetchData}>
                تلاش دوباره
            </Button>
          </div>
        </div>
        )}
      </section>

      {summary ? (
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <BlurFade key={metric.key} inView delay={index * 0.05}>
              <Card className="h-full border-border/70 bg-subBg dark:bg-muted/20">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                  <div>
                      <CardDescription>{metric.description}</CardDescription>
                      <CardTitle className="mt-2">{metric.label}</CardTitle>
                  </div>
                  <span className="rounded-full bg-primary/10 text-primary p-2">
                    <Icon className="size-5" />
                  </span>
                </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-2xl font-semibold">{metric.value}</div>
                    {metric.helper ? (
                      <p className="text-xs text-muted-foreground">{metric.helper}</p>
                    ) : null}
                </CardContent>
              </Card>
            </BlurFade>
          );
        })}
      </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
          خلاصه‌ای برای نمایش وجود ندارد.
        </section>
      )}

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div className='flex flex-col gap-2 items-center justify-center'>
              <CardTitle>رویدادهای اخیر</CardTitle>
              <CardDescription>آخرین فعالیت‌های کاربران، رزروها و تراکنش‌ها</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <ScrollArea className="h-[280px] px-6">
              {activityItems.length > 0 ? (
              <div className="flex flex-col gap-4">
                  {activityItems.map((item) => (
                  <div
                      key={item.id}
                      className="flex flex-col items-end gap-2 rounded-xl border border-border/60 bg-card/40 p-4 transition hover:border-primary/40"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                        {renderStatus(item)}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                      <span className="text-xs text-muted-foreground/80">
                        {formatDateTime(item.timestamp)}
                      </span>
                  </div>
                ))}
              </div>
              ) : (
                <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-muted-foreground">
                  رویداد تازه‌ای ثبت نشده است.
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="bg-subBg/60 dark:bg-muted/20">
          <CardHeader className="flex items-start justify-between space-y-1">
            <div>
              <CardTitle>شاخص‌های کلیدی</CardTitle>
              <CardDescription>مروری سریع بر مهم‌ترین شاخص‌های عملکردی</CardDescription>
            </div>
            <TrendingUp className="size-5 text-primary" />
          </CardHeader>
          <CardContent className="space-y-3">
            {quickStats.length > 0 ? (
              quickStats.map((stat) => (
                <div
                  key={stat.key}
                  className="flex items-center justify-between rounded-xl border border-border/50 bg-background/80 px-4 py-3"
                >
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <span className="text-sm font-semibold text-foreground">{stat.value}</span>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 bg-background/60 px-4 py-6 text-center text-sm text-muted-foreground">
                شاخصی برای نمایش وجود ندارد.
            </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex items-start justify-between space-y-1">
            <div>
              <CardTitle>وضعیت سرمایه‌گذاری جمعی</CardTitle>
              <CardDescription>تصویر کلی از پروژه‌ها و جذب سرمایه</CardDescription>
            </div>
            <Rocket className="size-5 text-primary" />
          </CardHeader>
          <CardContent className="space-y-6">
            {crowdfundingStats ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/60 bg-background/60 p-3">
                    <p className="text-xs text-muted-foreground">
                      کل پروژه‌ها
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {formatInteger(crowdfundingStats.totalProjects)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-background/60 p-3">
                    <p className="text-xs text-muted-foreground">
                      پروژه‌های فعال
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {formatInteger(crowdfundingStats.activeProjects)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-background/60 p-3">
                    <p className="text-xs text-muted-foreground">
                      سرمایه جذب شده
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {`${formatInteger(crowdfundingStats.totalFunded)} ${currencyLabel}`}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-background/60 p-3">
                    <p className="text-xs text-muted-foreground">
                      میانگین سرمایه‌گذاری
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {`${formatInteger(crowdfundingStats.averageInvestment)} ${currencyLabel}`}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">
                      پروژه‌های برتر
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {`نرخ موفقیت: ${formatDecimal(crowdfundingStats.successRate)}٪`}
                    </span>
                  </div>
                  {crowdfundingStats.topProjects?.length ? (
                    <div className="space-y-3">
                      {crowdfundingStats.topProjects.slice(0, 3).map((project) => (
                        <div
                          key={project.projectId}
                          className="rounded-xl border border-border/50 bg-background/70 p-3"
                        >
                          <div className="flex items-center justify-between text-sm font-medium">
                            <span className="truncate">{project.title}</span>
                            <span className="text-xs text-muted-foreground">
                              #{project.projectId}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              {formatInteger(project.funded)} {currencyLabel}
                            </span>
                            <span>{formatDecimal(project.progress)}%</span>
                </div>
                          <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                  <div
                              className="h-1.5 rounded-full bg-primary transition-all"
                              style={{ width: `${Math.min(Math.max(project.progress, 0), 100)}%` }}
                  />
                </div>
              </div>
            ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border/60 bg-background/70 p-4 text-center text-sm text-muted-foreground">
                      اطلاعاتی از پروژه‌ها در دسترس نیست.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 bg-background/60 p-6 text-center text-sm text-muted-foreground">
                اطلاعاتی از پروژه‌ها در دسترس نیست.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-start justify-between space-y-1">
            <div>
              <CardTitle>آمار شبکه کارگزاری</CardTitle>
              <CardDescription>بررسی وضعیت فروش و کمیسیون کارگزاران</CardDescription>
            </div>
            <Handshake className="size-5 text-primary" />
          </CardHeader>
          <CardContent className="space-y-6">
            {brokerageStats ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/60 bg-background/60 p-3">
                    <p className="text-xs text-muted-foreground">کل کارگزاران</p>
                    <p className="mt-1 text-lg font-semibold">
                      {formatInteger(brokerageStats.totalBrokers)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-background/60 p-3">
                    <p className="text-xs text-muted-foreground">کارگزاران فعال</p>
                    <p className="mt-1 text-lg font-semibold">
                      {formatInteger(brokerageStats.activeBrokers)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-background/60 p-3">
                    <p className="text-xs text-muted-foreground">کل فروش ثبت شده</p>
                    <p className="mt-1 text-lg font-semibold">
                      {`${formatInteger(brokerageStats.totalSales)} ${currencyLabel}`}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-background/60 p-3">
                    <p className="text-xs text-muted-foreground">کمیسیون‌های پرداخت شده</p>
                    <p className="mt-1 text-lg font-semibold">
                      {`${formatInteger(brokerageStats.totalCommissionPaid)} ${currencyLabel}`}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">برترین کارگزاران</h3>
                    <span className="text-xs text-muted-foreground">
                      {`کمیسیون‌های معوق: ${formatInteger(brokerageStats.pendingCommission)} ${currencyLabel}`}
                    </span>
                  </div>

                  {brokerageStats.topBrokers?.length ? (
                    <div className="space-y-3">
                      {brokerageStats.topBrokers.slice(0, 3).map((broker) => (
                        <div
                          key={broker.brokerId}
                          className="rounded-xl border border-border/50 bg-background/70 p-3"
                        >
                          <div className="flex items-center justify-between text-sm font-medium">
                            <span>{broker.brokerCode}</span>
                            <span className="text-xs text-muted-foreground">#{broker.brokerId}</span>
                          </div>
                          <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
                            <span>
                              کل فروش ثبت شده: {formatInteger(broker.totalSales)} {currencyLabel}
                            </span>
                            <span>
                              کمیسیون‌های پرداخت شده: {formatInteger(broker.totalCommission)} {currencyLabel}
                            </span>
                          </div>
              </div>
            ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border/60 bg-background/70 p-4 text-center text-sm text-muted-foreground">
                      اطلاعاتی از کارگزاران در دسترس نیست.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 bg-background/60 p-6 text-center text-sm text-muted-foreground">
                اطلاعاتی از کارگزاران در دسترس نیست.
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="flex items-center justify-end">
        <Button
          variant="outline"
          className="gap-2"
          disabled={isLoading}
          onClick={fetchData}
        >
          <ShieldCheck className="size-4" />
          {isLoading ? 'در حال بروزرسانی...' : 'بروزرسانی داده‌ها'}
        </Button>
      </section>
    </div>
  );
};

export default AdminDashboardContent;
