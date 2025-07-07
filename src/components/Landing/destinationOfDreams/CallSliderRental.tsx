'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchHouses } from '@/utils/service/api/fetchHouses'
import SliderComponent from '../sliders/SliderComponent'

export const CallSliderRental = () => {
    const { data: rentalHouses, isLoading } = useQuery({
        queryKey: ['rentalHouses'],
        queryFn: () => fetchHouses('last_updated', 'DESC', 'rental')
    })

    return (
        <div>
            <SliderComponent items={rentalHouses} view='2' loading={isLoading} />
        </div>
    )
}