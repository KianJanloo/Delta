/* eslint-disable */

'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import SliderComponent from '../sliders/SliderComponent'
import { getRecommendsHouse } from '@/utils/service/api/recommendsHouse'
import { useSession } from 'next-auth/react'

const CallSlider = () => {

    const { data: session } = useSession() as any;

    const { data, isLoading } = useQuery({
        queryKey: ['recommendsHouses'],
        queryFn: () => getRecommendsHouse(session?.userInfo?.id)
    })

    return (
        <div>
            <SliderComponent items={data?.recommendations ? data?.recommendations : data} view='2' loading={isLoading} />
        </div>
    )
}

export default CallSlider
