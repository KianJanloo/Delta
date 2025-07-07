/* eslint-disable */
'use client'

import React, { useEffect, useState } from 'react'
import HeaderMyHouses from './header/HeaderMyHouses'
import ContentMyHouses from './content/ContentMyHouses'
import { BlurFade } from '@/components/magicui/blur-fade'
import { IHouse } from '@/types/houses-type/house-type'
import { getProperties } from '@/utils/service/api/properties/getProperties'
import CommonButton from '@/components/common/buttons/common/CommonButton'
import { redirect } from 'next/navigation'
import { PlusCircle } from 'lucide-react'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { getAllBookings } from '@/utils/service/api/booking/getAllBookings'
import { IReserveType } from '@/types/reserves-type/reserves-type'
import { useSession } from 'next-auth/react'
import { showToast } from '@/core/toast/toast'

const ComponentMyHouses = () => {
    const [allHouses, setAllHouses] = useState<IHouse[]>([]);
    const [filteredHouses, setFilteredHouses] = useState<IHouse[]>([]);
    const [page, setPage] = useState<number>(1);
    const limit = 5;

    const [filters, setFilters] = useState<{
        sort: string,
        transaction_type: string,
        fromPrice: number,
        toPrice: number,
        search: string
    }>({
        sort: '',
        transaction_type: '',
        fromPrice: 0,
        toPrice: 15000000,
        search: ''
    });

    const { data: session } = useSession() as any;

    useEffect(() => {
        if (session) {
            const fetchHouses = async () => {
                const response = await getProperties(1, 1000);
                if (!response) {
                    showToast('error', 'خطا در بارگذاری داده‌ها');
                    return;
                }
                const responseSeller = response.filter(house => house.sellerId === session.userInfo.id);
                setAllHouses(responseSeller);
            }
            fetchHouses();
        }
    }, [session]);

    const handleResetFilters = () => {
        const handle = async () => {
            setFilters({
                sort: '',
                transaction_type: '',
                fromPrice: 0,
                toPrice: 15000000,
                search: ''
            });
            if (session) {
                const response = await getProperties(1, 1000);
                if (!response) {
                    showToast('error', 'خطا در بارگذاری داده‌ها');
                    return;
                }
                const responseSeller = response.filter(house => house.sellerId === session.userInfo.id);
                setAllHouses(responseSeller);
            }
        }

        handle()
    };

    useEffect(() => {
        let filtered = [...allHouses];

        if (filters.transaction_type) {
            filtered = filtered.filter(house => house.transaction_type === filters.transaction_type);
        }

        if (filters.fromPrice) {
            filtered = filtered.filter(house => Number(house.price) >= filters.fromPrice);
        }

        if (filters.toPrice) {
            filtered = filtered.filter(house => Number(house.price) <= filters.toPrice);
        }

        if (filters.search) {
            filtered = filtered.filter(house => house.title?.toLowerCase().includes(filters.search.toLowerCase()));
        }

        if (filters.sort) {
            const [sortField, sortOrder] = filters.sort.split(' ');
            filtered.sort((a, b) => {
                const aValue = (a as Record<string, any>)[sortField];
                const bValue = (b as Record<string, any>)[sortField];
                if (aValue < bValue) return sortOrder === 'ASC' ? -1 : 1;
                if (aValue > bValue) return sortOrder === 'ASC' ? 1 : -1;
                return 0;
            });
        }

        setFilteredHouses(filtered);
        setPage(1);
    }, [filters, allHouses]);

    const paginatedHouses = filteredHouses.slice((page - 1) * limit, page * limit);

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: key === "fromPrice" || key === "toPrice" ? Number(value) : value
        }));
    };

    const fetchReserve = async (house_id: string) => {
        const response = await getAllBookings(1, 100, "created_at", "DESC", Number(house_id)) as { data: IReserveType[] };
        return response;
    }

    return (
        <BlurFade className='px-4 bg-subBg rounded-xl py-4 flex flex-col gap-8'>
            <HeaderMyHouses filters={filters} handleFilterChange={handleFilterChange} />
            <svg width="100%" height="2" viewBox="0 0 1131 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="-0.00439453" y1="0.881836" x2="1131" y2="0.881836" stroke="#888888" strokeOpacity="0.26" strokeDasharray="7 7" />
            </svg>
            <ContentMyHouses reset={handleResetFilters} houses={paginatedHouses} fetchReserve={fetchReserve} />
            <div className='flex w-full flex-wrap justify-between items-end'>
                <CommonButton onclick={() => redirect("/dashboard/seller/manage-houses/add-houses")} icon={<PlusCircle size={20} />} title={" ساخت ملک جدید "} />
                <div>
                    <Pagination className='w-fit'>
                        <PaginationContent className="justify-center mt-6">
                            <PaginationItem>
                                <PaginationPrevious onClick={() => setPage(prev => Math.max(prev - 1, 1))} />
                            </PaginationItem>

                            {Array.from({ length: Math.ceil(filteredHouses.length / limit) }, (_, idx) => (
                                <PaginationItem key={idx + 1}>
                                    <PaginationLink
                                        isActive={page === idx + 1}
                                        onClick={() => setPage(idx + 1)}
                                        className={page === idx + 1 ? 'bg-primary text-primary-foreground' : ''}
                                    >
                                        {idx + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext onClick={() => setPage(prev => Math.min(prev + 1, Math.ceil(filteredHouses.length / limit)))} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </BlurFade>
    )
}

export default ComponentMyHouses
