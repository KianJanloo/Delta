import CommonInput from '@/components/common/inputs/common/CommonInput'
import React, { FC } from 'react'
import { useTranslations } from 'next-intl'

interface IProps {
    setMinRent: React.Dispatch<React.SetStateAction<number | "">>
    setMaxRent: React.Dispatch<React.SetStateAction<number | "">>
    setMinMortgage: React.Dispatch<React.SetStateAction<number | "">>
    setMaxMortgage: React.Dispatch<React.SetStateAction<number | "">>
    setMinArea: React.Dispatch<React.SetStateAction<number | "">>
    setMaxArea: React.Dispatch<React.SetStateAction<number | "">>
}

const RentalFilterCap: FC<IProps> = ({
    setMaxArea, setMaxMortgage, setMaxRent, setMinArea, setMinMortgage, setMinRent
}) => {
    const t = useTranslations('rental.filterCap');
    return (
        <div className='flex xl:flex-row flex-col gap-4 border-b py-8 border-muted items-end'>
            <div className='flex gap-4 max-xl:w-full'>
                <div className='w-1/2'>
                    <CommonInput
                        onchange={(e) => setMinMortgage(e.target.valueAsNumber)}
                        placeholder={t('minMortgagePlaceholder')}
                        type='number'
                        label={t('minMortgage')}
                        classname='px-4 py-3 border-subText w-full dark:group-hover:text-white dark:group-hover:border-white text-foreground outline-none'
                    />
                </div>
                <div className='w-1/2'>
                    <CommonInput
                        onchange={(e) => setMaxMortgage(e.target.valueAsNumber)}
                        placeholder={t('maxMortgagePlaceholder')}
                        type='number'
                        label={t('maxMortgage')}
                        classname='px-4 py-3 border-subText w-full dark:group-hover:text-white dark:group-hover:border-white text-foreground outline-none'
                    /></div>
            </div>
            <div className='h-[30px] max-xl:hidden border relative bottom-2 border-subText'></div>
            <div className='flex gap-4 max-xl:w-full'>
                <div className='w-1/2'>
                    <CommonInput
                        onchange={(e) => setMinRent(e.target.valueAsNumber)}
                        placeholder={t('minRentPlaceholder')}
                        type='number'
                        label={t('minRent')}
                        classname='px-4 py-3 border-subText w-full dark:group-hover:text-white dark:group-hover:border-white text-foreground outline-none'
                    />
                </div>
                <div className='w-1/2'>
                    <CommonInput
                        onchange={(e) => setMaxRent(e.target.valueAsNumber)}
                        placeholder={t('maxRentPlaceholder')}
                        type='number'
                        label={t('maxRent')}
                        classname='px-4 py-3 border-subText w-full dark:group-hover:text-white dark:group-hover:border-white text-foreground outline-none'
                    />
                </div>
            </div>
            <div className='h-[30px] max-xl:hidden border relative bottom-2 border-subText'></div>
            <div className='flex gap-4 max-xl:w-full'>
                <div className='w-1/2'>
                    <CommonInput
                        onchange={(e) => setMinArea(e.target.valueAsNumber)}
                        placeholder={t('minAreaPlaceholder')}
                        type='number'
                        label={t('minArea')}
                        classname='px-4 py-3 border-subText w-full dark:group-hover:text-white dark:group-hover:border-white text-foreground outline-none'
                    />
                </div>
                <div className='w-1/2'>
                    <CommonInput
                        onchange={(e) => setMaxArea(e.target.valueAsNumber)}
                        placeholder={t('maxAreaPlaceholder')}
                        type='number'
                        label={t('maxArea')}
                        classname='px-4 py-3 border-subText w-full dark:group-hover:text-white dark:group-hover:border-white text-foreground outline-none'
                    /></div>
            </div>
        </div>
    )
}

export default RentalFilterCap