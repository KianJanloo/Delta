'use client'
import CommonButton from '@/components/common/buttons/common/CommonButton'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Bell, X } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useDirection } from '@/utils/hooks/useDirection'

const NotifModal = () => {
    const t = useTranslations('modals.notif');
    const [open, setOpen] = useState<boolean>();
    const dir = useDirection()

    return (
        <Dialog onOpenChange={setOpen} open={open} >
            <DialogTrigger>
                <div className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-md cursor-pointer transition-colors">
                    <Bell size={16} /> {t('notifSettings')}
                </div>
            </DialogTrigger>
            <DialogContent dir={dir} onMouseDown={(e) => e.stopPropagation()} className='rounded-2xl flex flex-col gap-8 items-center'>
                <DialogHeader className='flex justify-between flex-row w-full items-center my-4'>
                    <DialogTitle className='text-xl'>
                        {t('notifSettings')}
                    </DialogTitle>
                    <DialogDescription>
                        <CommonButton onclick={() => setOpen(false)} title={t('close')} icon={<X />} classname='border border-danger bg-transparent text-danger' />
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='w-full'>
                    <div className='flex flex-col gap-4 w-full mx-auto justify-center items-center'>
                        <div className='flex w-full justify-between text-lg items-center'>
                            {t('reserveNotif')}
                            <Switch />
                        </div>
                        <div className='flex w-full justify-between text-lg items-center'>
                            {t('paymentNotif')}
                            <Switch />
                        </div>
                        <div className='flex w-full justify-between text-lg items-center'>
                            {t('discountNotif')}
                            <Switch />
                        </div>
                        <div className='flex w-full justify-between text-lg items-center'>
                            {t('systemNotif')}
                            <Switch />
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default NotifModal