'use client';

import { useRouter, usePathname } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import CommonSelect from '../../inputs/common/CommonSelect';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const changeLangUseSelection = (newLocale: string) => {
    const newPathname = pathname.replace(
      new RegExp(`^/(${routing.locales.join('|')})`),
      `/${newLocale}`
    );

    router.replace(newPathname);
  };

  return (
    <div className="flex gap-4 z-[1000]" onMouseDown={(e) => e.stopPropagation()}>
      <CommonSelect
        classname="border-subText px-2 py-1 max-lg:text-xs z-[1]"      
        placeholder=""
        value={currentLocale}
        onValueChange={(value => {
          changeLangUseSelection(value);
        })}
        selectItems={[
          { label: 'فارسی', value: 'fa' },
          { label: 'English', value: 'en' },
          { label: 'Arabic', value: 'ar' },
        ]}
      />
    </div>
  );
}
