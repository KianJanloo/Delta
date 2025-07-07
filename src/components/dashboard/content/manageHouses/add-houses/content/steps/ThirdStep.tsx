'use client'
import ReserveMap from '@/components/reserve/map/ReserveMap'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { useTranslations } from 'next-intl'
import CommonButton from '@/components/common/buttons/common/CommonButton'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useHouseStore } from '@/utils/zustand/house'
import { MarkerType } from '@/components/reserve/content/ReserveContent'

const ThirdStep = ({ setStep }: { setStep: Dispatch<SetStateAction<number>> }) => {
  const t = useTranslations('dashboardSeller.thirdStep')
  const { data: house, setData } = useHouseStore()
  const [marker, setMarker] = useState<MarkerType | null>(null)
  const [address, setAddress] = useState<string>(house.address || '')

  const handleNext = () => {
    setData({
      address: address,
      location: marker 
        ? { lat: marker.lat, lng: marker.lng } 
        : house.location || undefined,
    })
    setStep(prev => prev + 1)
  }

  return (
    <div className="flex flex-col gap-16 w-full">
      <div className="w-full flex max-lg:flex-col-reverse justify-between gap-8">
        <div className="w-5/12 max-lg:w-full flex flex-col gap-20 max-lg:gap-8">
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="address" className="text-subText">
              {t('address')}
            </Label>
            <Input
              name="address"
              id="address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder={t('addressPlaceholder')}
              className="w-full px-4 py-2 text-sm bg-transparent border rounded-xl text-subText border-subText"
            />
          </div>
          <span className="text-xl leading-[60px]">
            {t('desc1')}
            <span className="text-primary">{t('desc2')}</span>
            {t('desc3')}
          </span>
        </div>
        <div className="w-7/12 max-lg:w-full h-[366px]">
          <ReserveMap location={house?.location} marker={marker} setMarker={setMarker} />
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
          title="مرحله بعد"
          classname="w-fit"
          icon={<ChevronLeft size={16} />}
          onclick={handleNext}
        />
      </div>
    </div>
  )
}

export default ThirdStep
