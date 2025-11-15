/* eslint-disable */

import React from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

const SingleReserveAbout = ({ caption, photos }: { caption: string, photos: string[] }) => {
  const t = useTranslations('singleReserve.about');
  const availablePhotos = photos.filter(photo => photo && photo.trim() !== '' && photo !== ' ')
  
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-4 w-full'>
        <h2 className='text-2xl font-bold mb-2'>{t('aboutProperty')}</h2>
        <div className='bg-secondary-light2 rounded-2xl p-6 border border-border/50'>
          <p className='text-subText text-justify leading-7 whitespace-pre-line'>
            {caption || t('noDescription') || 'توضیحاتی برای این ملک ثبت نشده است.'}
          </p>
        </div>
      </div>
      
      {availablePhotos.length > 0 && (
        <div className='w-full'>
          <h3 className='text-xl font-semibold mb-4'>{t('gallery') || 'گالری تصاویر'}</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {availablePhotos.slice(0, 4).map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className='relative overflow-hidden rounded-2xl bg-secondary-light4 aspect-video group'
              >
                <img 
                  src={photo} 
                  alt={`${t('galleryImage') || 'تصویر گالری'} ${index + 1}`}
                  className='w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-110'
                  loading={index < 2 ? 'eager' : 'lazy'}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SingleReserveAbout