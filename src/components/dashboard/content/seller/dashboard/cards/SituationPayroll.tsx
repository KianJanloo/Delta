import CommonButton from '@/components/common/buttons/common/CommonButton'
import { BlurFade } from '@/components/magicui/blur-fade'
import { CreditCard } from 'lucide-react'
import React from 'react'
import { useTranslations } from 'next-intl'

const SituationPayroll = () => {
    const t = useTranslations('dashboardSeller.dashboard.situationPayroll')
    return (
        <BlurFade delay={0.50} className='w-1/2 max-lg:w-full min-h-full rounded-[12px] bg-subBg flex gap-4 px-4 py-4 flex-col'>
            <div className='flex justify-between w-full items-center'>
                <div className='flex gap-2 w-fit items-center'>
                    <CreditCard size={24} />
                    <span className='text-base font-bold'>{t('title')}</span>
                </div>
            </div>
            <svg width="100%" height="2" viewBox="0 0 547 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line y1="-0.5" x2="100%" y2="-0.5" transform="matrix(1 0.000108856 -7.8105e-05 1 0 1)" stroke="#888888" strokeOpacity="0.26" strokeDasharray="7 7" />
            </svg>
            <div className='flex flex-col w-full justify-between gap-8 h-fit'>
                <div className='w-full flex justify-between'>
                    <div className='flex gap-2 items-center'>
                        <div className='bg-primary rounded-full w-[16px] h-[16px]' />
                        <span className='font-semibold'>{t('currentMonthIncome')}</span>
                    </div>
                    <CommonButton title={`115,000,000 ${t('currency')}`} />
                </div>
                <div className='w-full flex justify-between'>
                    <div className='flex gap-2 items-center'>
                        <div className='bg-subBg2 rounded-full w-[16px] h-[16px]' />
                        <span className='font-semibold'>{t('lastMonthIncome')}</span>
                    </div>
                    <CommonButton classname='bg-subBg2 text-foreground' title={`195,000,000 ${t('currency')}`} />
                </div>
            </div>
        </BlurFade>
    )
}

export default SituationPayroll