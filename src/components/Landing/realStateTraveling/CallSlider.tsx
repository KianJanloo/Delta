'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchHouses } from '@/utils/service/api/fetchHouses'
import SliderComponent from '../sliders/SliderComponent'

const CallSlider = () => {
    const { data: houses, isLoading } = useQuery({
        queryKey: ['realStateTravelingHouses'],
        queryFn: () => fetchHouses('last_updated', 'DESC', '')
    })

    return (
        <div>
            <SliderComponent items={houses} view='2' loading={isLoading} />
        </div>
    )
}

export default CallSlider
