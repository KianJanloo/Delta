'use client'
import ReserveContent, { MarkerType } from '@/components/reserve/content/ReserveContent'
import ReserveFilter from '@/components/reserve/filter/ReserveFilter'
import ReserveHeader from '@/components/reserve/header/ReserveHeader'
import { IHouse } from '@/types/houses-type/house-type'
import { getDistanceFromLatLonInKm } from '@/utils/helper/map/MapIcon'
import { getHouses } from '@/utils/service/api/houses-api'
import React, { useCallback, useEffect, useState } from 'react'

const ReserveComponent = () => {
    const [search, setSearch] = useState<string>('')
    const [order, setOrder] = useState<'DESC' | 'ASC'>('DESC')
    const [sort, setSort] = useState<string>('')
    const [location, setLocation] = useState<string>('')
    const [minPrice, setMinPrice] = useState<"" | number>("")
    const [maxPrice, setMaxPrice] = useState<number | "">("")
    const [houses, setHouses] = useState<IHouse[]>([])
    const [filteredHouses, setFilteredHouses] = useState<IHouse[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [marker, setMarker] = useState<MarkerType | null>(null)

    const fetchHouses = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await getHouses("reservation", search || "", order || "DESC", sort || "last_updated", location || "", "", minPrice, maxPrice)
            setHouses(response)
        } catch (error) {
            console.error('Error fetching houses:', error)
        } finally {
            setIsLoading(false)
        }
    }, [search, order, sort, location, minPrice, maxPrice])

    useEffect(() => {
        if (!marker) {
            setFilteredHouses(houses)
            return
        }
        const radius = 10
        const filtered = houses.filter((house) => {
            if (!house.location) return false
            const lat = house.location.lat
            const lng = house.location.lng
            const distance = getDistanceFromLatLonInKm(marker.lat, marker.lng, lat, lng)
            return distance <= radius
        })
        setFilteredHouses(filtered)
    }, [marker, houses])

    useEffect(() => {
        fetchHouses()
    }, [fetchHouses])

    return (
        <div className='px-8 mt-[120px] flex flex-col gap-4'>
            <ReserveHeader />
            <ReserveFilter
                marker={marker}
                setMarker={setMarker}
                setOrder={setOrder}
                setSort={setSort}
                setSearch={setSearch}
                houseLength={filteredHouses.length}
                setLocation={setLocation}
            />
            <ReserveContent marker={marker} setMarker={setMarker} isLoading={isLoading} houses={filteredHouses} setMaxPrice={setMaxPrice} setMinPrice={setMinPrice} setLocation={setLocation} />
        </div>
    )
}

export default ReserveComponent
