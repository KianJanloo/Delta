/* eslint-disable */

import React from 'react'
import { useTranslations } from 'next-intl'

const SingleReserveAbout = ({ caption, photos }: { caption: string, photos: string[] }) => {
  const t = useTranslations('singleReserve.about');
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-4 w-full'>
        <h2 className='text-xl'>{t('aboutProperty')}</h2>
        <span className='text-subText text-justify'> {caption} </span>
      </div>
      <div className='w-full flex max-h-[391] gap-4'>
        <div className='w-3/5'>
          {photos[0] ? <img src={photos[0]} alt='' className='w-full h-full rounded-[42px]' /> : <div className='w-full h-full bg-secondary-light4 rounded-[42px]'></div>}
        </div>
        <div className='w-2/5'>
          {photos[1] ? <img src={photos[1]} alt='' className='w-full h-full rounded-[42px]' /> : <div className='w-full h-full bg-secondary-light4 rounded-[42px]'></div>}
        </div>
      </div>
    </div>
  )
}

export default SingleReserveAbout