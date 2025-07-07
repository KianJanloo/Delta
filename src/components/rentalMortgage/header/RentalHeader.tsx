import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl'

const RentalHeader = () => {
    const t = useTranslations('rental.header');
    return (
        <div className='flex gap-2 rtl text-sm items-center'>
            <Link href={'/'}>{t('home')}</Link>
            <ChevronLeft size={16} />
            <div className='text-primary'>{t('rental')}</div>
        </div>
    )
}

export default RentalHeader