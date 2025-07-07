'use client'
import CommonButton from '@/components/common/buttons/common/CommonButton'
import { SplitNumber } from '@/utils/helper/spliter/SplitNumber'
import { Book, ChevronLeft, ChevronRight, Coins, Loader, Megaphone } from 'lucide-react'
import React, { FC, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ISecondStep } from '@/types/booking-type/booking-type'
import TablePassengers from './TablePassengers'
import DiscountSection from './DiscountSection'
import { discountPrice } from '@/utils/helper/discount-price/DiscountPrice'
import { useBooking } from '@/utils/zustand/booking'
import { createBook } from '@/utils/service/api/booking/createBook'
import { createPayment } from '@/utils/service/api/payment/createPayment'

const SecondStep: FC<ISecondStep> = ({
    handleCurrentStepIncrease,
    handleCurrentSteDecrease,
}) => {
    const t = useTranslations('hotel.second');
    const { book } = useBooking()
    const [loading, setLoading] = useState<boolean>(false)
    const priceWithDiscount = discountPrice(Number(book?.house?.price), Number(book?.discount) || 0);

    const handleBooking = async () => {
        setLoading(true)
        const bookData = {
            houseId: book?.house?.id,
            reservedDates: book?.reservedDates,
            traveler_details: book?.passengers?.map((passenger) => ({
                firstName: passenger.firstName,
                lastName: passenger.lastName,
                gender: passenger.gender,
                birthDate: passenger.birthDate,
                nationalId: passenger.nationalId,
            })),
            sharedEmail: book?.sharedEmail,
            sharedMobile: book?.sharedMobile
        }
        const response = await createBook(bookData)
        if (response) {
            const paymentData = {
                amount: Number(book?.house?.price),
                callbackUrl: "/",
                description: `پرداخت برای رزرو شماره ${response.id}`,
                bookingId: response.id
            }

            setLoading(false)
            handleCurrentStepIncrease()
            await createPayment(paymentData)
        }
    }

    return (
        <div className='w-full flex flex-col gap-8'>

            <TablePassengers book={book || {}} />

            <div className='w-full bg-secondary-light2 px-2 py-2 gap-8 rounded-2xl flex flex-col'>
                <div className='w-full bg-subBg2 rounded-2xl flex-wrap gap-4 px-4 py-2 flex justify-between'>
                    <div className='flex gap-3 items-center'>
                        <Coins size={20} />
                        <span>{t('sideCost')}</span>
                    </div>
                </div>
                <span className='mx-4 font-light leading-10'>
                    {t('sideCostDesc')}
                </span>
            </div>

            <div className='w-full bg-secondary-light2 px-2 py-2 gap-8 rounded-2xl flex flex-col'>
                <div className='w-full bg-subBg2 rounded-2xl px-4 py-2 flex justify-between'>
                    <div className='flex gap-3 items-center'>
                        <Megaphone size={20} />
                        <span>
                            {t('notification')}
                            <span className='text-primary'> {t('notificationDesc')} </span>
                        </span>
                    </div>
                </div>
                <div className='px-4 w-full flex gap-4 items-center pb-4 flex-wrap'>
                    <div className='flex gap-2 items-center'>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.06215 1.53451C4.38431 0.663888 5.61569 0.663888 5.93785 1.53451L6.46097 2.94821C6.56226 3.22193 6.77807 3.43774 7.05179 3.53903L8.46549 4.06215C9.33611 4.38431 9.33611 5.61569 8.46549 5.93785L7.05179 6.46097C6.77807 6.56226 6.56226 6.77807 6.46097 7.05179L5.93785 8.46549C5.61569 9.33611 4.38431 9.33611 4.06215 8.46549L3.53903 7.05179C3.43774 6.77807 3.22193 6.56226 2.94821 6.46097L1.53451 5.93785C0.663888 5.61569 0.663888 4.38431 1.53451 4.06215L2.94821 3.53903C3.22193 3.43774 3.43774 3.22193 3.53903 2.94821L4.06215 1.53451Z" fill="white" />
                        </svg>
                        <span className='text-primary'> <span className='text-foreground'>{t('phoneNumber')}:</span> {book?.sharedMobile} </span>
                    </div>
                    <svg width="2" height="16" viewBox="0 0 2 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="1" y1="16" x2="0.999999" y2="4.37113e-08" stroke="#DDDDDD" strokeWidth="2" />
                    </svg>
                    <div className='flex gap-2 items-center'>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.06215 1.53451C4.38431 0.663888 5.61569 0.663888 5.93785 1.53451L6.46097 2.94821C6.56226 3.22193 6.77807 3.43774 7.05179 3.53903L8.46549 4.06215C9.33611 4.38431 9.33611 5.61569 8.46549 5.93785L7.05179 6.46097C6.77807 6.56226 6.56226 6.77807 6.46097 7.05179L5.93785 8.46549C5.61569 9.33611 4.38431 9.33611 4.06215 8.46549L3.53903 7.05179C3.43774 6.77807 3.22193 6.56226 2.94821 6.46097L1.53451 5.93785C0.663888 5.61569 0.663888 4.38431 1.53451 4.06215L2.94821 3.53903C3.22193 3.43774 3.43774 3.22193 3.53903 2.94821L4.06215 1.53451Z" fill="white" />
                        </svg>
                        <span className='text-primary'> <span className='text-foreground'>{t('email')}:</span> {book?.sharedEmail} </span>
                    </div>
                </div>
            </div>

            <DiscountSection />

            <div className='relative w-full max-lg:mt-[30px] flex justify-center items-center'>
                <svg className='max-lg:hidden' width="100%" height="84" viewBox="0 0 1376 84" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="100%" height="82" rx="31" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round" strokeDasharray="16 16" />
                </svg>
                <div className='w-full flex absolute justify-between flex-wrap gap-4 max-w-[1300px] px-4 py-2 text-lg md:text-2xl'>
                    <div className='flex gap-3 items-center'>
                        <Book size={20} />
                        <span>
                            {t('ticketPrice')}
                            <span className='text-primary'> {SplitNumber(book?.discount ? priceWithDiscount : book?.house?.price || 0)} <span> {t('currency')} </span> </span>
                        </span>
                    </div>
                    <div className='flex gap-4'>
                        <CommonButton onclick={handleCurrentSteDecrease} title={t('prevStep')} icon={<ChevronRight size={16} />} classname='bg-transparent border-foreground flex flex-row-reverse border w-fit text-foreground' />
                        <CommonButton onclick={handleBooking} title={loading ? "در حال بارگزاری" : t('onlinePayment')} icon={loading ? <Loader size={16} /> : <ChevronLeft size={16} />} classname={`bg-transparent flex border-primary border w-fit text-primary ${loading ? "cursor-not-allowed" : "cursor-pointer"} `} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SecondStep