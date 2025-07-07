'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { ISlider } from '@/types/slider-type/slider-types'
import CardComponent from '../cards/CardComponent'
import SkeletonCardComponent from '../cards/SkeletonCardComponent'

export default function SliderComponent({ items, view, loading }: ISlider) {
  const loadingMap = [1, 2, 3, 4]
  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={40}
        autoplay={{ delay: 10000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {loading ?
          loadingMap.map((__, index) => (
            <SwiperSlide key={index}>
              <SkeletonCardComponent />
            </SwiperSlide>
          ))
          : items.map((item, index) => (
            <SwiperSlide key={index}>
              <CardComponent {...item} view={view} />
            </SwiperSlide>
          ))}
      </Swiper>


      <style jsx global>{`
        .swiper-pagination-bullet-active {
          background-color: var(--primary) !important;
        }
      `}</style>
    </div>
  )
}
