import React from 'react'
import HeaderAddHouses from './header/HeaderAddHouses'
import ContentAddHouses from './content/ContentAddHouses'
import { BlurFade } from '@/components/magicui/blur-fade'

const ComponentAddHouses = () => {
    return (
        <BlurFade className='flex flex-col gap-6 bg-subBg rounded-2xl px-4 py-4'>
            <HeaderAddHouses />
            <svg width="100%" height="2" viewBox="0 0 1131 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="-0.00439453" y1="0.881836" x2="1131" y2="0.881836" stroke="#888888" strokeOpacity="0.26" strokeDasharray="7 7" />
            </svg>
            <ContentAddHouses />
        </BlurFade>
    )
}

export default ComponentAddHouses
