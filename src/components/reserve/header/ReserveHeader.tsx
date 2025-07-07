import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl'

const ReserveHeader = () => {
  const tHeader = useTranslations('reserve.header');
  return (
    <div className='flex gap-2 rtl text-sm items-center'>
      <Link href={'/'}>{tHeader('home')}</Link>
      <ChevronLeft size={16} />
      <Link className='text-primary' href={'/reserve/reserve-house'}>{tHeader('reserve')}</Link>
    </div>
  )
}

export default ReserveHeader