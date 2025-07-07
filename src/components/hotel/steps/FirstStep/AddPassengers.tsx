'use client'
import React, { FC, useState } from 'react'
import CommonSelect from '@/components/common/inputs/common/CommonSelect'
import DatePickerInput from '@/components/common/inputs/datePicker/DatePickerInput'
import { Clock, UserPlus, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import CommonButton from '@/components/common/buttons/common/CommonButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { passengerValidation } from '@/utils/validations/passenger-validation'
import { IPassenger } from '@/utils/zustand/booking'
import { IAddPassenger } from '@/types/booking-type/booking-type'
import { showToast } from '@/core/toast/toast'

const AddPassengers: FC<IAddPassenger> = ({ addPassenger, book }) => {
    const t = useTranslations('hotel.first');
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(passengerValidation)
    })

    const [gender, setGender] = useState<string>("")
    const [birthDate, setBirthDate] = useState<Date>(new Date())

    const onSubmit = (data: IPassenger) => {
        const passenger = {
            nationalId: data.nationalId,
            firstName: data.firstName,
            lastName: data.lastName,
            gender: gender,
            birthDate: birthDate
        }
        if(addPassenger){
            addPassenger(passenger);
        }
        showToast("success", " مسافر با موفقیت اضافه شد ")
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full bg-secondary-light2 px-2 py-2 gap-8 rounded-2xl flex flex-col'>
            <div className='w-full bg-subBg2 rounded-2xl flex-wrap gap-4 px-4 py-2 flex justify-between'>
                <div className='flex gap-3 items-center'>
                    <Users size={20} />
                    <span>{t('passengerInfo')}</span>
                </div>
                <div className='flex text-primary gap-3 items-center'>
                    <Clock size={20} />
                    <span>{t('selectPreviousPassengers')}</span>
                </div>
            </div>
            <div className='w-full gap-4 max-lg:flex-col flex justify-around px-4'>
                <div className='w-1/5 max-lg:w-full flex flex-col gap-2 text-subText'>
                    <Label htmlFor='firstName' > {t('firstName')} </Label>
                    <Input id='firstName' {...register("firstName")} className='text-subText border bg-transparent w-full placeholder:text-subText border-subText px-4 py-3 rounded-2xl' placeholder={t('firstNamePlaceholder')} />
                    {errors.firstName && <span className='text-danger text-xs'>{errors.firstName.message}</span>}
                </div>
                <div className='w-1/5 max-lg:w-full flex flex-col gap-2 text-subText'>
                    <Label htmlFor='lastName' > {t('lastName')} </Label>
                    <Input id='lastName' {...register("lastName")} className='text-subText border bg-transparent w-full placeholder:text-subText border-subText px-4 py-3 rounded-2xl' />
                    {errors.lastName && <span className='text-danger text-xs'>{errors.lastName.message}</span>}
                </div>
                <div className='w-1/5 max-lg:w-full'>
                    <CommonSelect selectItems={[
                        { label: t('male'), value: "man" },
                        { label: t('female'), value: "woman" },
                    ]} placeholder={t('genderPlaceholder')} onValueChange={(value) => setGender(value)} label={t('gender')} classname='text-subText w-full py-6 placeholder:text-subText border-subText' color='text-subText' />
                </div>
                <div className='w-1/5 max-lg:w-full flex flex-col gap-2 text-subText'>
                    <Label htmlFor='nationalId' > {t('nationalId')} </Label>
                    <Input id='nationalId' {...register("nationalId")} className='text-subText border bg-transparent w-full placeholder:text-subText border-subText px-4 py-3 rounded-2xl' {...register('nationalId')} />
                    {errors.nationalId && <span className='text-danger text-xs'>{errors.nationalId.message}</span>}
                </div>
                <div className='w-1/5 max-lg:w-full'>
                    <DatePickerInput onChange={(e) => setBirthDate(e?.toDate() || new Date())} label={t('birthDate')} className=' w-full' />
                </div>
            </div>
            <svg width="" height="5" className='mx-4' viewBox="0 0 1330 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1329 1L1.00004 1" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round" strokeDasharray="7 7" />
            </svg>
            <div className='w-full justify-between flex-wrap gap-4 items-center flex px-4 pb-2'>
                <div className='flex gap-4'>
                    {book?.passengers?.map((passenger, idx) => (
                        <CommonButton type='button' classname='cursor-auto' key={idx} title={passenger.firstName + " " + passenger.lastName} />
                    ))}
                </div>
                <CommonButton type='submit' title={t('addPassenger')} icon={<UserPlus size={16} />} classname='bg-transparent flex-row-reverse border-primary border w-fit text-primary' />
            </div>
        </form>
    )
}

export default AddPassengers
