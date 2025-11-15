'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import SingleReserveHeader from './header/SingleReserveHeader'
import { getHouseById } from '@/utils/service/api/houses-api'
import { IHouse } from '@/types/houses-type/house-type'
import { useParams } from 'next/navigation'
import SingleReserveBooking from './booking/SingleReserveBooking'
import SingleReserveTab from './tab/SingleReserveTab'
import SingleReserveFooter from './footer/SingleReserveFooter'
import { Bath, Bed, Car } from 'lucide-react'
import { TFacilities } from '@/types/facilites-type'
import { Loader } from '../common/Loader'
import { useTranslations } from 'next-intl'
import { showToast } from '@/core/toast/toast'

const SingleReserveComponent = () => {
    const t = useTranslations('singleReserve');
    const [house, setHouse] = useState<IHouse | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const params = useParams()
    const id = params?.id as string

    const fetchHouse = useCallback(async () => {
        if (!id) return;
        setIsLoading(true)
        setError(null)
        try {
            const houseData = await getHouseById(id) as IHouse
            setHouse(houseData)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t('errorMessage') || 'خطا در دریافت اطلاعات'
            setError(errorMessage)
            showToast('error', t('errorTitle') || 'خطا', undefined, errorMessage)
            console.error('Error fetching house:', error)
        } finally {
            setIsLoading(false)
        }
    }, [id, t])

    useEffect(() => {
        fetchHouse()
    }, [fetchHouse])

    const facilities: TFacilities = useMemo(() => {
        const fac: TFacilities = []
        if (house?.parking && house.parking > 0) {
            fac.push({ title: <Car size={24} />, content: t('parking') })
        }
        if (house?.rooms && house.rooms > 0) {
            fac.push({ title: <Bed size={24} />, content: t('rooms', { count: house.rooms }) })
        }
        if (house?.bathrooms && house.bathrooms > 0) {
            fac.push({ title: <Bath size={24} />, content: t('bathroom') })
        }
        if (house?.yard_type) {
            fac.push({ title: t('yard'), content: house.yard_type })
        }
        if (house?.capacity) {
            fac.push({ 
                title: t('capacity'), 
                content: house.capacity > 0 ? t('capacityValue', { count: house.capacity }) : t('noCapacity') 
            })
        }
        return fac
    }, [house, t])

    if (isLoading) {
        return (
            <div className='px-8 mt-[120px] flex items-center justify-center min-h-[60vh]'>
                <Loader />
            </div>
        )
    }

    if (error || !house) {
        return (
            <div className='px-8 mt-[120px] flex flex-col items-center justify-center min-h-[60vh] gap-4'>
                <h2 className='text-2xl font-semibold text-danger'>
                    {t('errorTitle') || 'خطا در دریافت اطلاعات'}
                </h2>
                <p className='text-subText text-center'>
                    {error || t('errorMessage') || 'متاسفانه اطلاعات ملک یافت نشد'}
                </p>
            </div>
        )
    }

    return (
        <div className='px-8 flex flex-col gap-16'>
            <SingleReserveHeader house={house} />
            <div className='flex xl:flex-row flex-col-reverse gap-12 justify-between'>
                <SingleReserveTab 
                    id={id} 
                    photos={house.photos !== null && house.photos.length > 0 ? house.photos : [" "]} 
                    caption={house.caption || t('noInfo')} 
                    facilities={facilities} 
                    defaultValue='about' 
                />
                <SingleReserveBooking 
                    house={house} 
                    price={house.price} 
                    discountedPrice={Number(house.discounted_price)} 
                />
            </div>
            <SingleReserveFooter />
        </div>
    )
}

export default SingleReserveComponent