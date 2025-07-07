/* eslint-disable */
'use client'

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Info, X, MapPin, Calendar, Bed, Car, Bath, Trees } from 'lucide-react'
import React, { useState } from 'react'
import CommonButton from '@/components/common/buttons/common/CommonButton'
import { SplitNumber } from '@/utils/helper/spliter/SplitNumber'
import PaymentsModalReserves from './PaymentsModalReserves'
import PassengersModal from './PassengersModal'
import { useTranslations } from 'next-intl'

const DetailReserveModal = () => {
    const [open, setOpen] = useState<boolean>(false)
    const t = useTranslations('modals.detailReserve');

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className='px-4 py-1 flex gap-2 rounded-xl justify-end flex-row-reverse cursor-pointer hover:bg-subBg2'>
                    {t('details')} <Info size={16} />
                </div>
            </DialogTrigger>
            <DialogContent onMouseDown={(e) => e.stopPropagation()} className='rounded-2xl py-8 px-6 w-full max-w-[1050px]'>
                <DialogTitle>
                    <div className='flex items-center justify-between mb-6'>
                        <h2 className='text-xl font-bold'>{t('hotelName')}</h2>
                        <CommonButton
                            onclick={() => setOpen(false)}
                            title={t('close')}
                            icon={<X />}
                            classname='border border-danger bg-transparent text-danger'
                        />
                    </div>
                </DialogTitle>

                <div className='overflow-y-auto overflow-x-hidden'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

                        <div className='flex flex-col gap-4 justify-between'>
                            <img src={"  "} alt={t('imageAlt')} className='w-full max-md:h-[150px] h-[300px] bg-muted rounded-xl flex items-center justify-center text-muted-foreground' />
                            <div className='flex flex-col gap-4 text-sm text-muted-foreground'>
                                <div className='flex items-center gap-2 truncate'><MapPin size={16} /> {t('address')}</div>
                                <div className='flex gap-4 items-center flex-wrap text-subText'>
                                    <div className='flex gap-2'>
                                        <Bed size={16} />
                                        <span>{t('bedrooms')}</span>
                                    </div>
                                    |
                                    <div className='flex gap-2'>
                                        <Car size={16} />
                                        <span>{t('parking')}</span>
                                    </div>
                                    |
                                    <div className='flex gap-2'>
                                        <Bath size={16} />
                                        <span>{t('bathrooms')}</span>
                                    </div>
                                    |
                                    <div className='flex gap-2'>
                                        <Trees size={16} />
                                        <span>{t('yard')}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='bg-subBg2 px-4 py-2 rounded-xl flex justify-between gap-4 flex-wrap'>
                                <h2 className='text-subText'>{t('purchasePrice')}</h2>
                                <span className='text-subText'> {SplitNumber(15000000)}{t('currency')} </span>
                            </div>
                        </div>

                        <div className='flex flex-col gap-4 text-right'>
                            <p className='text-sm leading-7 text-muted-foreground max-md:truncate text-justify'>
                                {t('description')}
                            </p>
                            <div className='text-xs flex gap-2 text-muted-foreground'>
                                <Calendar size={16} />
                                {t('reserveDate')}: <span className='font-semibold'>12 مرداد - 1401 / 12:33</span>
                            </div>
                            <div className='flex gap-4 items-center'>
                                <h2 className='text-subText whitespace-nowrap'>{t('tags')}</h2>
                                <div className='flex flex-wrap gap-2 mt-2 text-sm'>
                                    <span className='px-3 py-1 rounded-full bg-primary text-primary-foreground'>{t('free')}</span>
                                    <span className='px-3 py-1 rounded-full bg-primary text-primary-foreground'>{t('confirmed')}</span>
                                    <span className='px-3 py-1 rounded-full bg-primary text-primary-foreground'>{t('paid')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-6 flex justify-end gap-4'>
                    <PassengersModal />
                    <PaymentsModalReserves />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DetailReserveModal