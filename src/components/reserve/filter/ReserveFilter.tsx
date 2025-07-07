'use client'
import CommonButton from '@/components/common/buttons/common/CommonButton'
import CommonInput from '@/components/common/inputs/common/CommonInput'
import CommonSelect from '@/components/common/inputs/common/CommonSelect'
import { Filter, MapPin, Megaphone } from 'lucide-react'
import React, { FC, useState } from 'react'
import ReserveModalMap from '../map/ReserveModalMap'
import { motion } from 'framer-motion'
import { Label } from '@/components/ui/label'
import CitySelectPopover from '@/components/common/inputs/common/CitySelectPopovar'
import { selectItems } from '@/components/Landing/hero-section/section/SearchBar'
import { useTranslations } from 'next-intl'
import { MarkerType } from '../content/ReserveContent'

interface IReserveFilter {
    setOrder: React.Dispatch<React.SetStateAction<'DESC' | 'ASC'>>
    setSort: React.Dispatch<React.SetStateAction<string>>
    setSearch: React.Dispatch<React.SetStateAction<string>>
    setLocation: React.Dispatch<React.SetStateAction<string>>
    houseLength?: number
    marker: MarkerType | null
    setMarker: React.Dispatch<React.SetStateAction<MarkerType | null>>
}

const ReserveFilter: FC<IReserveFilter> = ({ setOrder, setSort, setSearch, houseLength, setLocation, marker, setMarker }) => {
    const t = useTranslations('reserve.filter');
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [value, setValue] = React.useState("")

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className='bg-secondary-light4 w-full lg:flex-nowrap flex-wrap gap-4 rounded-[24px] px-4 py-3 flex justify-between'>
            <div className='flex lg:flex-row flex-col w-full gap-4'>

                <div className=" w-fit flex-col flex gap-1">
                    <Label className={`text-[13px] w-[150px] whitespace-nowrap flex gap-0.5 min-w-fit text-subText`}>
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
                <CommonInput
                    onchange={(e) => setSearch(e.target.value)}
                    label={t('search')}
                    classname='px-4 py-2 border-subText xl:w-[600px] w-full dark:group-hover:placeholder:text-white placeholder:text-subText dark:group-hover:text-white dark:group-hover:border-white outline-none'
                    color='text-subText dark:group-hover:text-white'
                    placeholder={t('hotelPlaceholder')}
                />

            </div>
            <div className='flex gap-4 justify-center items-center'>
                <div className='px-4 py-2 border lg:mx-0 mx-auto border-card-foreground items-center justify-center rounded-[16px] flex flex-nowrap gap-2 text-sm'>
                    <Megaphone size={20} />
                    <span className='whitespace-nowrap'>{t('count')} : {houseLength} </span>
                </div>
                <CommonButton onclick={() => setIsOpen(true)} icon={<MapPin />} title={t('map')} classname='bg-transparent border-foreground border text-foreground flex xl:hidden' />
                <ReserveModalMap marker={marker} setMarker={setMarker} isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
        </motion.div>
    )
}

export default ReserveFilter