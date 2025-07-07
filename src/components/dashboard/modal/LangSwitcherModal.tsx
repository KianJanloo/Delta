'use client'
import LanguageSwitcher from '@/components/common/header/sections/LangSwitcher'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Settings } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useDirection } from '@/utils/hooks/useDirection'

const LangModal = () => {
    const t = useTranslations('modals.langs');
    const [open, setOpen] = useState<boolean>();
    const dir = useDirection();

    return (
        <Dialog onOpenChange={setOpen} open={open} >
            <DialogTrigger>
                <div className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-md cursor-pointer transition-colors">
                    <Settings size={16} /> {t('changeLanguage')}
                </div>
            </DialogTrigger>
            <DialogContent onMouseDown={(e) => e.stopPropagation()} className='rounded-2xl flex flex-col gap-8 items-center'>
                <DialogHeader className='w-full my-4'>
                    <DialogTitle dir={dir} className='w-full flex justify-between'>
                        <span className='text-lg'>{t('changeLanguageLabel')}</span>
                        <LanguageSwitcher />
                    </DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default LangModal