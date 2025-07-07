import { IAboutBox } from '@/types/contact-us-type/contact-us-types'
import React, { FC } from 'react'
import { BlurFade } from '../magicui/blur-fade'

const AboutBox: FC<IAboutBox> = ({ icon, title }) => {
  return (
    <BlurFade className='bg-secondary-light text-subText flex flex-row-reverse rounded-[16px] w-fit px-6 py-2 gap-4'>
      {title}
      <div className='min-size-[20px]'> {icon} </div>
    </BlurFade>
  )
}

export default AboutBox
