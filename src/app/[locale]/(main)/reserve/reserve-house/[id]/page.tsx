import SingleReserveComponent from '@/components/single-reserve/SingleReserveComponent'
import React from 'react'
import { Metadata } from 'next'
import { getHouseById } from '@/utils/service/api/houses-api'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  try {
    const house = await getHouseById(id)
    return {
      title: `${house.title} | رزرو خانه | دلتا`,
      description: house.caption || `رزرو ${house.title} در ${house.address}. بهترین قیمت و امکانات کامل.`,
      keywords: ['رزرو', 'خانه', 'اقامتگاه', house.title, house.address],
      openGraph: {
        title: house.title,
        description: house.caption || `رزرو ${house.title}`,
        images: house.photos && house.photos.length > 0 ? [house.photos[0]] : [],
        type: 'website',
      },
    }
  } catch {
    return {
      title: 'رزرو خانه | دلتا',
      description: 'رزرو آنلاین خانه و اقامتگاه',
    }
  }
}

const SingleReserve = () => {
  return (
    <div className='mt-[120px]'>
      <SingleReserveComponent />
    </div>
  )
}

export default SingleReserve
