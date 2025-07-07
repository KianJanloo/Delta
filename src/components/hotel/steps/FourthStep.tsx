import CommonButton from '@/components/common/buttons/common/CommonButton'
import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React from 'react'
import CheckGreen from '@/assets/CheckGreen.png'
import { useTranslations } from 'next-intl'

const FourthStep = ({ removeBooking }: { removeBooking?: () => void }) => {
    const t = useTranslations('hotel.fourth');

    return (
        <div className='flex flex-col w-full gap-8 items-center my-[100px]'>
            <Image src={CheckGreen} alt='' className='shadow-2xl w-[200px] shadow-[#0EEAB552] rounded-[50px]' />
            <h2 className='font-bold text-2xl'>{t('successMessage')}</h2>
            <div className='flex gap-4'>
                <CommonButton
                    onclick={() => {
                        if (removeBooking) {
                            removeBooking()
                            redirect("/")
                        }
                    }}
                    title={t('backToHome')}
                    icon={<ChevronLeft size={16} />}
                    classname='bg-transparent border-foreground flex border w-fit text-foreground'
                />
                <CommonButton
                    onclick={() => {
                        if (removeBooking) {
                            removeBooking()
                            redirect("/dashboard/manage-reserves")
                        }
                    }}
                    title={t('myTickets')}
                    icon={<ChevronLeft size={16} />}
                    classname='bg-transparent flex border-primary border w-fit text-primary'
                />
            </div>
        </div>
    )
}

export default FourthStep