/* eslint-disable */

'use client'
import CommonSelect from '@/components/common/inputs/common/CommonSelect'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { X } from 'lucide-react'
import React, { FC, useState } from 'react'
import CommonButton from '@/components/common/buttons/common/CommonButton'
import CommonInput from '@/components/common/inputs/common/CommonInput'
import { useTranslations } from 'next-intl'

interface IFilterModalPayment {
    categories: { label: string, value: string }[],
    handleFilterChange: (key: string, value: any) => void,
    filters: {
        category: string;
        fromPrice: number;
        toPrice: number;
        search: string;
    }
}

const FilterModalPayment: FC<IFilterModalPayment> = ({ categories, filters, handleFilterChange }) => {
    const [open, setOpen] = useState<boolean>(false)
    const t = useTranslations('modals.filterPayment');
    const [priceFrom, setPriceFrom] = useState(filters.fromPrice || "0");
    const [priceTo, setPriceTo] = useState(filters.toPrice || "15000000");
    const [category, setCategory] = useState<string>("")

    const handleFilter = () => {
        if(category && category !== ""){
            handleFilterChange("category", category)
        }
        if(priceTo){
            handleFilterChange("toPrice", priceTo)
        }
        if(priceFrom){
            handleFilterChange("fromPrice", priceFrom)
        }

        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger asChild>
                <div className='cursor-pointer px-4 py-2 rounded-[14px] h-fit flex text-primary-foreground max-md:w-full justify-center bg-primary text-sm hover:scale-[1.02] transition-all'>
                    {t('filters')}
                </div>
            </DialogTrigger>
            <DialogContent onMouseDown={(e) => e.stopPropagation()} className='rounded-2xl py-8 px-6 w-full max-w-[600px]'>
                <DialogTitle>
                    <div className='flex items-center justify-between mb-6'>
                        <h2 className='text-xl font-bold'>{t('filters')}</h2>
                        <CommonButton onclick={() => setOpen(false)} title={t('close')} icon={<X />} classname='border border-danger bg-transparent text-danger' />
                    </div>
                </DialogTitle>

                <div className='w-full mb-6'>
                    <CommonSelect
                        label={t('propertyType')}
                        selectItems={categories}
                        placeholder={t('apartment')}
                        color='text-subText'
                        onValueChange={(val) => setCategory(val)}
                        classname='border-subText py-5 rounded-xl w-full'
                    />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                    <CommonInput
                        value={priceFrom}
                        label={t('minPrice')}
                        placeholder={t('minPricePlaceholder')}
                        color='text-subText'
                        onchange={(e) => setPriceFrom(e.target.value)}
                        classname='border-subText rounded-xl w-full'
                    />
                    <CommonInput
                        value={priceTo}
                        onchange={(e) => setPriceTo(e.target.value)}
                        label={t('maxPrice')}
                        placeholder={t('maxPricePlaceholder')}
                        color='text-subText'
                        classname='border-subText rounded-xl w-full'
                    />
                </div>

                <div className='w-fit mx-auto'>
                    <CommonButton title={t('applyFilter')} onclick={handleFilter} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default FilterModalPayment