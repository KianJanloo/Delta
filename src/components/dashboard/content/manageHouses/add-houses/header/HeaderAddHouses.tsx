import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl'

const HeaderAddHouses = () => {
    const t = useTranslations('dashboardSeller.addHouses.header')
    
    return (
        <div className='flex justify-between w-full'>
            <h2>{t('title')}</h2>
            <Link href={"/dashboard/seller/manage-houses/my-houses"} className='flex items-center gap-2 text-accent-blue cursor-pointer'>
                <p className='text-sm'>{t('myHousesList')}</p>
                <svg width="48" height="16" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9.73205C1.66666 8.96225 1.66667 7.03775 3 6.26795L9 2.80385C10.3333 2.03405 12 2.9963 12 4.5359L12 11.4641C12 13.0037 10.3333 13.966 9 13.1962L3 9.73205Z" fill="#0059FF" />
                    <path d="M24.25 9.29904C23.25 8.72169 23.25 7.27831 24.25 6.70096L28.75 4.10289C29.75 3.52554 31 4.24722 31 5.40192L31 10.5981C31 11.7528 29.75 12.4745 28.75 11.8971L24.25 9.29904Z" fill="#0059FF" fillOpacity="0.5" />
                    <path d="M41.5 8.86602C40.8333 8.48112 40.8333 7.51887 41.5 7.13397L44.5 5.40192C45.1667 5.01702 46 5.49815 46 6.26795L46 9.73205C46 10.5019 45.1667 10.983 44.5 10.5981L41.5 8.86602Z" fill="#0059FF" fillOpacity="0.25" />
                </svg>
            </Link>
        </div>
    )
}

export default HeaderAddHouses