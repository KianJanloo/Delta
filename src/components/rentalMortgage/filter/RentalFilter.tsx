'use client'
import CitySelectPopover from '@/components/common/inputs/common/CitySelectPopovar'
import CommonInput from '@/components/common/inputs/common/CommonInput'
import CommonSelect from '@/components/common/inputs/common/CommonSelect'
import { selectItems } from '@/components/Landing/hero-section/section/SearchBar'
import { Label } from '@/components/ui/label'
import { Coins, Filter, House, Megaphone } from 'lucide-react'
import React, { FC, useState } from 'react'
import { useTranslations } from 'next-intl'
import { setParams } from '@/utils/helper/set-params/setParams'

interface IReserveFilter {
    setOrder: React.Dispatch<React.SetStateAction<'DESC' | 'ASC'>>
    setSort: React.Dispatch<React.SetStateAction<string>>
    setSearch: React.Dispatch<React.SetStateAction<string>>
    setLocation: React.Dispatch<React.SetStateAction<string>>
    setPropertyType: React.Dispatch<React.SetStateAction<string>>
    setTransactionType: React.Dispatch<React.SetStateAction<string>>
    houseLength?: number
}

const RentalFilter: FC<IReserveFilter> = ({ setOrder, setSort, setSearch, houseLength, setLocation, setTransactionType }) => {
    const t = useTranslations('rental.filter');
    const [value, setValue] = useState('')

    return (
        <div className='w-full px-4 py-2 flex 2xl:flex-row flex-col max-2xl:gap-8 justify-between rounded-2xl bg-secondary-light2'>
            <div className='flex xl:flex-row flex-col gap-4'>
                <div className="w-fit max-xl:w-full flex-col flex gap-1">
                    <Label className={`min-w-[150px] text-[13px] flex gap-0.5 text-subText`}>
                        <span>{t('destination')}</span>
                        <span> : </span>
                    </Label>
                    <CitySelectPopover
                        value={value}
                        onChange={(val) => {
                            setValue(val);
                            setLocation(val === t('all') ? "" : val);
                        }}
                        items={selectItems}
                        placeholder={t('cityPlaceholder')}
                    />
                </div>
                <CommonSelect
                    onValueChange={(value => {
                        if (value === 'last_updated') {
                            setSort('last_updated')
                            setOrder('DESC')
                        }
                        if (value === 'price_low') {
                            setSort('price')
                            setOrder('ASC')
                        }
                        if (value === 'rate') {
                            setSort('rate')
                            setOrder('DESC')
                        }
                    })}
                    placeholder={t('latest')}
                    icon={<Filter size={16} className='text-subText' />}
                    selectItems={[
                        { label: t('latest'), value: 'last_updated' },
                        { label: t('cheapest'), value: 'price_low' },
                        { label: t('popular'), value: 'rate' },
                    ]}
                    color='text-subText dark:group-hover:text-white'
                    label={t('sortBy')}
                    classname='px-4 py-5 border-subText w-full dark:group-hover:text-white dark:group-hover:border-white outline-none'
                />
                <CommonSelect
                    onValueChange={(value) => {
                        setParams("propertyType", value === "all" ? "" : value)
                    }}
                    placeholder={t('apartment')}
                    icon={<House size={16} className='text-subText' />}
                    selectItems={[
                        { label: t('apartment'), value: "apartment" },
                        { label: t('villa'), value: "villa" },
                        { label: t('rural'), value: "house" },
                        { label: t('all'), value: 'all' },
                    ]}
                    color='text-subText dark:group-hover:text-white'
                    label={t('propertyType')}
                    classname='px-4 py-5 border-subText w-full dark:group-hover:text-white dark:group-hover:border-white outline-none'
                />
                <CommonSelect
                    onValueChange={(value => {
                        setTransactionType(value === 'all' ? "" : value)
                    })}
                    placeholder={t('mortgageAndRental')}
                    icon={<Coins size={16} className='text-subText' />}
                    selectItems={[
                        { label: t('mortgage'), value: 'mortgage' },
                        { label: t('rental'), value: 'rental' },
                        { label: t('directPurchase'), value: 'direct_purchase' },
                        { label: t('all'), value: "all" },
                    ]}
                    color='text-subText dark:group-hover:text-white'
                    label={t('transactionType')}
                    classname='px-4 py-5 border-subText w-full dark:group-hover:text-white dark:group-hover:border-white outline-none'
                />
                <CommonInput
                    onchange={(e) => setSearch(e.target.value)}
                    label={t('search')}
                    classname='px-4 py-2 border-subText xl:w-[400px] w-full dark:group-hover:placeholder:text-white placeholder:text-subText dark:group-hover:text-white dark:group-hover:border-white outline-none'
                    color='text-subText dark:group-hover:text-white'
                    placeholder={t('hotelPlaceholder')}
                />
            </div>
            <div className='px-4 py-2 border md:mx-0 mx-auto border-card-foreground items-center justify-center rounded-[16px] flex flex-nowrap gap-2 text-sm'>
                <Megaphone size={20} />
                <span className='whitespace-nowrap'>{t('count')} : {houseLength || 0} </span>
            </div>
        </div>
    )
}

export default RentalFilter