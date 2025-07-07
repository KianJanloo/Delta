
'use client'
import React, { useState } from 'react'
import { fetchApi } from '@/core/interceptore/fetchApi'
import { ChevronLeft, Loader } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { schemaContactValidation } from '@/utils/validations/contact-validation'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { showToast } from '@/core/toast/toast'
import CommonButton from '../common/buttons/common/CommonButton'
import { useTranslations } from 'next-intl'
import { useDirection } from '@/utils/hooks/useDirection'

type FormValues = {
    name: string
    title: string
    message: string
}

const ContactForm = () => {
    const t = useTranslations('contactUs.form');
    const dir = useDirection()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schemaContactValidation)
    })

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true)
        const postData = {
            title: data.title,
            message: data.message
        }

        try {
            const response = await fetchApi.post('/contact-us', postData)
            if (response) {
                showToast('success', t('successTitle'), t('close'), t('successMessage'))
            }
            setIsLoading(false)
            reset()
        } catch{
            setIsLoading(false)
            showToast('error', t('errorTitle'), t('close'), t('errorMessage'))
        }
    }

    return (
        <form className={`flex flex-col gap-6 p-[16px]`} onSubmit={handleSubmit(onSubmit)}>
            <div className='flex gap-4 md:flex-row flex-col w-full'>
                <div dir={dir} className="flex flex-col gap-1 md:w-1/2 w-full group">
                    <Label htmlFor="name" className="dark:text-subText text-foreground dark:group-hover:text-white text-sm">
                        {t('name')}
                    </Label>
                    <Input
                        id="name"
                        {...register('name')}
                        className="border w-full outline-none dark:border-subText border-foreground bg-transparent dark:group-hover:border-white dark:group-hover:placeholder:text-white px-4 py-2 dark:placeholder:text-subText placeholder:text-foreground rounded-2xl outline-0"
                        placeholder={t('namePlaceholder')}
                    />
                    {errors.name && <p className='text-danger text-sm font-semibold'>{errors.name.message} </p>}
                </div>
                <div dir={dir} className="flex flex-col gap-1 md:w-1/2 w-full group">
                    <Label htmlFor="title" className="dark:text-subText text-foreground dark:group-hover:text-white text-sm">
                        {t('title')}
                    </Label>
                    <Input
                        id="title"
                        {...register('title')}
                        className="border w-full outline-none dark:border-subText border-foreground bg-transparent dark:group-hover:border-white dark:group-hover:placeholder:text-white px-4 py-2 dark:placeholder:text-subText placeholder:text-foreground rounded-2xl outline-0"
                        placeholder={t('titlePlaceholder')}
                    />
                    {errors.title && <p className='text-danger text-sm font-semibold'>{errors.title.message} </p>}
                </div>
            </div>
            <div dir={dir} className="flex flex-col gap-1 group">
                <Label htmlFor="message" className="dark:text-subText text-foreground dark:group-hover:text-white text-sm">
                    {t('message')}
                </Label>
                <Textarea
                    id="message"
                    {...register('message')}
                    className="border h-[109px] outline-none dark:border-subText border-foreground bg-transparent dark:group-hover:border-white dark:group-hover:placeholder:text-white px-4 py-2 dark:placeholder:text-subText placeholder:text-foreground rounded-2xl outline-0"
                    placeholder={t('messagePlaceholder')}
                />
                {errors.message && <p className='text-danger text-sm font-semibold'>{errors.message.message} </p>}
            </div>
            <CommonButton type="submit" title={isLoading ? t('loading') : t('submit')}
                icon={isLoading ? <Loader /> : <ChevronLeft size={16} />}
                classname="w-full text-primary-foreground"
                disabled={isLoading}
            />
        </form>
    )
}

export default ContactForm