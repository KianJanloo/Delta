/* eslint-disable */

'use client'
import { BlurFade } from '@/components/magicui/blur-fade';
import { User } from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { PieChart, Pie, Cell } from 'recharts';
import { useTranslations } from 'next-intl'
import { getProfileById } from '@/utils/service/api/profile/getProfileById';
import { IProfile } from '@/types/profile-type/profile-type';
import { useSession } from 'next-auth/react';
import { calculateProfileCompletion } from '@/utils/helper/completeProfile/completeProfile';
import { convertToJalaliString } from '@/utils/helper/shamsiDate/ShamsDate';

const COLORS = ['fill-primary', 'fill-subBg2'];

const StatusProfile = () => {
    const t = useTranslations('dashboardSeller.dashboard.statusProfile')
    const { data: session } = useSession() as any;

    const [profile, setProfile] = useState<IProfile | null>(null);
    const [completionPercentage, setCompletionPercentage] = useState(0);

    const getProfile = useCallback(async () => {
        if (session?.userInfo?.id) {
            const profile = await getProfileById(session?.userInfo?.id);
            setProfile(profile);
            setCompletionPercentage(calculateProfileCompletion(profile));
        }
    }, [session])

    const data = [
        { name: 'completed', value: completionPercentage },
        { name: 'remaining', value: 100 - completionPercentage },
    ];

    useEffect(() => {
        getProfile()
    }, [getProfile]);

    return (
        <BlurFade delay={0.70} className='w-1/2 max-lg:w-full min-h-full rounded-[12px] bg-subBg flex gap-4 px-4 py-4 flex-col'>
            <div className='flex justify-between w-full items-center flex-wrap gap-4'>
                <div className='flex gap-2 w-fit items-center'>
                    <User size={24} />
                    <span className='text-base font-bold'>{t('title')}</span>
                </div>
                <Link href={"/dashboard/profile"} className='w-fit cursor-pointer gap-8 items-center flex justify-between'>
                    <span className='text-muted'>{t('edit')}</span>
                    <svg width="63" height="18" viewBox="0 0 63 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.7677 10.6382C2.2526 9.91281 2.25259 7.75581 3.76769 7.03041L12.8127 2.69983C14.1402 2.06424 15.6764 3.03189 15.6764 4.50373L15.6764 13.1649C15.6764 14.6367 14.1402 15.6044 12.8127 14.9688L3.7677 10.6382Z" fill="#7A7A7A" />
                        <path d="M31.566 10.1869C30.4297 9.64286 30.4297 8.02511 31.566 7.48106L38.3498 4.23313C39.3454 3.75643 40.4975 4.48217 40.4975 5.58605L40.4975 12.0819C40.4975 13.1858 39.3454 13.9115 38.3498 13.4348L31.566 10.1869Z" fill="#7A7A7A" fillOpacity="0.5" />
                        <path d="M54.1378 9.73561C53.3802 9.37291 53.3802 8.29441 54.1378 7.93171L58.6603 5.76642C59.324 5.44862 60.0921 5.93245 60.0921 6.66837L60.0921 10.9989C60.0921 11.7349 59.324 12.2187 58.6603 11.9009L54.1378 9.73561Z" fill="#7A7A7A" fillOpacity="0.25" />
                    </svg>
                </Link>
            </div>
            <svg width="100%" height="2" viewBox="0 0 547 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line y1="-0.5" x2="100%" y2="-0.5" transform="matrix(1 0.000108856 -7.8105e-05 1 0 1)" stroke="#888888" strokeOpacity="0.26" strokeDasharray="7 7" />
            </svg>
            <div className='w-full flex gap-4 justify-between'>
                <div className='flex flex-col justify-between gap-8'>
                    <div className='flex flex-col gap-4'>
                        <h2 className='font-bold text-xl'> {completionPercentage}% </h2>
                        <span className='max-w-[310px] text-sm'>
                             برای اینکه بازدید خوبی داشته باشید، پروفایل شما باید حداقل {100 - completionPercentage}% تکمیل شده باشد. 
                        </span>
                    </div>
                    {profile?.updatedAt ? (
                        <span className='text-muted text-xs'>
                            آخرین تغییرات در {convertToJalaliString(profile.updatedAt)}
                        </span>
                    ) : null}
                </div>
                <div className='mxa-auto w-1/3 h-full fleax justify-center items-center'>
                    <PieChart width={100} height={100}>
                        <Pie
                            data={data}
                            innerRadius={35}
                            outerRadius={50}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={index} className={`${COLORS[index]}`} />
                            ))}
                        </Pie>
                    </PieChart>
                </div>
            </div>

        </BlurFade>
    )
}

export default StatusProfile