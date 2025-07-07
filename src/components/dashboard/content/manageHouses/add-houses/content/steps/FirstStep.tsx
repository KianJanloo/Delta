'use client'
import CommonSelect from '@/components/common/inputs/common/CommonSelect'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { houseSchema } from '@/utils/validations/house-validation'
import { useHouseStore } from '@/utils/zustand/house'
import { ICreateHouseValues } from '@/types/houses-type/house-type'
import CommonButton from '@/components/common/buttons/common/CommonButton'
import { ChevronLeft } from 'lucide-react'
import { getCategories } from '@/utils/service/api/categories'
import { Category } from '@/types/categories-type/categories-type'
import { createCategory } from '@/utils/service/api/categories/createCategory'

const FirstStep = ({ setStep }: { setStep: Dispatch<SetStateAction<number>> }) => {
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(houseSchema.partial())
    })

    const { setData, data: house } = useHouseStore();
    const [categoryData, setCategoryData] = useState<Category | null>(
        house.categories
            ? { name: house.categories.name, id: house.categories.id?.toString() }
            : null
    )
    const [transaction_type, setTransaction_type] = useState<string | null>(house.transaction_type || null)
    const t = useTranslations('dashboardSeller.firstStep')
    const selectItems = [
        { label: t('direct_purchase'), value: "direct_purchase" },
        { label: t('reservation'), value: "reservation" },
        { label: t('rental'), value: "rental" },
        { label: t('mortgage'), value: "mortgage" },
    ]

    const handleCategory = async (val: string) => {
        const category = await getCategories(val);
        if(category.data.length > 0){
            setCategoryData(category.data[0])
        }
        else{
            if(val){
                const category = await createCategory({ name: val });
                setCategoryData(category)
            }
        }
    }

    const onSubmit = (values: Partial<ICreateHouseValues>) => {
        const data = {
            title: values.title,
            capacity: values.capacity,
            transaction_type: transaction_type || "direct_purchase",
            price: values.price,
            caption: values.caption,
            categories: {
                id: Number(categoryData?.id),
                name: categoryData?.name || "مسکونی"
            },
        }
        setData(data);
        setStep(1);
    }

    const handleTransactionTypePlaceHolder = () => {
        if(transaction_type === "direct_purchase"){ return " فروش " }
        if(transaction_type === "reservation"){ return " رزرو " }
        if(transaction_type === "rental"){ return " اجاره " }
        if(transaction_type === "mortgage"){ return " رهن " }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-8 w-full'>
            <div className='flex max-lg:flex-col w-full justify-between gap-8'>
                <div className='w-1/2 max-lg:w-full flex flex-col gap-2'>
                    <Label htmlFor='title' className='text-subText'>{t('houseName')}</Label>
                    <Input defaultValue={house.title} {...register("title")} name='title' id='title' placeholder={t('houseNamePlaceholder')} className='w-full px-4 py-2 text-sm bg-transparent border rounded-xl text-subText border-subText' />
                    {errors.title && <span className='text-xs text-danger'> {errors.title.message} </span>}
                </div>
                <div className='w-1/2 max-lg:w-full flex flex-col gap-2'>
                    <Label htmlFor='capacity' className='text-subText'>{t('capacity')}</Label>
                    <Input defaultValue={house.capacity} {...register("capacity")} name='capacity' placeholder={t('capacityPlaceholder')} id='capacity' className='w-full text-sm px-4 py-2 bg-transparent border rounded-xl text-subText border-subText' />
                    {errors.capacity && <span className='text-xs text-danger'> {errors.capacity.message} </span>}
                </div>
            </div>
            <div className='flex max-lg:flex-col w-full justify-between gap-8'>
                <div className='w-1/2 max-lg:w-full flex flex-col gap-2'>
                    <CommonSelect
                        onValueChange={(val) => setTransaction_type(val)}
                        selectItems={selectItems}
                        placeholder={handleTransactionTypePlaceHolder() || 'لطفا یک دسته بندی را انتخاب کنید'}
                        classname='text-subText placeholder:text-subText rounded-xl py-5 border border-subText w-full'
                        color='text-subText'
                        label={t('dealType')}
                    />
                    {!transaction_type && transaction_type === null && <span className='text-xs text-danger'> نوع ملک خود رو انتخاب نمایید. </span>}
                </div>
                <div className='w-1/2 max-lg:w-full flex flex-col gap-2'>
                    <Label htmlFor='price' className='text-subText'>{t('price')}</Label>
                    <Input defaultValue={house.price} {...register("price")} name='price' placeholder={t('pricePlaceholder')} id='price' className='w-full text-sm px-4 py-2 bg-transparent border rounded-xl text-subText border-subText' />
                    {errors.price && <span className='text-xs text-danger'> {errors.price.message} </span>}
                </div>
            </div>
            <div className='flex max-lg:flex-col w-full justify-between gap-8 items-center'>
                <div className='w-1/2 max-lg:w-full flex flex-col gap-2'>
                    <Label htmlFor='category' className='text-subText'>{t('type')}</Label>
                    <Input defaultValue={house.categories?.name} onChange={async (e) => {
                        await handleCategory(e.target.value)
                    }} name='category' placeholder={t('typePlaceholder')} id='category' className='w-full px-4 py-2 text-sm bg-transparent border rounded-xl text-subText border-subText' />
                    {errors.category && <span className='text-xs text-danger'> {errors.category.message} </span>}
                </div>
                <svg width="21" height="14" viewBox="0 0 21 14" fill='none' xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 5H9V1.43484C9 1.26397 8.79958 1.17179 8.66984 1.28299L2 7L8.66984 12.717C8.79958 12.8282 9 12.736 9 12.5652V9H21" className='stroke-foreground' strokeWidth="2" />
                </svg>
                <div className='w-1/2 max-lg:w-full flex flex-col gap-2'>
                    <Label htmlFor='subtype' className='text-subText'>{t('subtype')}</Label>
                    <Input name='subtype' placeholder={t('subtypePlaceholder')} id='subtype' className='w-full text-sm px-4 py-2 bg-transparent border rounded-xl text-subText border-subText' />
                </div>
            </div>
            <div className='w-full max-lg:w-full flex flex-col gap-2'>
                <Label htmlFor='caption' className='text-subText'>{t('description')}</Label>
                <Textarea defaultValue={house.caption} {...register("caption")} name='caption' placeholder={t('descriptionPlaceholder')} id='caption' className='w-full h-[244] rounded-xl border border-subText text-subText' />
                {errors.caption && <span className='text-xs text-danger'> {errors.caption.message} </span>}
            </div>
            <div className='w-full flex justify-end'>
                <CommonButton type='submit' title={" مرحله بعد "} classname='w-fit' icon={<ChevronLeft size={16} />} />
            </div>
        </form>
    )
}

export default FirstStep