/* eslint-disable */

import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { locales, routing } from './routing';
import { notFound } from 'next/navigation';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  if (!locales.includes(locale as any)) notFound();

  return {
    locale,
    messages: {
      landing: (await import(`../../messages/${locale}/landing.json`)).default,
      common: (await import(`../../messages/${locale}/common.json`)).default,
      auth: (await import(`../../messages/${locale}/auth.json`)).default,
      contactUs: (await import(`../../messages/${locale}/contactUs.json`)).default,
      about: (await import(`../../messages/${locale}/about.json`)).default,
      reserve: (await import(`../../messages/${locale}/reserve.json`)).default,
      singleReserve: (await import(`../../messages/${locale}/singleReserve.json`)).default,
      rental: (await import(`../../messages/${locale}/rental.json`)).default,
      hotel: (await import(`../../messages/${locale}/hotel.json`)).default,
      modals: (await import(`../../messages/${locale}/dashboard/modals.json`)).default,
      dashboardHeader: (await import(`../../messages/${locale}/dashboard/header.json`)).default,
      dashboardSidebar: (await import(`../../messages/${locale}/dashboard/sidebar.json`)).default,
      dashboardBuyer: (await import(`../../messages/${locale}/dashboard/buyer.json`)).default,
      dashboardSeller: (await import(`../../messages/${locale}/dashboard/seller.json`)).default,
    }
  };
});