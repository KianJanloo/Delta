'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchHouses } from '@/utils/service/api/fetchHouses'
import SliderComponent from '../sliders/SliderComponent'

export const CallSliderMortgage = () => {
    const { data: mortgageHouses, isLoading } = useQuery({
        queryKey: ['mortgageHouses'],
        queryFn: () => fetchHouses('last_updated', 'DESC', 'mortgage')
    })

    return (
        <div>
            <SliderComponent items={mortgageHouses} view='2' loading={isLoading} />
        </div>
    )
}