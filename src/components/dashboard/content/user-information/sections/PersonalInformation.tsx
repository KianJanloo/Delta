/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { informationValidation } from '@/utils/validations/information-validation'
import { IEditProfile, IProfile } from '@/types/profile-type/profile-type'
import { useSession } from 'next-auth/react'
import { editProfile } from '@/utils/service/api/profile/editProfile'
import { showToast } from '@/core/toast/toast'
import { getProfileById } from '@/utils/service/api/profile/getProfileById'

const PersonalInformation = () => {
  const t = useTranslations('dashboardBuyer.profile');
  const { data: session } = useSession() as any

  const [profile, setProfile] = useState<IProfile | null>(null)

  const getProfile = useCallback(async () => {
    if (session?.userInfo?.id) {
      const profile = await getProfileById(session?.userInfo?.id);
      setProfile(profile);
    }
  }, [session?.userInfo?.id])

  useEffect(() => {
    getProfile()
  }, [getProfile])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(informationValidation),
    defaultValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      email: profile?.email || '',
      phoneNumber: profile?.phoneNumber || ''
    }
  })

  const handleReset = useCallback(() => {
    reset({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      email: profile?.email || "",
      phoneNumber: profile?.phoneNumber || "",
    });
  }, [reset, profile])

  useEffect(() => {
    if (profile) {
      handleReset()
    }
  }, [profile, handleReset]);

  const onSubmit = async (data: IEditProfile) => {
    const response = await editProfile(session?.userInfo?.id, data)
    if (response) {
      showToast("success", "اطلاعات شما با موفقیت ثبت شد")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex w-full max-xl:flex-col flex-row max-xl:gap-8'>
      <div className='flex flex-col gap-2 w-1/2 max-xl:w-full'>
        <h2 className='text-xl font-bold'>{t('title')}</h2>
        <span className='text-subText'>{t('subtitle')}</span>
        <div className='flex gap-4'>
          <Button type='button' onClick={handleReset} className='bg-subBg2 w-fit rounded-2xl mt-[10px]' variant={"scale"} >{t('cancel')}</Button>
          <Button type='submit' className='bg-primary w-fit text-primary-foreground rounded-2xl mt-[10px]' variant={"scale"} >{t('applyChanges')}</Button>
        </div>
      </div>
      <div className='w-1/2 max-xl:w-full flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='firstName' className='text-subText'>{t('firstName')}</Label>
          <Input
            {...register('firstName')}
            className='text-subText border-subText max-w-[450px] placeholder:text-subText px-4 py-2 border rounded-xl bg-transparent'
            placeholder={t('firstNamePlaceholder')}
            name='firstName'
            id='firstName'
          />
          {errors.firstName && <span className='text-danger text-xs'>{errors.firstName.message}</span>}
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='lastName' className='text-subText'>{t('lastName')}</Label>
          <Input
            {...register('lastName')}
            className='text-subText border-subText max-w-[450px] placeholder:text-subText px-4 py-2 border rounded-xl bg-transparent'
            placeholder={t('lastNamePlaceholder')}
            name='lastName'
            id='lastName'
          />
          {errors.lastName && <span className='text-danger text-xs'>{errors.lastName.message}</span>}
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='email' className='text-subText'>{t('email')}</Label>
          <Input
            {...register('email')}
            className='text-subText border-subText max-w-[450px] placeholder:text-subText px-4 py-2 border rounded-xl bg-transparent'
            placeholder={t('emailPlaceholder')}
            name='email'
            id='email'
          />
          {errors.email && <span className='text-danger text-xs'>{errors.email.message}</span>}
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='phoneNumber' className='text-subText'>{t('phoneNumber')}</Label>
          <Input
            {...register('phoneNumber')}
            className='text-subText border-subText max-w-[450px] placeholder:text-subText px-4 py-2 border rounded-xl bg-transparent'
            placeholder={t('phoneNumberPlaceholder')}
            name='phoneNumber'
            id='phoneNumber'
          />
          {errors.phoneNumber && <span className='text-danger text-xs'>{errors.phoneNumber.message}</span>}
        </div>
      </div>
    </form>
  )
}

export default PersonalInformation