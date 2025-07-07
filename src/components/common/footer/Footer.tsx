'use client'
import { PhoneCall } from 'lucide-react'
import React from 'react'
import FooterInfo from './footer-info/FooterInfo'
import Person from '@/assets/FooterPicture.png'
import DeltaLogo from '@/assets/delta-logo.png'
import Image from 'next/image'
import FooterForm from './footer-form/FooterForm'
import { useTranslations } from 'next-intl'
import useClearPathname from '@/utils/helper/clearPathname/clearPathname'

const Footer = () => {
    const pathname = useClearPathname()
    const t = useTranslations('common.footer')

    if (pathname.includes("/dashboard")) return null;

    return (
        <div className='bg-primary text-primary-foreground  w-full md:rounded-2xl'>
            <div className='xl:flex hidden'>
                <div className='bg-primary w-4/12 px-8 py-6 rounded-2xl'>
                    <div className='bg-secondary text-card-foreground flex flex-row-reverse gap-3 w-fit px-4 py-2 rounded-2xl'>
                        <PhoneCall className='w-[20px]' />
                        <span>{t('phone')}</span>
                    </div>
                </div>
                <div
                    className={`
                        bg-secondary w-11/12 dark:flex hidden justify-end relative rounded-br-[10px]
                    `}
                >
                    <Image alt="" src={DeltaLogo} />
                </div>
            </div>
            <div className='bg-secondary w-full max-md:dark:flex max-md:hidden justify-end md:hidden rounded'>
                <Image alt='' className='' src={DeltaLogo} />
            </div>
            <div className='py-6 px-8 relative'>
                <div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row w-fit items-center gap-4 justify-end">
                            <span className="xl:text-base text-sm">{t('alwaysWithYou')}</span>
                            <div className='flex gap-1 justify-center items-center'>
                                <svg width="48" height="17" viewBox="0 0 48 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M45 10.1598C46.3333 9.38998 46.3333 7.46548 45 6.69568L39 3.23158C37.6667 2.46178 36 3.42403 36 4.96363L36 11.8918C36 13.4314 37.6667 14.3937 39 13.6239L45 10.1598Z" fill="#363636" />
                                    <path d="M23.75 9.72677C24.75 9.14942 24.75 7.70605 23.75 7.1287L19.25 4.53062C18.25 3.95327 17 4.67496 17 5.82966L17 11.0258C17 12.1805 18.25 12.9022 19.25 12.3248L23.75 9.72677Z" fill="#363636" fillOpacity="0.5" />
                                    <path d="M6.5 9.29376C7.16667 8.90886 7.16667 7.94661 6.5 7.56171L3.5 5.82966C2.83333 5.44476 2 5.92588 2 6.69568L2 10.1598C2 10.9296 2.83333 11.4107 3.5 11.0258L6.5 9.29376Z" fill="#363636" fillOpacity="0.25" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="xl:text-[32px] font-semibold text-xl tracking-tight">
                            {t('available247')}
                        </h2>
                        <p className="xl:text-[20px] text-base tracking-tighter">
                            {t('teamDescription')}
                        </p>
                    </div>
                    <FooterForm classname='xl:absolute xl:top-[250px] xl:my-0 my-10' />
                </div>
                <div>
                    <div className='flex flex-col items-end'>
                        <Image className='grayscale-[100] relative left-[40px] xl:block hidden' alt='' src={Person} width={524} height={40} />
                        <FooterInfo />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Footer