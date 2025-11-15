import ReserveComponent from '@/components/reserve/ReserveComponent'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'رزرو خانه و اقامتگاه | دلتا',
  description: 'رزرو آنلاین خانه، ویلا و اقامتگاه در سراسر ایران. جستجو و رزرو آسان با بهترین قیمت‌ها و امکانات کامل.',
  keywords: ['رزرو', 'خانه', 'اجاره', 'اقامت', 'رزرو آنلاین', 'رزرو خانه', 'ایران', 'ویلا', 'اقامتگاه', 'رزرو ویلا'],
  openGraph: {
    title: 'رزرو خانه و اقامتگاه | دلتا',
    description: 'رزرو آنلاین خانه، ویلا و اقامتگاه در سراسر ایران',
    type: 'website',
  },
};

const ReserveHouse = () => {
  return (
    <ReserveComponent />    
  )
}

export default ReserveHouse
