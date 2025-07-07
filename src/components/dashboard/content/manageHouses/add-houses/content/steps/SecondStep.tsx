/* eslint-disable */

'use client'
import CommonSelect from '@/components/common/inputs/common/CommonSelect'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { useTranslations } from 'next-intl'
import CommonButton from '@/components/common/buttons/common/CommonButton'
import { zodResolver } from '@hookform/resolvers/zod'
import { houseSchema } from '@/utils/validations/house-validation'
import { useForm } from 'react-hook-form'
import { useHouseStore } from '@/utils/zustand/house'
import { ICreateHouse } from '@/types/houses-type/house-type'

const SecondStep = ({ setStep }: { setStep: Dispatch<SetStateAction<number>> }) => {
    const t = useTranslations('dashboardSeller.secondStep')
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(houseSchema.partial())
    })
    const { setData, data: house } = useHouseStore();
    const [tags, setTags] = useState<string[]>(house.tags || []);
    const [input, setInput] = useState('');

    const onSubmit = (values: Partial<ICreateHouse>) => {
        const data = {
            rooms: values.rooms,
            bathrooms: values.bathrooms,
            parking: values.parking,
            yard_type: values.yard_type,
            tags: tags,
        }
        setData(data);
        setStep(3);
    }

    const selectItems = [
        { label: t('balcony'), value: "balcony" }
    ]

    const handleKeyDown = (e: any) => {
        if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
            e.preventDefault();
            const newTag = input.trim()
            if (!tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setInput('');
        } else if (e.key === 'Backspace' && !input && tags.length) {
            setTags(tags.slice(0, -1));
        }
    };

    const removeTag = (indexToRemove: any) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col gap-8'>
            <div className='flex w-full max-lg:flex-col justify-between gap-8 items-center'>
                <div className='w-1/2 max-lg:w-full flex flex-col gap-2 relative'>
                    <Label htmlFor='rooms' className='text-subText text-sm'>{t('rooms')}</Label>
                    <Input defaultValue={house.rooms} {...register("rooms")} name='rooms' id='rooms' placeholder={t('roomsPlaceholder')} className='w-full px-4 py-2 text-sm bg-transparent border rounded-xl text-subText border-subText' />
                    <div className='absolute left-4 top-9 text-muted'>{t('roomUnit')}</div>
                    {errors.rooms && <span className='text-xs text-danger'> {errors.rooms.message} </span>}
                </div>

                <div className='w-1/2 max-lg:w-full flex flex-col gap-2 relative'>
                    <Label htmlFor='bathrooms' className='text-subText text-sm'>{t('bathrooms')}</Label>
                    <Input defaultValue={house.bathrooms} {...register("bathrooms")} name='bathrooms' id='bathrooms' placeholder={t('bathroomsPlaceholder')} className='w-full text-sm px-4 placeholder:text-subText py-2 bg-transparent border rounded-xl text-subText border-subText' />
                    <div className='absolute left-4 top-9 text-muted'>{t('bathroomUnit')}</div>
                    {errors.bathrooms && <span className='text-xs text-danger'> {errors.bathrooms.message} </span>}
                </div>
            </div>
            <div className='flex w-full max-lg:flex-col justify-between gap-8 items-center'>
                <div className='w-1/2 max-lg:w-full flex flex-col gap-2 relative'>
                    <Label htmlFor='parking' className='text-subText text-sm'>{t('parking')}</Label>
                    <Input defaultValue={house.parking} {...register("parking")} name='parking' id='parking' placeholder={t('parkingPlaceholder')} className='w-full px-4 py-2 text-sm bg-transparent border rounded-xl text-subText border-subText' />
                    <div className='absolute left-4 top-9 text-muted'>{t('parkingUnit')}</div>
                    {errors.parking && <span className='text-xs text-danger'> {errors.parking.message} </span>}
                </div>

                <div className='w-1/2 max-lg:w-full flex flex-col gap-2 relative'>
                    <Label htmlFor='parking' className='text-subText text-sm'>{t('yardType')}</Label>
                    <Input defaultValue={house.yard_type} {...register("yard_type")} name='yard_type' id='yard_type' placeholder="نوع حیاط" className='w-full px-4 py-2 text-sm bg-transparent border rounded-xl text-subText border-subText' />
                    {errors.yard_type && <span className='text-xs text-danger'> {errors.yard_type.message} </span>}
                </div>
            </div>
            <div className="w-full flex flex-col gap-2">
                <Label htmlFor="tags" className="text-subText text-sm">
                    {t('tags')}
                </Label>
                <div className="flex flex-wrap gap-2 px-4 py-2 border border-subText rounded-xl">
                    {tags.map((tag, index) => (
                        <div
                            key={index}
                            className="flex items-center bg-primary text-primary-foreground gap-1 px-2 py-1 rounded-lg text-sm"
                        >
                            {tag}
                            <button
                                type="button"
                                className="ml-1 text-primary-foreground"
                                onClick={() => removeTag(index)}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                    <input
                        id="tags"
                        name="tags"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-grow bg-transparent text-subText text-sm focus:outline-none"
                        placeholder={t('tagsPlaceholder')}
                    />
                </div>
            </div>
            <div className="w-full flex justify-end gap-4">
                <CommonButton
                    type="button"
                    title="مرحله قبل"
                    classname="w-fit flex-row-reverse bg-subText text-[#000000]"
                    icon={<ChevronRight size={16} />}
                    onclick={() => setStep(prev => prev - 1)}
                />
                <CommonButton
                    type="submit"
                    title="مرحله بعد"
                    classname="w-fit"
                    icon={<ChevronLeft size={16} />}
                />
            </div>
        </form>
    )
}

export default SecondStep