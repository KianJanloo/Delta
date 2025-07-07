import AboutComponent from '@/components/about/AboutComponent'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: " درباره ما ",
  keywords: [" تیم ما "]
}

const AboutPage = () => {
  return (
    <div className='mt-[120px]'>
      <AboutComponent />
    </div>
  )
}

export default AboutPage
