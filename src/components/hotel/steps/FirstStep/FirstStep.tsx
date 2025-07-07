/* eslint-disable */

import CommonButton from '@/components/common/buttons/common/CommonButton'
import { SplitNumber } from '@/utils/helper/spliter/SplitNumber'
import { Book, Calendar, ChevronLeft, Hotel, Map, Star, UserPlus, Users } from 'lucide-react'
import React, { FC } from 'react'
import { useTranslations } from 'next-intl'
import { IFirstStep } from '@/types/booking-type/booking-type'
import { convertToJalaliString } from '@/utils/helper/shamsiDate/ShamsDate'
import AddPassengers from './AddPassengers'
import SharedInfo from './SharedInfo'
import PriceSection from './PriceSection'
import { discountPrice } from '@/utils/helper/discount-price/DiscountPrice'

const FirstStep: FC<IFirstStep> = ({ handleCurrentStepIncrease, book, addPassenger, setSharedMobile, setSharedEmail, removeBooking }) => {
    const t = useTranslations('hotel.first');
    const priceWithDiscount = discountPrice(Number(book.house?.price), Number(book?.discount) || 0);

    return (
        <div className='w-full flex flex-col gap-8'>
            <div className='w-full bg-secondary-light2 px-4 py-4 max-xl:flex-col rounded-2xl flex gap-16 justify-between'>
                <div className='flex gap-4 max-xl:flex-col'>
                    <img className='w-[156] h-[110] rounded-[20px] max-xl:w-full max-xl:h-[200px] bg-subBg2' src={"  "} alt='' />
                    <div className='flex flex-col gap-4'>
                        <div className='bg-accent w-fit text-accent-foreground px-4 py-1 flex gap-2 rounded-xl items-center text-sm'>
                            <Star size={16} />
                            {book?.house?.rate}
                        </div>
                        <h2 className='font-bold text-xl'> {book?.house?.title} </h2>
                        <div className='flex gap-2'>
                            <Map size={16} className='text-subText' />
                            <span className='text-sm'>
                                <span className='text-subText'>{t('addressLabel')}</span>
                                {book?.house?.address}
                            </span>
                        </div>
                    </div>
                </div>
                <svg className='max-xl:hidden' width="2" height="108" viewBox="0 0 2 108" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="1" y1="107.911" x2="1" y2="0.0888671" stroke="#565656" strokeWidth="2" />
                </svg>
                <div className='flex flex-col justify-center max-xl:items-start items-center gap-4'>
                    <div className='text-subText flex gap-2 text-sm items-center'>
                        <Calendar size={16} />
                        <span className='text-primary'>
                            <span className='text-subText'>{t('checkIn')}</span>
                            {convertToJalaliString(book?.reservedDates?.[0] || '')}
                        </span>
                    </div>
                    <div className='text-subText flex gap-2 text-sm items-center'>
                        <Calendar size={16} />
                        <span className='text-primary'>
                            <span className='text-subText'>{t('checkOut')}</span>
                            {convertToJalaliString(book?.reservedDates?.[1] || '')}
                        </span>
                    </div>
                </div>
                <svg className='max-xl:hidden' width="2" height="108" viewBox="0 0 2 108" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="1" y1="107.911" x2="1" y2="0.0888671" stroke="#565656" strokeWidth="2" />
                </svg>
                <PriceSection removeBooking={removeBooking} book={book} />
            </div>

            <AddPassengers addPassenger={addPassenger} book={book} />

            <SharedInfo setSharedEmail={setSharedEmail} setSharedMobile={setSharedMobile} book={book} />

            <div className='relative w-full max-lg:mt-[30px] flex justify-center items-center'>
                <svg className='max-lg:hidden' width="100%" height="84" viewBox="0 0 1376 84" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="100%" height="82" rx="31" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round" strokeDasharray="16 16" />
                </svg>
                <div className='w-full flex absolute justify-between flex-wrap gap-4 max-w-[1300px] px-4 py-2 text-lg md:text-2xl'>
                    <div className='flex gap-3 items-center'>
                        <Book size={20} />
                        <span>
                            {t('ticketPrice')}
                            <span className='text-primary'> {SplitNumber(book.discount ? priceWithDiscount : book.house?.price || 0)} <span> {t('currency')} </span> </span>
                        </span>
                    </div>
                    <CommonButton onclick={handleCurrentStepIncrease} title={t('confirmAndContinue')} icon={<ChevronLeft size={16} />} classname='bg-transparent flex border-primary border w-fit text-primary' />
                </div>
            </div>
        </div>
    )
}

export default FirstStep