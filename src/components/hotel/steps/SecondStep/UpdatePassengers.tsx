'use client'
import DatePickerInput from '@/components/common/inputs/datePicker/DatePickerInput'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { showToast } from '@/core/toast/toast'
import { IUpdatePassenger } from '@/types/input-type/input-types'
import { passengerValidation } from '@/utils/validations/passenger-validation'
import { IPassenger, useBooking } from '@/utils/zustand/booking'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'

const UpdatePassengers = ({ button, passenger }: { button: ReactNode, passenger: IPassenger }) => {
  const t = useTranslations('hotel.updatePassengers')
  const [gender, setGender] = useState<string>(passenger.gender || "")
  const [birthDate, setBirthDate] = useState<Date>(passenger.birthDate || new Date())
  const { updatePassenger } = useBooking()
  const [isOpen, setIsOpen] = useState(false)

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(passengerValidation)
  })

  const onSubmit = (data: IUpdatePassenger) => {
    if (updatePassenger) {
      updatePassenger({
        firstName: data.firstName,
        lastName: data.lastName,
        nationalId: data.nationalId,
        gender: gender,
        birthDate: birthDate
      })
      showToast("success", t('success'))
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        {button}
      </DialogTrigger>
      <DialogContent onMouseDown={(e) => e.stopPropagation()} className='rounded-2xl flex flex-col gap-8'>
        <DialogHeader>
          <DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} className='flex w-full my-[30px] gap-8 flex-col text-sm'>
              <div className='w-full flex flex-col gap-3 items-start'>
                <Label htmlFor='firstName' className='text-subText'>{t('firstName')}</Label>
                <Input id='firstName' defaultValue={passenger.firstName} {...register("firstName")} className='border border-subText text-subText px-4 py-3 bg-transparent rounded-xl w-full' />
                {errors.firstName && <span className='text-danger text-xs'>{errors.firstName.message}</span>}
              </div>
              <div className='w-full flex flex-col gap-3 items-start'>
                <Label htmlFor='lastName' className='text-subText'>{t('lastName')}</Label>
                <Input id='lastName' defaultValue={passenger.lastName} {...register("lastName")} className='border border-subText text-subText px-4 py-3 bg-transparent rounded-xl w-full' />
                {errors.lastName && <span className='text-danger text-xs'>{errors.lastName.message}</span>}
              </div>
              <div className='w-full flex flex-col gap-3 items-start'>
                <Label htmlFor='nationalId' className='text-subText'>{t('nationalId')}</Label>
                <Input id='nationalId' defaultValue={passenger.nationalId} {...register("nationalId")} className='border border-subText text-subText px-4 py-3 bg-transparent rounded-xl w-full' />
                {errors.nationalId && <span className='text-danger text-xs'>{errors.nationalId.message}</span>}
              </div>
              <div className='w-full flex flex-col items-start'>
                <label className='text-subText mb-2 block'>{t('gender')}</label>
                <select
                  className='border border-subText text-subText px-4 py-3 bg-secondary rounded-xl w-full'
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                >
                  <option value="" disabled>{t('selectGender')}</option>
                  <option value="man">{t('man')}</option>
                  <option value="woman">{t('woman')}</option>
                </select>
              </div>
              <div className='w-full'>
                <DatePickerInput value={birthDate} onChange={(e) => setBirthDate(e?.toDate() || new Date())} label={t('birthDate')} className=' w-full' />
              </div>
              <div className='flex gap-4 flex-row mx-auto justify-center items-center'>
                <DialogClose className='text-sm'>
                  {t('close')}
                </DialogClose>
                <button type='submit' className='bg-primary text-sm text-primary-foreground px-4 py-2 rounded-2xl cursor-pointer w-fit'> {t('edit')} </button>
              </div>
            </form>
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default UpdatePassengers