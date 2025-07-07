import { BlurFade } from '@/components/magicui/blur-fade'
import { Pin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

const ReservesCha = () => {

    const t = useTranslations("dashboardBuyer.reserveCha")

    return (
        <BlurFade delay={0.35} inView className="lg:w-[60%] gap-4 md:w-full p-4 h-60 bg-subBg rounded-xl flex flex-col">
            <div className='flex justify-between w-full items-center flex-wrap gap-4'>
                <div className='flex gap-2 w-fit items-center'>
                    <Pin size={24} />
                    <span className='text-base font-bold'>{t('title')}</span>
                </div>
            </div>
            <svg width="100%" height="2" viewBox="0 0 1115 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0.972656" y1="1.15332" x2="1114.03" y2="1.15332" stroke="#888888" strokeOpacity="0.26" strokeDasharray="7 7" />
            </svg>
        </BlurFade>
    )
}

export default ReservesCha
