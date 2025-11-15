'use client'
import React, { useCallback, useEffect, useState } from 'react'
import RentalHeader from './header/RentalHeader'
import RentalFilter from './filter/RentalFilter'
import RentalFilterCap from './filter/RentalFilterCap'
import RentalCard from './card/RentalCard'
import { getHouses } from '@/utils/service/api/houses-api'
import { IHouse } from '@/types/houses-type/house-type'
import RentalCardSkeleton from './card/RentalCardSkeleton'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination'
import { useSearchParams, useRouter } from 'next/navigation';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { showToast } from '@/core/toast/toast';
import { useTranslations } from 'next-intl';

const RentalComponent = () => {
  const t = useTranslations('rental');
  const router = useRouter();
  const searchParams = useSearchParams();

  const getParam = (key: string, defaultValue: string | number = "") => {
    try {
      return searchParams.get(key) || defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const urlTransactionType = getParam('transactionType', "[rental, mortgage, direct_purchase]") as string
  const urlLocation = getParam('location', '') as string
  const urlMinArea = Number(getParam('minRent')) || ''
  const urlMaxArea = Number(getParam('maxRent')) || ''
  const urlProperty = getParam("propertyType", '') as string
  const urlPage = Number(getParam('page', '1')) || 1

  const [search, setSearch] = useState<string>('')
  const [order, setOrder] = useState<'DESC' | 'ASC'>('DESC')
  const [sort, setSort] = useState<string>('last_updated')
  const [houses, setHouses] = useState<IHouse[]>([])
  const [propertyType, setPropertyType] = useState<string>(urlProperty)
  const [minRent, setMinRent] = useState<number | "">('')
  const [maxRent, setMaxRent] = useState<number | "">('')
  const [minMortgage, setMinMortgage] = useState<number | "">('')
  const [maxMortgage, setMaxMortgage] = useState<number | "">('')
  const [minArea, setMinArea] = useState<number | "">(urlMinArea)
  const [maxArea, setMaxArea] = useState<number | "">(urlMaxArea)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [transactionType, setTransactionType] = useState<string>(urlTransactionType || "[rental, mortgage, direct_purchase]")
  const [location, setLocation] = useState<string>(urlLocation)
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(urlPage)

  const debouncedSearch = useDebounce(search, 500);
  const itemsPerPage = 10
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const updateURLParams = useCallback((updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    if (!updates.page && Object.keys(updates).some(k => k !== "page")) {
      params.set("page", "1");
      setCurrentPage(1);
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const handlePageChange = useCallback((page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    updateURLParams({ page })
    const itemsElement = document.getElementById('rental-items');
    if (itemsElement) {
      itemsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [totalPages, updateURLParams])

  const fetchHouses = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await getHouses(
        transactionType, 
        debouncedSearch || '', 
        order, 
        sort, 
        location,
        propertyType, 
        '', 
        '', 
        minRent, 
        maxRent, 
        minMortgage, 
        maxMortgage, 
        minArea, 
        maxArea,
        currentPage,
        itemsPerPage
      )
      setHouses(response.houses);
      setTotalCount(response.totalCount);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('errorMessage') || 'خطا در دریافت اطلاعات';
      setError(errorMessage);
      showToast('error', t('errorTitle') || 'خطا', undefined, errorMessage);
      console.error('Error fetching houses:', error)
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch, order, sort, location, minRent, maxRent, minMortgage, maxMortgage, minArea, maxArea, propertyType, transactionType, currentPage, itemsPerPage, t])

  useEffect(() => {
    fetchHouses()
  }, [fetchHouses])

  useEffect(() => {
    updateURLParams({ search: debouncedSearch });
  }, [debouncedSearch, updateURLParams]);

  useEffect(() => {
    updateURLParams({ order, sort, location, propertyType, transactionType, minRent, maxRent, minMortgage, maxMortgage, minArea, maxArea });
  }, [order, sort, location, propertyType, transactionType, minRent, maxRent, minMortgage, maxMortgage, minArea, maxArea, updateURLParams]);

  useEffect(() => {
    setPropertyType(urlProperty)
  }, [urlProperty])

  return (
    <div className='px-8 flex flex-col gap-4'>
      <RentalHeader />
      <RentalFilter
        setOrder={setOrder}
        setSort={setSort}
        setSearch={setSearch}
        houseLength={totalCount}
        setLocation={setLocation}
        setPropertyType={setPropertyType}
        setTransactionType={setTransactionType}
      />
      <RentalFilterCap
        setMinRent={setMinRent}
        setMaxRent={setMaxRent}
        setMinMortgage={setMinMortgage}
        setMaxMortgage={setMaxMortgage}
        setMinArea={setMinArea}
        setMaxArea={setMaxArea}
      />
      <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 mt-[20px] w-full' id="rental-items">
        {error ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 gap-4">
            <span className='text-danger text-lg font-semibold'>
              {t('errorTitle') || 'خطا در دریافت اطلاعات'}
            </span>
            <span className='text-subText text-sm text-center'>
              {error}
            </span>
          </div>
        ) : isLoading ? (
          Array.from({ length: itemsPerPage }).map((_, idx) => (
            <RentalCardSkeleton key={idx} />
          ))
        ) : houses.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 gap-4">
            <span className='text-lg font-semibold'>
              {t('noHouses') || 'درحال حاضر هیچ خانه‌ای مطابق با فیلتر وجود ندارد'}
            </span>
            <span className='text-subText text-sm text-center'>
              {t('noHousesDescription') || 'لطفا فیلترهای جستجو را تغییر دهید'}
            </span>
          </div>
        ) : (
          houses.map((item) => (
            <RentalCard key={item.id} items={item} />
          ))
        )}
      </div>

      {totalPages > 1 && !isLoading && !error && (
        <Pagination>
          <PaginationContent className='justify-center mt-6'>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(currentPage - 1)} 
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                href="#rental-items"
              />
            </PaginationItem>

            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
              let page: number;
              if (totalPages <= 10) {
                page = i + 1;
              } else if (currentPage <= 5) {
                page = i + 1;
              } else if (currentPage >= totalPages - 4) {
                page = totalPages - 9 + i;
              } else {
                page = currentPage - 5 + i;
              }
              return (
                <PaginationItem key={page}>
                  <PaginationLink 
                    isActive={page === currentPage} 
                    className={`cursor-pointer ${page === currentPage && "bg-primary text-primary-foreground"}`} 
                    href="#rental-items"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(currentPage + 1)} 
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                href="#rental-items"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

export default RentalComponent
