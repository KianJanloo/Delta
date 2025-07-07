/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { securityValidation } from '@/utils/validations/security-validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { ISecurity } from '@/types/security-type/security-type'
import { editProfile } from '@/utils/service/api/profile/editProfile'
import { useSession } from 'next-auth/react'
import { showToast } from '@/core/toast/toast'

const Security = () => {
    const t = useTranslations('dashboardBuyer.profile3');
    const { data: session } = useSession() as any
    
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(securityValidation)
    })

    const onSubmit = async (data: ISecurity) => {
        if(session?.password === data.previousPassword) {
            const response = await editProfile(session?.userInfo?.id, data)
            if (response) {
                showToast("success", "رمز عبور با موفقیت تغییر کرد")
            }
        } else {
            showToast("error", "رمز عبور قبلی صحیح نیست")
        }
    }

    useEffect(() => {
        reset()
    }, [reset])

    return (
        <form onSubmit={handleSubmit(onSubmit)}     className='flex w-full max-xl:flex-col flex-row max-xl:gap-8'>
            <div className='flex flex-col gap-2 w-1/2 max-xl:w-full'>
                <h2 className='text-xl font-bold'>{t('title')}</h2>
                <span className='text-subText'>{t('subtitle')}</span>
                <div className='flex gap-4'>
                    <Button type='button' onClick={() => reset()} className='bg-subBg2 w-fit rounded-2xl mt-[10px]' variant={"scale"} >{t('cancel')}</Button>
                    <Button type='submit' className='bg-primary w-fit text-primary-foreground rounded-2xl mt-[10px]' variant={"scale"} >{t('applyChanges')}</Button>
                </div>
            </div>
            <div className='w-1/2 max-xl:w-full flex flex-col gap-6'>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor='previousPassword' className='text-subText'>{t('previousPassword')}</Label>
                    <Input
                        {...register('previousPassword')}
                        className='text-subText border-subText max-w-[450px] placeholder:text-subText px-4 py-2 border rounded-xl bg-transparent'
                        placeholder={t('previousPasswordPlaceholder')}
                        name='previousPassword'
                        id='previousPassword'
                        type='password'
                    />
                    {errors.previousPassword && <span className='text-danger text-xs'>{errors.previousPassword.message}</span>}
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor='newPassword' className='text-subText'>{t('newPassword')}</Label>
                    <Input
                        {...register('password')}
                        className='text-subText border-subText max-w-[450px] placeholder:text-subText px-4 py-2 border rounded-xl bg-transparent'
                        placeholder={t('newPasswordPlaceholder')}
                        name='password'
                        id='password'
                        type='password'
                    />
                    {errors.password && <span className='text-danger text-xs'>{errors.password.message}</span>}
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor='repeatPassword' className='text-subText'>{t('repeatPassword')}</Label>
                    <Input
                        {...register('confirmPassword')}
                        className='text-subText border-subText max-w-[450px] placeholder:text-subText px-4 py-2 border rounded-xl bg-transparent'
                        placeholder={t('repeatPasswordPlaceholder')}
                        name='confirmPassword'
                        id='confirmPassword'
                        type='password'
                    />
                    {errors.confirmPassword && <span className='text-danger text-xs'>{errors.confirmPassword.message}</span>}
                </div>
            </div>
        </form>
    )
}

export default Security