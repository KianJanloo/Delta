/* eslint-disable */

'use client'
import { BlurFade } from '@/components/magicui/blur-fade'
import React, { useEffect, useState } from 'react'
import FavoritesHeader from './header/FavoritesHeader'
import FavoritesDetail from './detail/FavoritesDetail'
import { getCategories } from '@/utils/service/api/categories'
import { Category } from '@/types/categories-type/categories-type'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import { IHouse } from '@/types/houses-type/house-type'
import { useSession } from 'next-auth/react'
import { getProperties } from '@/utils/service/api/properties/getProperties'
import { showToast } from '@/core/toast/toast'

const FavoritesComponent = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [allHouses, setAllHouses] = useState<IHouse[]>([]);
    const [page, setPage] = useState<number>(1);
    const [filteredHouses, setFilteredHouses] = useState<IHouse[]>([]);
    const limit = 6;
    const [filters, setFilters] = useState<{
        category: string,
        fromPrice: number,
        toPrice: number,
        search: string
    }>({
        category: '',
        fromPrice: 0,
        toPrice: 15000000,
        search: ''
    });

    const { data: session } = useSession() as any;

    useEffect(() => {
        const fetchCategories = async () => {
            const response = (await getCategories()).data as Category[]
            setCategories(response)
        }

        fetchCategories();
    }, [])

    useEffect(() => {
        if (session) {
            const fetchHouses = async () => {
                const response = await getProperties(1, 1000);
                if (!response) {
                    showToast('error', 'خطا در بارگذاری داده‌ها');
                    return;
                }
                const responseFavorites = response.filter(house => house.isFavorite === true);
                setAllHouses(responseFavorites);
            }
            fetchHouses();
        }
    }, [session]);


    useEffect(() => {
        let filtered = [...allHouses];

        if (filters.category) {
            filtered = filtered.filter(house => house.categories.name === filters.category);
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

    return (
        <BlurFade className='px-4 bg-subBg rounded-xl py-4 flex flex-col gap-6'>
            <FavoritesHeader filters={filters} handleFilterChange={handleFilterChange} categories={categories} />
            <svg width="100%" height="1" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line y1="0.5" x2="100%" y2="1" stroke="#888888" strokeOpacity="0.26" strokeDasharray="7 7" />
            </svg>
            <FavoritesDetail favorites={allHouses} />
            <div className="flex w-full flex-wrap justify-between items-end">
                <div></div>
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

export default FavoritesComponent
