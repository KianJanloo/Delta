/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
import CommonButton from '@/components/common/buttons/common/CommonButton'
import { IHouse } from '@/types/houses-type/house-type'
import { ChevronLeft, Copy, Heart, MapPin, Share, Star, User, Calendar, MessageCircle, Tag } from 'lucide-react'
import Link from 'next/link'
import React, { FC, useState } from 'react'
import { motion } from 'framer-motion'
import { showToast } from '@/core/toast/toast'
import { BlurFade } from '@/components/magicui/blur-fade'
import { useTranslations } from 'next-intl'
import { addFavorite } from '@/utils/service/api/favorites/addFavorite'
import { removeFavorite } from '@/utils/service/api/favorites/removeFavorite'
import { useSession } from 'next-auth/react'

interface IProps {
    house: IHouse
}

const SingleReserveHeader: FC<IProps> = ({ house }) => {
    const t = useTranslations('singleReserve.header');
    const session = useSession()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFavorite, setIsFavorite] = useState(house.isFavorite || false)
    const [favoriteLoading, setFavoriteLoading] = useState(false)

    const handleThumbnailClick = (index: number) => {
        setCurrentIndex(index)
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date)
    }

    const handleFavoriteToggle = async () => {
        const userInfo = (session.data as any)?.userInfo
        if (!userInfo?.id) {
            showToast('warning', t('loginRequired') || 'لطفا ابتدا وارد حساب کاربری خود شوید')
            return
        }

        setFavoriteLoading(true)
        try {
            if (isFavorite) {
                await removeFavorite(Number(house.id))
                setIsFavorite(false)
                showToast('success', t('removedFromFavorites') || 'از علاقه‌مندی‌ها حذف شد')
            } else {
                await addFavorite({
                    house_id: Number(house.id),
                    user_id: Number(userInfo.id)
                })
                setIsFavorite(true)
                showToast('success', t('addedToFavorites') || 'به علاقه‌مندی‌ها اضافه شد')
            }
        } catch (error) {
            showToast('error', t('favoriteError') || 'خطا در تغییر وضعیت علاقه‌مندی')
            console.error('Favorite error:', error)
        } finally {
            setFavoriteLoading(false)
        }
    }

    const handleCopy = async () => {
        if (typeof window === 'undefined') return;

        try {
            await navigator.clipboard.writeText(window.location.href)
            showToast('success', t('copied'), t('close'))
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    }

    const handleShare = async () => {
        if (typeof window === 'undefined') return;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    text: t('shareText'),
                    url: window.location.href,
                })
                showToast('success', t('shareSuccess'), t('close'))
            } catch {
                showToast('error', t('shareError'), t('close'))
            }
        } else {
            console.log(t('noShareSupport'))
        }
    }

    return (
        <div className='flex gap-4 flex-col text-foreground'>
            <div className='flex gap-2 rtl text-sm items-center'>
                <Link href={'/'}>{t('home')}</Link>
                <ChevronLeft size={16} />
                <Link href={'/reserve/reserve-house'}>{t('reserve')}</Link>
                <ChevronLeft size={16} />
                <div className='text-primary'> {house.title} </div>
            </div>
            <div className='flex flex-col gap-4'>
                <div className='flex items-start justify-between gap-4'>
                    <div className='flex-1'>
                        <h2 className='text-[28px] font-bold mb-2'> {house.title} </h2>
                        {house.categories?.name && (
                            <div className='flex items-center gap-2 mb-2'>
                                <Tag size={16} className='text-primary' />
                                <span className='text-sm text-subText bg-secondary-light2 px-3 py-1 rounded-lg'>
                                    {house.categories.name}
                                </span>
                            </div>
                        )}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleFavoriteToggle}
                        disabled={favoriteLoading}
                        className={`p-3 rounded-full transition-colors ${
                            isFavorite 
                                ? 'bg-danger text-white' 
                                : 'bg-secondary-light2 text-subText hover:bg-secondary-light3'
                        } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
                    >
                        <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                    </motion.button>
                </div>

                <div className='flex max-md:flex-wrap justify-between gap-4 items-center'>
                    <div className='flex flex-col gap-2 flex-1'>
                        <p className="flex text-subText items-center gap-2">
                            <MapPin size={16} className='text-primary' />
                            <span>{t('address')}:</span>
                            <span className="text-foreground">
                                {house.address}
                            </span>
                        </p>
                        {house.sellerName && (
                            <p className="flex text-subText items-center gap-2">
                                <User size={16} className='text-primary' />
                                <span>{t('seller') || 'فروشنده'}:</span>
                                <span className="text-foreground">{house.sellerName}</span>
                            </p>
                        )}
                        <div className='flex flex-wrap gap-4 text-sm text-subText'>
                            {house.last_updated && (
                                <div className='flex items-center gap-1'>
                                    <Calendar size={14} />
                                    <span>{t('lastUpdated') || 'آخرین بروزرسانی'}: {formatDate(house.last_updated)}</span>
                                </div>
                            )}
                            {house.num_comments !== undefined && (
                                <div className='flex items-center gap-1'>
                                    <MessageCircle size={14} />
                                    <span>{house.num_comments} {t('comments') || 'نظر'}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='flex gap-4 items-center'>
                        <div className="bg-accent items-center text-white text-sm flex gap-2 px-4 py-2 flex-row-reverse rounded-[12px] shadow-lg">
                            <span className='whitespace-nowrap font-semibold'>{house.rate || 0} {t('star')}</span>
                            <Star size={18} className='fill-current' />
                        </div>
                        <div className='flex gap-2'>
                            <CommonButton 
                                onclick={handleCopy} 
                                classname='bg-secondary-light2 hover:bg-secondary-light3 text-secondary-foreground transition-colors' 
                                icon={<Copy size={18} />} 
                            />
                            <CommonButton 
                                onclick={handleShare} 
                                classname='bg-primary hover:bg-primary/90 text-primary-foreground transition-colors' 
                                icon={<Share size={18} />} 
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex max-2xl:flex-col gap-6 mt-2'>
                <div className='2xl:w-11/12 w-full'>
                    <BlurFade className='w-full h-[444px] bg-secondary-light2 rounded-[40px] overflow-hidden flex items-center justify-center'>
                        <img
                            src={house.photos !== null && house.photos[currentIndex] ? house.photos[currentIndex] : " "}
                            alt={house.title || ' '}
                            className='w-full h-full object-cover rounded-[40px]'
                            loading={currentIndex === 0 ? 'eager' : 'lazy'}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/placeholder-image.png'
                            }}
                        />
                    </BlurFade>
                </div>

                <div className='2xl:w-2/12 w-full flex flex-wrap gap-4 2xl:justify-between items-center'>
                    {house.photos && house.photos.length > 0 ? (
                        house.photos.slice(0, 8).map((photo, index) => (
                            <motion.button
                                whileHover={{ y: -4, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 120, damping: 10 }}
                                key={index}
                                onClick={() => handleThumbnailClick(index)}
                                className={`rounded-[32px] h-[96px] w-[96px] overflow-hidden ${currentIndex === index ? 'ring-2 ring-primary' : ''}`}
                                aria-label={`تصویر ${index + 1}`}
                            >
                                <img
                                    src={photo || " "}
                                    alt={`${house.title} - تصویر ${index + 1}`}
                                    className='w-full h-full object-cover rounded-[32px]'
                                    loading='lazy'
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.src = '/placeholder-image.png'
                                    }}
                                />
                            </motion.button>
                        ))
                    ) : (
                        <div className='rounded-[32px] 2xl:block hidden bg-secondary-light2 h-[96px] w-[96px] pointer-events-none' />
                    )}
                </div>

            </div>
        </div>
    )
}

export default SingleReserveHeader