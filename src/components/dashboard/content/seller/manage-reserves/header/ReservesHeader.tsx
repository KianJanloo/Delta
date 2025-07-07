'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import FilterModalReserve from '@/components/dashboard/modal/FilterModalReserve'
import CommonButton from '@/components/common/buttons/common/CommonButton'

interface ReservesHeaderProps {
    filters: {
        startDate: Date | null;
        endDate: Date | null;
        status: string | null;
    };
    setFilters: React.Dispatch<React.SetStateAction<{
        startDate: Date | null;
        endDate: Date | null;
        status: string | null;
    }>>;
    onApplyFilter: () => void;
    onClearFilters: () => void;
}

const ReservesHeader: React.FC<ReservesHeaderProps> = ({ filters, setFilters, onApplyFilter, onClearFilters }) => {
    const t = useTranslations('dashboardSeller.reserves')

    return (
        <div className='flex w-full max-md:flex-col gap-4 justify-between items-start md:items-center'>
            <h2 className='text-xl'>{t('title')}</h2>
            <div className='flex gap-4 max-md:flex-col md:w-fit w-full items-end'>
                <FilterModalReserve filters={filters} setFilters={setFilters} onApply={onApplyFilter} />
                
                <CommonButton
                    title={'حذف فیلتر'}
                    onclick={() => onClearFilters()}
                    classname='bg-red-500 hover:bg-red-600 text-white rounded-xl px-4 py-2'
                />
            </div>
        </div>
    )
}

export default ReservesHeader
