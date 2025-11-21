import RentalComponent from '@/components/rentalMortgage/Rental'
import React from 'react'

export const metadata = {
  title: 'رهن و اجاره',
  description: 'یافتن املاک اجاره‌ای و اطلاعات وام دلتا.',
};

const RentPage = () => {
  return (
    <div className='mt-[120px]'>
      <RentalComponent />
    </div>
  )
}

export default RentPage
