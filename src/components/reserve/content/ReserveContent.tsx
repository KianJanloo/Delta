import CommonInput from '@/components/common/inputs/common/CommonInput'
import React, { useState } from 'react'
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
}

const ReserveContent: React.FC<IReserveContent> = ({ houses, isLoading, setMaxPrice, setMinPrice, marker, setMarker }) => {
  const t = useTranslations('reserve.content');
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3
  const totalPages = Math.ceil(houses.length / itemsPerPage)

  const paginatedHouses = houses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  return (
    <div className="flex xl:flex-row flex-col gap-4 justify-between w-full xl:h-[1080px] overflow-hidden rounded-[40px] bg-secondary-light4 p-4">
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
          <div className="flex flex-col gap-6" id='items'>
            {isLoading ? (
              Array.from({ length: itemsPerPage }).map((_, idx) => (
                <ReserveCardSkeleton key={idx} />
              ))
            ) : (
              paginatedHouses.map((item, idx) => (
                <ReserveCard key={idx} items={item} />
              ))
            )}
          </div>
          {paginatedHouses.length === 0 && (
            <span className='text-sm font-semibold mx-auto'>
              {t('noAds')}
            </span>
          )}

          <Pagination>
            <PaginationContent className="justify-center my-6">
              <PaginationItem>
                <PaginationPrevious onClick={() => goToPage(currentPage - 1)} />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page} onClick={() => goToPage(page)}>
                  <PaginationLink isActive={page === currentPage} className={` ${page === currentPage && "bg-primary text-primary-foreground"} `} href="#items">
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext onClick={() => goToPage(currentPage + 1)} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="bg-secondary-light3 rounded-[40px] xl:w-2/5 w-full h-[1032px] xl:block hidden"
      >
        <ReserveMap marker={marker} setMarker={setMarker} />
      </motion.div>
    </div>
  )
}

export default ReserveContent