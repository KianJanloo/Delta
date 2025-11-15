import AboutComponent from '@/components/about/AboutComponent'
import { Metadata } from 'next'
import React from 'react'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "درباره ما | دلتا",
  description: "درباره تیم دلتا و خدمات ما در زمینه املاک و رزرو خانه",
  keywords: ["درباره ما", "تیم دلتا", "املاک دلتا", "خدمات دلتا"]
}

const AboutPage = () => {
  return (
    <div className='mt-[100px]'>
      <div className='px-8 mb-8'>
        <div className='flex gap-2 rtl text-sm items-center'>
          <Link href={'/'} className='hover:text-primary transition-colors'>خانه</Link>
          <ChevronLeft size={16} className='text-subText' />
          <div className='text-primary font-semibold'>درباره ما</div>
        </div>
      </div>
      <AboutComponent />
    </div>
  )
}

export default AboutPage
