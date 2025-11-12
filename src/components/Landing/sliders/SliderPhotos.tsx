/* eslint-disable */

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { ISliderPhotos } from '@/types/slider-type/slider-types'

export default function SliderPhotos({ photos, imageClassName }: ISliderPhotos) {
  return (
    <div className="w-full max-w-xl mx-auto relative">
      <Swiper
        modules={[Pagination, Navigation]}
        pagination={{ clickable: true }}
        autoplay
        loop={true}
        slidesPerView={1}
        className="rounded-2xl overflow-hidden shadow-lg"
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={index} className="flex justify-center">
            <img
              src={photo || " "}
              alt={" "}
              width={200}
              height={40}
              className={`w-full flex justify-center items-center bg-secondary-light2 h-[157px] object-cover ${imageClassName}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
