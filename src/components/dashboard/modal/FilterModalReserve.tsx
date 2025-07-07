'use client'
import CommonSelect from '@/components/common/inputs/common/CommonSelect'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar, X } from 'lucide-react'
import React, { useState } from 'react'
import CommonButton from '@/components/common/buttons/common/CommonButton'
import DatePickerInput from '@/components/common/inputs/datePicker/DatePickerInput'
import { useTranslations } from 'next-intl'

interface FilterModalReserveProps {
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
    onApply: () => void;
}

const FilterModalReserve: React.FC<FilterModalReserveProps> = ({ filters, setFilters, onApply }) => {
    const [open, setOpen] = useState<boolean>(false)
    const t = useTranslations('modals.filterReserve');

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                    <DatePickerInput
                        label="تاریخ رزرو"
                        icon={<Calendar size={16} />}
                        value={filters.startDate}
                        onChange={(dateObj) =>
                            setFilters((prev) => ({ ...prev, startDate: dateObj ? dateObj.toDate() : null }))
                        }
                    />
                </div>

                <div className='w-full'>
                    <CommonSelect
                        label={t('reserveStatus')}
                        selectItems={[
                            { label: t('confirmed'), value: 'confirmed' },
                            { label: "در حال انتظار", value: 'pending' },
                            { label: t('canceled'), value: 'canceled' },
                        ]}
                        placeholder={t('confirmed')}
                        value={filters.status || ""}
                        onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                        color='text-subText'
                        classname='border-subText py-5 rounded-xl w-full'
                    />
                </div>

                <div className='w-fit mx-auto'>
                    <CommonButton
                        title={t('applyFilter')}
                        onclick={() => {
                            onApply()
                            setOpen(false)
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default FilterModalReserve
