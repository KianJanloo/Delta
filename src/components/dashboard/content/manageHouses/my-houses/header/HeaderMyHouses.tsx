/* eslint-disable */

'use client'
import CommonButton from '@/components/common/buttons/common/CommonButton'
import FilterModal from '@/components/dashboard/modal/FilterModal'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'

const HeaderMyHouses = ({ handleFilterChange, filters }: { handleFilterChange: (key: string, value: any) => void, filters: {
    sort: string;
    transaction_type: string;
    fromPrice: number;
    toPrice: number;
    search: string;
} }) => {
    const [search, setSearch] = useState<string>("")
    const t = useTranslations('dashboardSeller.myHouses')
    return (
        <div className='flex w-full max-md:flex-col gap-4 justify-between items-start md:items-center'>
            <h2>{t('title')}</h2>
            <div className='flex gap-4 max-md:flex-col md:w-fit w-full'>
                <FilterModal filters={filters} handleFilterChange={handleFilterChange} />
                <div className='relative flex items-center max-md:w-full'>
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} className='bg-subBg2 max-md:w-full px-4 py-2 rounded-2xl text-subText placeholder:text-subText text-sm md:min-w-[300px]' placeholder={t('searchPlaceholder')} />
                    <CommonButton
                        onclick={() => handleFilterChange("search", search)}
                        classname='absolute left-0'
                        icon={<Search size={20} />}
                    />
                </div>
            </div>
        </div>
    )
}

export default HeaderMyHouses