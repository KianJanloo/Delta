'use client'
import SliderComponent from '@/components/Landing/sliders/SliderComponent'
import { fetchHouses } from '@/utils/service/api/fetchHouses'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const CallSlider = () => {

    const { data: houses, isLoading } = useQuery({
        queryKey: ['realStateTravelingHouses'],
        queryFn: () => fetchHouses('last_updated', 'DESC', 'reservation')
    })

    return (
        <SliderComponent items={houses} loading={isLoading} view='2' />
    )
}

export default CallSlider
