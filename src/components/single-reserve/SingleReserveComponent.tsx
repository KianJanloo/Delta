'use client'
import React, { useCallback, useEffect } from 'react'
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

const SingleReserveComponent = () => {
    const t = useTranslations('singleReserve');
    const [house, setHouse] = React.useState<IHouse>()
    const params = useParams()
    const id = params?.id as string

    const fetchHouse = useCallback(async () => {
        const houseData = await getHouseById(id) as IHouse
        setHouse(houseData)
    }, [id])

    useEffect(() => {
        fetchHouse()
    }, [fetchHouse])

    const facilities: TFacilities = []
    if (house?.parking && house?.parking > 0) { facilities.push({ title: <Car size={24} />, content: t('parking') }) }
    if (house?.rooms && house?.rooms > 0) { facilities.push({ title: <Bed size={24} />, content: t('rooms', { count: house?.rooms }) }) }
    if (house?.bathrooms && house?.bathrooms > 0) { facilities.push({ title: <Bath size={24} />, content: t('bathroom') }) }
    if (house?.yard_type) { facilities.push({ title: t('yard'), content: house?.yard_type }) }
    if (house?.capacity) { facilities.push({ title: t('capacity'), content: house?.capacity > 0 ? t('capacityValue', { count: house?.capacity }) : t('noCapacity') }) }

    return house ? <div className='px-8 flex flex-col gap-16'>
        <SingleReserveHeader house={house} />
        <div className='flex xl:flex-row flex-col-reverse gap-12 justify-between'>
            <SingleReserveTab id={id} photos={house.photos} caption={house.caption || t('noInfo')} facilities={facilities} defaultValue='about' />
            <SingleReserveBooking house={house} price={house?.price} discountedPrice={1000000} />
        </div>
        <SingleReserveFooter />
    </div> : <Loader />
}

export default SingleReserveComponent