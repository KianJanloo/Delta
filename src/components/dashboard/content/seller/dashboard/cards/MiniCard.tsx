import { BlurFade } from '@/components/magicui/blur-fade'
import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl'

const MiniCard = ({
  number,
  title,
  idx,
  value,
  href
}: { number?: number; title: string; value?: string; idx: number, href?: string }) => {
  const t = useTranslations('dashboardSeller.dashboard.miniCard')
  return (
    <BlurFade
      delay={idx / 5}
      inView
      className="bg-subBg rounded-[12px] h-[140px] max-lg:w-full w-1/4 relative flex justify-between gap-3 items-center pt-4 px-4 pb-2 flex-col"
    >
      <div className="absolute top-0 right-4 bg-bgDash flex justify-center items-center w-[50] h-[60] rounded-b-[12px] py-4">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.9694 4.15949C16.6225 3.72412 16.949 3.50643 17.3048 3.54166C17.6606 3.57689 17.938 3.85439 18.493 4.40938L21.5909 7.50729C22.1459 8.06228 22.4234 8.33978 22.4587 8.69555C22.4939 9.05132 22.2762 9.37785 21.8408 10.0309L19.979 12.8237C19.2973 13.8462 18.9565 14.3574 18.699 14.9104C18.602 15.1188 18.5139 15.3313 18.4352 15.5473C18.2262 16.1204 18.1057 16.7229 17.8647 17.9279L17.6578 18.9625C17.6351 19.076 17.6238 19.1328 17.6119 19.1737C17.4313 19.7956 16.7163 20.0845 16.1544 19.7625C16.1174 19.7413 16.0698 19.7083 15.9746 19.6425C15.5257 19.3317 15.3013 19.1763 15.0809 19.0186C11.9547 16.782 9.21836 14.0456 6.98169 10.9194C6.824 10.699 6.66863 10.4746 6.35788 10.0257C6.29198 9.93053 6.25903 9.88294 6.23784 9.84596C5.91586 9.28408 6.20473 8.56901 6.82664 8.38844C6.86757 8.37655 6.92433 8.3652 7.03786 8.34249L8.07239 8.13559C9.27742 7.89458 9.87994 7.77408 10.453 7.56514C10.669 7.4864 10.8815 7.39838 11.0899 7.30133C11.6429 7.04383 12.1542 6.70299 13.1767 6.02133L15.9694 4.15949Z" className="stroke-foreground fill-foreground" strokeWidth="2" />
          <path d="M5.41699 20.583L10.292 15.708" className="stroke-foreground" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="w-full flex justify-center items-center flex-col">
        <h2 className="font-semibold text-lg"> {number} </h2>
        <span className="text-lg"> {t(title)} </span>
      </div>

      <svg width="100%" height="2" viewBox="0 0 547 2" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line y1="-0.5" x2="524" y2="-0.5" transform="matrix(1 0.000108856 -7.8105e-05 1 0 1)" stroke="#888888" strokeOpacity="0.26" strokeDasharray="7 7" />
      </svg>

      {value ? (
        <span> {value} {t("currency")} </span>
      ) : (
        <Link href={href || " "} className="w-full cursor-pointer flex justify-between">
          <span className="text-muted">{t('view')}</span>
          <svg width="63" height="18" viewBox="0 0 63 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.7677 10.6382C2.2526 9.91281 2.25259 7.75581 3.76769 7.03041L12.8127 2.69983C14.1402 2.06424 15.6764 3.03189 15.6764 4.50373L15.6764 13.1649C15.6764 14.6367 14.1402 15.6044 12.8127 14.9688L3.7677 10.6382Z" fill="#7A7A7A" />
            <path d="M31.566 10.1869C30.4297 9.64286 30.4297 8.02511 31.566 7.48106L38.3498 4.23313C39.3454 3.75643 40.4975 4.48217 40.4975 5.58605L40.4975 12.0819C40.4975 13.1858 39.3454 13.9115 38.3498 13.4348L31.566 10.1869Z" fill="#7A7A7A" fillOpacity="0.5" />
            <path d="M54.1378 9.73561C53.3802 9.37291 53.3802 8.29441 54.1378 7.93171L58.6603 5.76642C59.324 5.44862 60.0921 5.93245 60.0921 6.66837L60.0921 10.9989C60.0921 11.7349 59.324 12.2187 58.6603 11.9009L54.1378 9.73561Z" fill="#7A7A7A" fillOpacity="0.25" />
          </svg>
        </Link>
      )}
    </BlurFade>
  )
}

export default MiniCard