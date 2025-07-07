import React from 'react'
import HeaderPayments from './header/HeaderPayments'
import ContentPayment from './content/ContentPayments'
import { BlurFade } from '@/components/magicui/blur-fade'

const ComponentPayments = () => {
    return (
        <BlurFade className='px-4 bg-subBg rounded-xl py-4 flex flex-col gap-8'>
            <HeaderPayments />
            <svg width="100%" height="2" viewBox="0 0 1131 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="-0.00439453" y1="0.881836" x2="1131" y2="0.881836" stroke="#888888" strokeOpacity="0.26" strokeDasharray="7 7" />
            </svg>
            <ContentPayment />
        </BlurFade>
    )
}

export default ComponentPayments
