'use client'

import { directionMap } from '@/i18n/routing';
import { useLocale } from 'next-intl';

export function useDirection() {
  const locale = useLocale();
  if (locale in directionMap) {
    return directionMap[locale as keyof typeof directionMap];
  }

  return 'rtl';
}
