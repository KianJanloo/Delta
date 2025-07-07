import CommonButton from '@/components/common/buttons/common/CommonButton'
import { IPriceSection } from '@/types/booking-type/booking-type'
import { SplitNumber } from '@/utils/helper/spliter/SplitNumber'
import { Hotel } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { redirect } from 'next/navigation'
import React, { FC } from 'react'

const PriceSection: FC<IPriceSection> = ({ book, removeBooking }) => {
    const t = useTranslations('hotel.first');

    return (
        <div className='ltr flex flex-col gap-4 justify-center'>
            <div className='flex gap-2 items-center'>
                <span className='text-primary flex flex-row text-2xl font-bold '>
                    <span> {t('currency')} </span> {SplitNumber(book?.house?.price || "")}
                </span>
                <div className='bg-danger text-accent-foreground px-2 py-1 rounded-full text-sm'> %22 </div>
                <span className='text-subText flex flex-row text-sm font-bold line-through'>
                    <span> {t('currency')} </span> {SplitNumber(book?.house?.price || "")}
                </span>
            </div>
            <CommonButton onclick={() => {
                if(removeBooking){
                    removeBooking()
                    redirect("/reserve/reserve-house")
                }
            }} title={t('changeHotel')} icon={<Hotel size={16} />} classname='bg-transparent border-primary border w-fit text-primary' />
        </div>
    )
}

export default PriceSection
