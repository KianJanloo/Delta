'use client'
import CommonButton from '@/components/common/buttons/common/CommonButton'
import CommonInput from '@/components/common/inputs/common/CommonInput'
import DatePickerInput from '@/components/common/inputs/datePicker/DatePickerInput'
import { SplitNumber } from '@/utils/helper/spliter/SplitNumber'
import { ChevronLeft, Coins, House, Loader, Minus, Plus } from 'lucide-react'
import React, { FC, useState } from 'react'
import jalaali from 'jalaali-js'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useBooking } from '@/utils/zustand/booking'
import { IHouse } from '@/types/houses-type/house-type'
import { showToast } from '@/core/toast/toast'

interface IProps {
    discountedPrice?: number;
    price: string;
    house: IHouse;
}

export const convertToGregorian = (year: number, month: number, day: number): string => {
    const { gy, gm, gd } = jalaali.toGregorian(year, month, day)
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const seconds = now.getSeconds().toString().padStart(2, '0')
    return `${gy}-${gm.toString().padStart(2, '0')}-${gd.toString().padStart(2, '0')}T${hours}:${minutes}:${seconds}`
}

const SingleReserveBooking: FC<IProps> = ({ discountedPrice, price, house }) => {
    const t = useTranslations('singleReserve.booking');
    const router = useRouter()
    const [count, setCount] = useState(1)
    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const { setHouse, setReservedDates, setCountPassengers, removeBooking } = useBooking();

    const discount_percentage = discountedPrice ? Math.ceil(((Number(price) - discountedPrice) / Number(price)) * 100) : 0

    const handleSubmit = () => {
        if (!startDate || startDate === "" || !endDate || endDate === "") {
            showToast("error", t('dateRequired') || "لطفا تاریخ رفت و برگشت را انتخاب کنید.")
            return;
        }
        
        if (!count || count <= 0) {
            showToast("error", t('passengerRequired') || "لطفا تعداد مسافران را وارد کنید.")
            return;
        }

        const start = new Date(startDate)
        const end = new Date(endDate)
        
        if (start >= end) {
            showToast("error", t('dateInvalid') || "تاریخ برگشت باید بعد از تاریخ رفت باشد.")
            return;
        }

        if (start < new Date()) {
            showToast("error", t('datePast') || "تاریخ رفت نمی‌تواند در گذشته باشد.")
            return;
        }

        setLoading(true)
        try {
            if (removeBooking) {
                removeBooking()
            }
            setHouse(house)
            setReservedDates(startDate, endDate)
            if (setCountPassengers) {
                setCountPassengers(count)
            }
            router.push("/hotelPage")
        } catch (error) {
            showToast("error", t('bookingError') || "خطا در ثبت رزرو. لطفا دوباره تلاش کنید.")
            console.error('Booking error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleIncrement = () => {
        if (house?.capacity && count >= house.capacity) {
            showToast("warning", t('capacityExceeded', { capacity: house.capacity }) || `حداکثر ظرفیت ${house.capacity} نفر است.`)
            return
        }
        setCount(prev => prev + 1)
    }

    const handleDecrement = () => {
        if (count <= 1) {
            return
        }
        setCount(prev => prev - 1)
    }

    return (
        <motion.div 
            initial={{ x: 50, opacity: 0 }} 
            whileInView={{ x: 0, opacity: 1 }} 
            transition={{ duration: 0.5 }} 
            className='bg-secondary-light2 border border-border/50 shadow-lg px-6 gap-6 rounded-[32px] pb-6 flex flex-col items-center justify-center h-fit xl:w-3/12 w-full sticky top-[140px]'
        >
            <div className='rounded-b-[32px] bg-gradient-to-r from-primary/20 to-primary/10 border-b border-primary/20 h-[56px] mb-4 w-full flex gap-2 justify-center items-center text-base max-xl:text-sm flex-row-reverse font-semibold'>
                {t('reserveFor')} <House size={20} className='text-primary' />
            </div>

            <DatePickerInput
                label={t('startDate')}
                className='w-[100%] text-sm'
                placeholder={t('startDatePlaceholder')}
                onChange={(e) => {
                    if (e) {
                        const gDate = convertToGregorian(e.year, e.month.number, e.day)
                        setStartDate(gDate)
                    }
                }}
            />

            <DatePickerInput
                label={t('endDate')}
                placeholder={t('endDatePlaceholder')}
                className='text-sm w-[100%]'
                onChange={(e) => {
                    if (e) {
                        const gDate = convertToGregorian(e.year, e.month.number, e.day)
                        setEndDate(gDate)
                    }
                }}
            />

            <div className='w-full relative'>
                <CommonInput
                    value={count}
                    onchange={(e) => {
                        const value = e.target.valueAsNumber
                        if (value > 0 && (!house?.capacity || value <= house.capacity)) {
                            setCount(value)
                        }
                    }}
                    type='number'
                    label={t('passengerCount')}
                    classname='w-full border-subText'
                    color='text-subText'
                />
                <div className='flex w-fit gap-4 justify-between absolute left-4 top-9'>
                    <CommonButton 
                        onclick={handleIncrement} 
                        icon={<Plus />} 
                        classname='size-[24px] rounded-[4px] text-primary-foreground' 
                    />
                    <span className='text-lg'> {count} </span>
                    <CommonButton 
                        onclick={handleDecrement} 
                        icon={<Minus />} 
                        classname={`size-[24px] rounded-[4px] text-primary-foreground ${count <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                </div>
                {house?.capacity && (
                    <p className='text-xs text-subText mt-1'>
                        {t('maxCapacity') || 'حداکثر'} {house.capacity} {t('passenger') || 'نفر'}
                    </p>
                )}
            </div>

            <div className='w-full flex items-center flex-col'>
                <div className='border border-[#646464] w-full mt-4'></div>
                <div className='rounded-b-[32px] bg-gradient-to-r from-primary/20 to-primary/10 border-b border-primary/20 h-[56px] w-full flex gap-2 justify-center items-center text-base max-xl:text-sm flex-row-reverse font-semibold mt-4'>
                    {t('reservePrices')} <Coins size={20} className='text-primary' />
                </div>
            </div>

            <div className='flex flex-col gap-4 items-center w-full bg-secondary-light3/50 rounded-2xl p-4'>
                {discountedPrice && (
                    <div className='flex items-center gap-3 w-full justify-center'>
                        <div className='text-subText line-through text-lg'>
                            {SplitNumber(price)} {t('currency')}
                        </div>
                        <div className='bg-danger text-white rounded-[12px] px-3 py-1 text-sm font-bold shadow-md'>
                            {discount_percentage}% {t('discount') || 'تخفیف'}
                        </div>
                    </div>
                )}
                <div className='flex items-center gap-2'>
                    <span className='text-primary text-3xl font-bold'>
                        {discountedPrice ? SplitNumber(discountedPrice) : SplitNumber(price)}
                    </span>
                    <span className='text-subText text-lg'>{t('currency')}</span>
                </div>
                {discountedPrice && (
                    <p className='text-xs text-subText text-center'>
                        {t('perNight') || 'برای هر شب'}
                    </p>
                )}
            </div>

            <CommonButton
                icon={loading ? <Loader className="animate-spin" size={16} /> : <ChevronLeft size={16} />}
                title={loading ? (t('loading') || "در حال بارگزاری") : t('reserveNow')}
                classname={`w-full text-primary-foreground ${loading ? "cursor-not-allowed opacity-75" : "cursor-pointer"} `}
                onclick={handleSubmit}
                disabled={loading}
            />
        </motion.div>
    )
}

export default SingleReserveBooking