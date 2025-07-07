'use client'
import CommonSelect from '@/components/common/inputs/common/CommonSelect'
import CommonModal from '@/components/dashboard/modal/CommonModal'
import { useTranslations } from 'next-intl'
import React from 'react'

const HeaderNotifications = () => {
    const t = useTranslations('dashboardBuyer.notifications')
    return (
        <div className='flex w-full gap-8 items-center max-md:text-start justify-between flex-wrap'>
            <h2 className='text-xl max-lg:text-base'>{t('title')}</h2>
            <div className='flex gap-4 md:w-fit flex-wrap w-full items-end'>
                <CommonSelect
                    label={t('type')}
                    placeholder={t('all')}
                    selectItems={[]}
                    classname='border px-8 border-subText py-5'
                />
                <CommonModal
                    button={
                        <div className="cursor-pointer px-4 py-2 rounded-[14px] flex text-primary-foreground bg-primary">
                            {t('markAllAsRead')}
                        </div>
                    }
                    handleClick={t('confirm')}
                    title={t('confirmMarkAll')}
                />
            </div>
        </div>
    )
}

export default HeaderNotifications