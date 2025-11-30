import CommonInput from '@/components/common/inputs/common/CommonInput'
import React from 'react'
import ReserveCard from '../card/ReserveCard'
import ReserveMap from '../map/ReserveMap'
import { IHouse } from '@/types/houses-type/house-type'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from '@/components/ui/pagination'
import ReserveCardSkeleton from '../card/ReserveCardSkeleton'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export interface MarkerType {
  lat: number;
  lng: number;
}

interface IReserveContent {
  houses: IHouse[]
  isLoading: boolean
  setMinPrice: React.Dispatch<React.SetStateAction<number | ''>>
  setMaxPrice: React.Dispatch<React.SetStateAction<number | ''>>
  setLocation: React.Dispatch<React.SetStateAction<string>>
  marker: MarkerType | null
  setMarker: React.Dispatch<React.SetStateAction<MarkerType | null>>
  totalCount: number
  currentPage?: number
  onPageChange?: (page: number) => void
  error?: string | null
}

const ReserveContent: React.FC<IReserveContent> = ({ 
  totalCount, 
  houses, 
  isLoading, 
  setMaxPrice, 
  setMinPrice, 
  marker, 
  setMarker,
  currentPage = 1,
  onPageChange,
  error
}) => {
  const t = useTranslations('reserve.content');
  const itemsPerPage = 4
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    if (onPageChange) {
      onPageChange(page)
    }
  }

  return (
    <div className="flex xl:flex-row flex-col gap-4 justify-between w-full xl:h-[1080px] overflow-hidden rounded-[20px] sm:rounded-[30px] md:rounded-[40px] bg-secondary-light4 p-3 sm:p-4">
      <div className="flex gap-6 flex-col xl:w-3/5 w-full">
        <div className="flex gap-4 w-full">
          <div className="w-1/2">
            <CommonInput
              onchange={(e) => setMinPrice(Number(e.target.value))}
              label={t('minPrice')}
              classname="px-4 py-2 border-subText w-full outline-none"
              color="text-subText placeholder:text-subText"
              placeholder={t('minPricePlaceholder')}
            />
          </div>
          <div className="w-1/2">
            <CommonInput
              onchange={(e) => setMaxPrice(Number(e.target.value))}
              label={t('maxPrice')}
              classname="px-4 py-2 border-subText w-full outline-none"
              color="text-subText placeholder:text-subText"
              placeholder={t('maxPricePlaceholder')}
            />
          </div>
        </div>
        <div className="w-full border dark:border-[#4E4E4E] border-[#9E9E9E]" />

        <div className='flex flex-col justify-between h-full'>
          <div className="flex flex-col gap-2" id='items'>
            {error ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <span className='text-danger text-lg font-semibold'>
                  {t('errorTitle') || 'خطا در دریافت اطلاعات'}
                </span>
                <span className='text-subText text-sm text-center'>
                  {error}
                </span>
              </div>
            ) : isLoading ? (
              Array.from({ length: Math.min(itemsPerPage, 3) }).map((_, idx) => (
                <ReserveCardSkeleton key={idx} />
              ))
            ) : houses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <span className='text-lg font-semibold mx-auto'>
                  {t('noAds')}
                </span>
                <span className='text-subText text-sm text-center'>
                  {t('noAdsDescription') || 'لطفا فیلترهای جستجو را تغییر دهید'}
                </span>
              </div>
            ) : (
              houses.map((item, idx) => (
                <ReserveCard key={item.id || idx} items={item} />
              ))
            )}
          </div>

          {totalPages > 1 && !isLoading && !error && (
            <Pagination>
              <PaginationContent className="justify-center my-6">
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => goToPage(currentPage - 1)} 
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                        href="#items"
                        onClick={(e) => {
                          e.preventDefault();
                          goToPage(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext 
                    onClick={() => goToPage(currentPage + 1)} 
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="bg-secondary-light3 rounded-[20px] sm:rounded-[30px] md:rounded-[40px] xl:w-2/5 w-full h-[400px] sm:h-[500px] md:h-[600px] xl:h-[1032px] xl:block hidden"
      >
        <ReserveMap marker={marker} setMarker={setMarker} />
      </motion.div>
    </div>
  )
}

export default ReserveContent