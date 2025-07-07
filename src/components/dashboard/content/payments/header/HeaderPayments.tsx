import CommonSelect from '@/components/common/inputs/common/CommonSelect'
import { useTranslations } from 'next-intl'
import React from 'react'

const HeaderPayments = () => {
    const t = useTranslations('dashboardBuyer.payments')
    return (
        <div className='flex w-full max-md:flex-col gap-4 justify-between items-start md:items-center'>
            <h2 className='text-xl max-lg:text-base'>{t('title')}</h2>
            <div className='flex gap-4 md:w-fit w-full'>
                <CommonSelect
                    label={t('paymentStatus')}
                    placeholder={t('paymentStatusPlaceholder')}
                    selectItems={[]}
                    classname='border px-8 border-subText py-5'
                />
                <CommonSelect
                    label={t('transactionType')}
                    placeholder={t('transactionTypePlaceholder')}
                    selectItems={[]}
                    classname='border px-8 border-subText py-5'
                />
            </div>
        </div>
    )
}

export default HeaderPayments