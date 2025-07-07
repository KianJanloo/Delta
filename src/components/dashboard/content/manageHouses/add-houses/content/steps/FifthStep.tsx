/* eslint-disable */
'use client'

import SliderPhotos from '@/components/Landing/sliders/SliderPhotos'
import { SplitNumber } from '@/utils/helper/spliter/SplitNumber'
import { ArrowDownUp, Bath, BedDouble, Building, Car, Castle, ChevronLeft, ChevronRight, Coins, Drill, MapPin, School, Trees } from 'lucide-react'
import React, { Dispatch, SetStateAction } from 'react'
import { useTranslations } from 'next-intl'
import { useHouseStore } from '@/utils/zustand/house'
import CommonButton from '@/components/common/buttons/common/CommonButton'
import { createHouse } from '@/utils/service/api/houses/createHouse'
import { showToast } from '@/core/toast/toast'
import { ICreateHouse } from '@/types/houses-type/house-type'

const FifthStep = ({ setStep }: { setStep: Dispatch<SetStateAction<number>> }) => {
  const t = useTranslations('dashboardSeller.fifthStep')
  const { data: house, reset } = useHouseStore();

  const submitHouse = async () => {
    const data = {
      title: house.title,
      caption: house.title,
      address: house.address,
      bathrooms: house.bathrooms,
      capacity: house.capacity,
      categories: house.categories,
      location: house.location,
      parking: house.parking,
      photos: house.photos,
      price: house.price,
      rooms: house.rooms,
      tags: house.tags,
      transaction_type: house.transaction_type,
      yard_type: house.yard_type
    } as ICreateHouse

    const response = await createHouse(data)
    if(response){
      showToast("success", " ملک شما با موفقیت ثبت شد. ")
      setStep(0)
      reset()
    }
    else{
      showToast("error", " ثبت اطلاعات با مسکل مواجه شد ")
    }
  }

  const handleTransactionTypePlaceHolder = () => {
    if (house.transaction_type === "direct_purchase") { return " فروش " }
    if (house.transaction_type === "reservation") { return " رزرو " }
    if (house.transaction_type === "rental") { return " اجاره " }
    if (house.transaction_type === "mortgage") { return " رهن " }
  }

  return (
    <div className='w-full flex flex-col gap-32'>
      <div className='bg-secondary-light max-xl:hidden rounded-2xl border-border border p-4 flex justify-between gap-4'>
        <div className='w-5/12 flex flex-col gap-4'>
          {house.photos && house.photos?.length > 0 ? <SliderPhotos imageClassName='h-[300px]' photos={house.photos} /> : <div className='bg-secondary-light3 rounded-xl h-[300] w-full'></div>}
          <div className='flex flex-col gap-4'>
            <div className='flex gap-2 items-center'> <MapPin className='text-muted' size={20} /> <span> {house.address} </span> </div>
            <div className="flex flex-wrap items-center gap-4 text-foreground">
              <span className="flex items-center gap-2">
                <BedDouble size={20} /> {house?.rooms}
                <span> اتاق </span>
              </span>
              |
              <span className="flex items-center gap-2">
                <Car size={20} /> {house?.parking}
                <span> پارکینگ </span>
              </span>
              |
              <span className="flex items-center gap-2">
                <Bath size={20} /> {house?.bathrooms}
                <span> حمام </span>
              </span>
            </div>
            <div className='flex gap-2 items-center'> <Castle className='text-muted' size={20} /> <span> حیاط {house.yard_type} </span> </div>
            <div className='flex gap-2 items-center'> <ArrowDownUp className='text-muted' size={20} /> <span> {handleTransactionTypePlaceHolder()} </span> </div>
          </div>
        </div>
        <div className='w-7/12 flex flex-col gap-8'>
          <div className='w-full flex flex-col gap-4'>
            <h2 className='text-xl font-bold'> {house.title} </h2>
            <span className='text-subText text-justify'> {house.caption} </span>
          </div>
          <div className='flex flex-col gap-4'>
            <div className='flex gap-4 items-center'>
              <h2 className='text-subText'>{t('tags')}:</h2>
              {house.tags?.map((tag, idx) => (
                <div key={idx} className='bg-primary rounded-xl text-primary-foreground px-8 py-2'>
                  {tag}
                </div>
              ))}
            </div>
            <div className='flex gap-4 items-center'> <Drill className='text-muted' size={20} /> <span>{house.categories?.name}</span> </div>
            <div className='flex gap-4 items-center'> <Coins className='text-muted' size={20} /> <span className='text-primary'> {SplitNumber(house?.price || "")} {t('currency')} </span> </div>
          </div>
        </div>
      </div>
      <div className='bg-secondary-light max-xl:flex flex-col rounded-2xl border-border border p-4 hidden justify-between gap-8' >
        {house.photos && house.photos?.length > 0 ? <SliderPhotos imageClassName='h-[300px]' photos={house.photos} /> : <div className='bg-secondary-light3 rounded-xl h-[300] w-full'></div>}
        <div className='w-full flex flex-col gap-4'>
          <h2 className='text-xl font-bold'>{t('title')}</h2>
          <span className='text-subText text-justify'>{t('description')}</span>
        </div>
        <div className='flex flex-row-reverse max-lg:flex-col justify-between gap-4'>
          <div className='flex w-1/2 max-lg:w-full flex-col gap-4'>
            <div className='flex gap-4 items-center'>
              <div className='flex gap-2 flex-wrap' >
                {house.tags?.map((tag, idx) => (
                  <div key={idx} className='bg-primary rounded-xl text-primary-foreground px-8 py-2'>
                    {tag}
                  </div>
                ))}
              </div>
            </div>
            <div className='flex gap-4 items-center'> <Drill className='text-muted' size={20} /> <span>{house.categories?.name}</span> </div>
            <div className='flex gap-4 items-center'> <Coins className='text-muted' size={20} /> <span className='text-primary'> {SplitNumber(house?.price || "")} {t('currency')} </span> </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-foreground">
            <span className="flex items-center gap-2">
              <BedDouble size={20} /> {house?.rooms}
              <span> اتاق </span>
            </span>
            |
            <span className="flex items-center gap-2">
              <Car size={20} /> {house?.parking}
              <span> پارکینگ </span>
            </span>
            |
            <span className="flex items-center gap-2">
              <Bath size={20} /> {house?.bathrooms}
              <span> حمام </span>
            </span>
          </div>
          <div className='flex gap-2 items-center'> <Castle className='text-muted' size={20} /> <span> حیاط {house.yard_type} </span> </div>
        </div>
      </div>
      <div className="w-full flex justify-end gap-4">
        <CommonButton
          type="button"
          title="مرحله قبل"
          classname="w-fit flex-row-reverse bg-subText text-[#000000]"
          icon={<ChevronRight size={16} />}
          onclick={() => setStep(prev => prev - 1)}
        />
        <CommonButton
          type="button"
          title="ساخت ملک"
          classname="w-fit"
          icon={<ChevronLeft size={16} />}
          onclick={submitHouse}
        />
      </div>
    </div>
  )
}

export default FifthStep