'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchHouses } from '@/utils/service/api/fetchHouses'
import SliderComponent from '../sliders/SliderComponent'

export const CallSliderDreams = () => {
    const { data: dreamHouses, isLoading } = useQuery({
        queryKey: ['dreamsHouses'],
        queryFn: () => fetchHouses('rate', 'DESC', '')
    })

    return (
        <div>
            <SliderComponent items={dreamHouses} view='2' loading={isLoading} />
        </div>
    )
}

