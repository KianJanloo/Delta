/* eslint-disable */

'use client'

import React, { useEffect, useState } from 'react'
import HeaderMyHouses from './header/HeaderMyHouses'
import ContentMyHouses from './content/ContentMyHouses'
import { BlurFade } from '@/components/magicui/blur-fade'
import { IHouse } from '@/types/houses-type/house-type'
import CommonButton from '@/components/common/buttons/common/CommonButton'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { PlusCircle } from 'lucide-react'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { getAllBookings } from '@/utils/service/api/booking/getAllBookings'
import { IReserveType } from '@/types/reserves-type/reserves-type'
import { useSession } from 'next-auth/react'
import { getMyHouses } from '@/utils/service/api/houses/getMyHouses'

const limit = 5;

const ComponentMyHouses = () => {
    const [allHouses, setAllHouses] = useState<IHouse[]>([])
    const [filteredHouses, setFilteredHouses] = useState<IHouse[]>([])
    const [totalCount, setTotalCount] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [filters, setFilters] = useState({
        sort: '',
        transaction_type: '',
        minPrice: 0,
        maxPrice: 15000000,
        search: ''
    })
    const { data: session } = useSession() as any
    const router = useRouter()
    const searchParams = useSearchParams()
    const page = Number(searchParams.get('page')) || 1
    const totalPages = Math.ceil(totalCount / limit)

    useEffect(() => {
        if (session) {
            const fetchHouses = async () => {
                setLoading(true)
                const params = { page, limit, ...filters }
                const response = await getMyHouses(params)
                setAllHouses(response?.houses || [])
                setTotalCount(response?.totalCount || 0)
                setLoading(false)
            }
            fetchHouses()
        }
    }, [session, page, filters])

    useEffect(() => {
        setFilteredHouses(allHouses)
    }, [allHouses])

    const handleResetFilters = () => {
        setFilters({
            sort: '',
            transaction_type: '',
            minPrice: 0,
            maxPrice: 15000000,
            search: ''
        })
        router.replace('?page=1')
    }

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: key === "minPrice" || key === "maxPrice" ? Number(value) : value
        }))
        router.replace('?page=1')
    }

    const handlePageChange = (newPage: number) => {
        if (newPage !== page) {
            setLoading(true)
            router.replace(`?page=${newPage}`)
        }
    }

    const fetchReserve = async (house_id: string) => {
        const response = await getAllBookings(1, 100, "created_at", "DESC", Number(house_id)) as { data: IReserveType[] }
        return response
    }

    return (
        <BlurFade className='px-4 bg-subBg rounded-xl py-4 flex flex-col gap-8'>
            <HeaderMyHouses filters={filters} handleFilterChange={handleFilterChange} />
            <svg width="100%" height="2" viewBox="0 0 1131 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="-0.00439453" y1="0.881836" x2="1131" y2="0.881836" stroke="#888888" strokeOpacity="0.26" strokeDasharray="7 7" />
            </svg>
            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></span>
                </div>
            ) : (
                <ContentMyHouses reset={handleResetFilters} houses={filteredHouses} fetchReserve={fetchReserve} />
            )}
            <div className='flex w-full flex-wrap justify-between items-end'>
                <CommonButton onclick={() => redirect("/dashboard/seller/manage-houses/add-houses")} icon={<PlusCircle size={20} />} title={" ساخت ملک جدید "} />
                <div>
                    <Pagination className='w-fit'>
                        <PaginationContent className="justify-center mt-6">
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(Math.max(page - 1, 1))}
                                    aria-disabled={page === 1}
                                />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, idx) => (
                                <PaginationItem key={idx + 1}>
                                    <PaginationLink
                                        isActive={page === idx + 1}
                                        onClick={() => handlePageChange(idx + 1)}
                                        className={page === idx + 1 ? 'bg-primary text-primary-foreground' : ''}
                                    >
                                        {idx + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
                                    aria-disabled={page === totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </BlurFade>
    )
}

export default ComponentMyHouses
