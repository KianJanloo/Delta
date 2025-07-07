import { ChevronLeft, House } from 'lucide-react'
import React from 'react'
import CallSlider from './CallSlider'
import { useTranslations } from 'next-intl'

const SingleReserveFooter = () => {
  const t = useTranslations('singleReserve.footer');
  return (
    <div className='flex flex-col gap-12 w-full'>
        <div className='bg-secondary-light2 px-4 py-2 w-full rounded-[12px] flex justify-between'>
          <h2 className='flex gap-2 items-center flex-row-reverse max-md:text-sm'>
            {t('similarAds')} <House size={18} />
          </h2>
          <div className='flex gap-2 items-center max-md:text-sm cursor-pointer border-b border-transparent transition-all duration-300 hover:border-primary text-primary'>
            {t('seeAll')} <ChevronLeft size={16} />
          </div>
        </div>
        <CallSlider />
    </div>
  )
}

export default SingleReserveFooter