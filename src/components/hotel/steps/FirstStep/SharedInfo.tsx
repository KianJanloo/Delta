import CommonButton from '@/components/common/buttons/common/CommonButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showToast } from '@/core/toast/toast';
import { IShared, ISharedInfo } from '@/types/booking-type/booking-type';
import { sharedValidation } from '@/utils/validations/shared-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, Users } from 'lucide-react'
import { useTranslations } from 'next-intl';
import React, { FC } from 'react'
import { useForm } from 'react-hook-form';

const SharedInfo: FC<ISharedInfo> = ({ setSharedMobile, setSharedEmail, book }) => {
    const t = useTranslations('hotel.first');

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(sharedValidation)
    })

    const onSubmit = (data: IShared) => {
        if (setSharedEmail && setSharedMobile) {
            setSharedMobile(data.mobile);
            setSharedEmail(data.email)
        }
        showToast("success", " اطلاعات با موفقیت ثبت شد ")
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full bg-secondary-light2 px-2 py-2 gap-8 rounded-2xl flex flex-col'>
            <div className='w-full bg-subBg2 rounded-2xl px-4 py-2 flex justify-between'>
                <div className='flex gap-3 items-center'>
                    <Users size={20} />
                    <span>
                        {t('sendTicketToOther')}
                        <span className='text-primary'> {t('sendTicketDesc')} </span>
                    </span>
                </div>
            </div>
            <div className='w-full justify-between items-end flex-wrap gap-8 flex px-4 pb-2'>
                <div className='flex gap-4 max-md:flex-col'>
                    <div className='flex flex-col gap-2 text-subText'>
                        <Label htmlFor='nationalId' > {t('phoneNumber')} </Label>
                        <Input defaultValue={book.sharedMobile || ""} id='nationalId' {...register("mobile")} className='text-subText border bg-transparent w-full placeholder:text-subText border-subText px-4 py-3 rounded-2xl' />
                        {errors.mobile && <span className='text-danger text-xs'>{errors.mobile.message}</span>}
                    </div>
                    <div className='flex flex-col gap-2 text-subText'>
                        <Label htmlFor='nationalId' > {t('email')} </Label>
                        <Input defaultValue={book.sharedEmail || ""} id='nationalId' {...register("email")} className='text-subText border bg-transparent w-full placeholder:text-subText border-subText px-4 py-3 rounded-2xl' />
                        {errors.email && <span className='text-danger text-xs'>{errors.email.message}</span>}
                    </div>
                </div>
                <CommonButton title={" ثبت اطلاعات "} icon={<UserPlus size={16} />} classname='bg-transparent cl flex-row-reverse border-primary border w-fit text-primary' />
            </div>
        </form>
    )
}

export default SharedInfo
