/* eslint-disable */
import CommonInput from '@/components/common/inputs/common/CommonInput'
import FilterModalPayment from '@/components/dashboard/modal/FilterModalPayment'
import { Category } from '@/types/categories-type/categories-type'
import { useTranslations } from 'next-intl'
import React from 'react'

interface FavoritesHeaderProps {
    categories: Category[],
    handleFilterChange: (key: string, value: any) => void,
    filters: {
        category: string;
        fromPrice: number;
        toPrice: number;
        search: string;
    }
}

const FavoritesHeader: React.FC<FavoritesHeaderProps> = ({ categories, handleFilterChange, filters }) => {
    const t = useTranslations('dashboardBuyer.favoritesPage');
    const selectItems = categories.map((category) => ({
        label: category.name,
        value: category.name || category.id?.toString()
    }))

    return (
        <div className='flex w-full max-md:flex-col gap-4 justify-between items-start md:items-center'>
            <h2>{t('title')}</h2>
            <div className='flex gap-4 max-md:flex-col md:w-fit w-full items-end'>
                <div className='relative flex items-center max-md:w-full'>
                    <CommonInput
                        onchange={(e) => handleFilterChange("search", e.target.value)}
                        classname='text-subText placeholder:subText border-subText md:w-[400px] w-full'
                        color='text-subText'
                        label={t('searchLabel')}
                        placeholder={t('searchPlaceholder')}
                    />
                </div>
                <FilterModalPayment categories={selectItems} filters={filters} handleFilterChange={handleFilterChange} />
            </div>
        </div>
    )
}

export default FavoritesHeader