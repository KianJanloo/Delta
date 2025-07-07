import {defineRouting} from 'next-intl/routing';
 
export const directionMap = {
  en: 'ltr',
  fa: 'rtl',
  ar: 'rtl'
} as const;

export const defaultLocale = "fa"
export const locales = ['fa', 'en', 'ar']

export const routing = defineRouting({
  locales,
  defaultLocale
});