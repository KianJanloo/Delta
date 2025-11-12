'use client';

import { useCallback, useMemo } from "react";
import { useLocale } from "next-intl";

const FALLBACK_LABEL = "تومان";

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isParsableNumber = (value: unknown): value is number | string => {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed);
  }
  return false;
};

export const useAdminFormatters = () => {
  const locale = useLocale();
  const intlLocale = locale === "fa" ? "fa-IR" : "en-US";

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(intlLocale, {
        maximumFractionDigits: 0,
      }),
    [intlLocale],
  );

  const decimalFormatter = useMemo(
    () =>
      new Intl.NumberFormat(intlLocale, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      }),
    [intlLocale],
  );

  const dateTimeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(intlLocale, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [intlLocale],
  );

  const normalizeNumeric = (value: unknown): number => {
    if (isFiniteNumber(value)) return value;
    if (isParsableNumber(value)) {
      const parsed = typeof value === "number" ? value : Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };

  const formatNumber = useCallback(
    (value: unknown) => numberFormatter.format(normalizeNumeric(value)),
    [numberFormatter],
  );

  const formatDecimal = useCallback(
    (value: unknown) => decimalFormatter.format(normalizeNumeric(value)),
    [decimalFormatter],
  );

  const formatCurrency = useCallback(
    (value: unknown, label = FALLBACK_LABEL) => {
      if (!isParsableNumber(value)) return `0 ${label}`;
      const parsed = typeof value === "number" ? value : Number(value);
      return `${numberFormatter.format(parsed)} ${label}`;
    },
    [numberFormatter],
  );

  const formatDateTime = useCallback(
    (value?: string | Date | null) => {
      if (!value) return "—";
      const date = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(date.getTime())) return "—";
      return dateTimeFormatter.format(date);
    },
    [dateTimeFormatter],
  );

  return {
    formatNumber,
    formatDecimal,
    formatCurrency,
    formatDateTime,
    locale: intlLocale,
    currencyLabel: locale === "fa" ? "تومان" : "IRR",
  };
};

export type AdminFormatters = ReturnType<typeof useAdminFormatters>;

