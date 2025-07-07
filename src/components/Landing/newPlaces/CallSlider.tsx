'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import SliderComponent from '../sliders/SliderComponent'
import { fetchNewPlaces } from '@/utils/service/api/fetchNewPlaces'

const CallSlider = () => {
    const { data: items, isLoading } = useQuery({
        queryKey: ['newPlaces'],
        queryFn: fetchNewPlaces
    })

    return (
        <div>
            {items && <SliderComponent items={items} view='1' loading={isLoading} />}
        </div>
    )
}

export default CallSlider
