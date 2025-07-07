import { Instagram, Linkedin, MessageCircle, TextCursor } from 'lucide-react'
import React from 'react'
import { useTranslations } from 'next-intl'
import { useDirection } from '@/utils/hooks/useDirection'

const FooterInfo = () => {
    const t = useTranslations('common.footerInfo')
    const dir = useDirection()

    return (
        <div dir={dir} className="text-accent-foreground bg-secondary-static py-12 lg:px-16 px-8 rounded-[56px]">
            <h2 className="text-2xl font-extrabold mb-4">{t('platformTitle')}</h2>
            <div className="grid lg:grid-cols-4 gap-8">
                <div>
                    <p className="text-sm leading-7">
                        {t('about')}
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-3">{t('reservationTitle')}</h3>
                    <ul className="text-sm space-y-4">
                        <li>{t('reservationGuide')}</li>
                        <li>{t('registerResidence')}</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-3">{t('customerServiceTitle')}</h3>
                    <ul className="text-sm space-y-4">
                        <li>{t('faqGuest')}</li>
                        <li>{t('faqHost')}</li>
                        <li>{t('howToRegisterResidence')}</li>
                        <li>{t('privacyPolicy')}</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-3">{t('contactTitle')}</h3>
                    <ul className="text-sm space-y-4">
                        <li>{t('phone')}</li>
                        <li>{t('email')}</li>
                        <li>{t('address')}</li>
                    </ul>
                </div>
            </div>
            <div className="mt-10 border-t border-gray-700 pt-6 flex lg:flex-row-reverse flex-col lg:gap-0 gap-4 items-center justify-between">
                <div className="flex gap-4 flex-row-reverse text-xl">
                    <div className='border rounded-2xl p-1.5'><a href="#" aria-label="Whatsapp"> <MessageCircle className='size-[17px]' /></a></div>
                    <div className='border rounded-2xl p-1.5'><a href="#" aria-label="Telegram"> <TextCursor className='size-[17px]' /></a></div>
                    <div className='border rounded-2xl p-1.5'><a href="#" aria-label="Instagram"> <Instagram className='size-[17px]' /></a></div>
                    <div className='text-card bg-card-foreground rounded-2xl p-1.5'><a href="#" aria-label="Linkedin"> <Linkedin className='size-[17px]' /></a></div>
                </div>
                <p className="text-base">{t('copyright')}</p>
            </div>
        </div>
    )
}

export default FooterInfo