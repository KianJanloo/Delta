/* eslint-disable */

'use client'
import CommonModal from '@/components/dashboard/modal/CommonModal'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SplitNumber } from '@/utils/helper/spliter/SplitNumber'
import { Coins, Delete, Edit, Home, Info, LayoutGrid, MoreHorizontal, Star } from 'lucide-react'
import { redirect } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { IHouse } from '@/types/houses-type/house-type'
import { IReserveType } from '@/types/reserves-type/reserves-type'
import { showToast } from '@/core/toast/toast'
import { deleteHouse } from '@/utils/service/api/houses/deleteHouse'
import EditHouseModal from '@/components/dashboard/modal/EditHouseModal'

const ContentMyHouses = ({ houses, fetchReserve, reset }: {
    reset: () => void,
    houses: IHouse[],
    fetchReserve: (house_id: string) => Promise<{ data: IReserveType[] }>
}) => {

    const t = useTranslations('dashboardSeller.myHouses')
    const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
    const [openMobileMenuIndex, setOpenMobileMenuIndex] = useState<number | null>(null);
    const [reservesCounts, setReservesCounts] = useState<Record<string, number>>({});
    const moreRef = useRef<HTMLTableCellElement | null>(null);

    useEffect(() => {
        async function fetchAllReserves() {
            const counts: Record<string, number> = {};
            for (const house of houses) {
                try {
                    const res = await fetchReserve(house.id);
                    counts[house.id] = res.data.length;
                } catch {
                    counts[house.id] = 0;
                }
            }
            setReservesCounts(counts);
        }
        fetchAllReserves();

        const handleClickOutside = (event: MouseEvent) => {
            if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
                setOpenModalIndex(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [houses, fetchReserve]);

    const handleDeleteHouse = async (id: string) => {
        const response = await deleteHouse(id);
        if(response){
            showToast("success", "ملک با موفقیت حذف شد.")
            reset()
        }
    }

    return (
        <div className='flex flex-col justify-between gap-8 '>
            <Table className='text-right max-lg:hidden overflow-hidden'>
                <TableHeader className='bg-subBg2 rounded-2xl text-foreground text-right'>
                    <TableRow className='text-right'>
                        <TableHead className='text-right'>{t('houseName')}</TableHead>
                        <TableHead className='text-right'>{t('price')}</TableHead>
                        <TableHead className='text-right'>{t('rating')}</TableHead>
                        <TableHead className='text-right'>{t('views')}</TableHead>
                        <TableHead className='text-right'>{t('reserves')}</TableHead>
                        <TableHead>  </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {houses.map((house, idx) => (
                        <TableRow key={house.id || idx}>
                            <TableCell className='py-4 flex gap-4 items-center'>
                                <img src={house.photos[0] || " "} alt='' width={108} height={72} className='rounded-2xl bg-subBg2' />
                                {house.title}
                            </TableCell>
                            <TableCell>{SplitNumber(house.price)} {t('currency')}</TableCell>
                            <TableCell>{house.rate} {t('from5')}</TableCell>
                            <TableCell>{house.capacity} {t('count')}</TableCell>
                            <TableCell>{reservesCounts[house.id] ?? "0"}</TableCell>
                            <TableCell className='relative' ref={idx === openModalIndex ? moreRef : null}>
                                <MoreHorizontal
                                    onClick={() => {
                                        setOpenModalIndex(prev => prev === idx ? null : idx);
                                    }}
                                    className='cursor-pointer'
                                />
                                {openModalIndex === idx && (
                                    <div className={`flex absolute left-full ${idx > 1 ? "bottom-0" : "top-0"} flex-col backdrop-blur-md border rounded-xl gap-2 p-2 z-20 shadow-2xl`}>
                                        <div onClick={() => redirect(`/rent/${house.id}`)} className='px-4 py-1 flex gap-2 rounded-xl justify-end flex-row-reverse cursor-pointer hover:bg-subBg2'> {t('details')} <Info size={16} /> </div>
                                        <EditHouseModal house={house} reset={reset} />
                                        <CommonModal onClick={() => handleDeleteHouse(house.id)} handleClick={t('delete')} title={t('deleteConfirm')} button={<div className='px-4 py-1 flex gap-2 rounded-xl justify-end flex-row-reverse cursor-pointer hover:bg-subBg2'> {t('delete')} <Delete size={16} /> </div>} />
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className='flex flex-col gap-4 w-full lg:hidden'>
                {houses.map((house, idx) => (
                    <div key={idx} className='w-full max-sm:flex-col bg-subBg2 px-4 py-2 rounded-xl flex gap-4 relative'>
                        <img src={house.photos[0] || " "} alt='' className='w-1/3 max-sm:w-full max-sm:h-[200px] bg-secondary-light3 rounded-xl' />
                        <div className='h-full flex flex-col gap-2 max-sm:gap-4 text-base flex-grow'>
                            <div className='flex items-center text-base gap-4 my-2 max-sm:text-lg justify-between flex-wrap'>
                                <span>{house.title}</span>

                                <MoreHorizontal
                                    className='cursor-pointer'
                                    onClick={() => setOpenMobileMenuIndex(prev => prev === idx ? null : idx)}
                                />
                            </div>

                            <div className='flex gap-2 items-center'>
                                <LayoutGrid className='text-subText' size={16} />
                                <span className='text-subText'>{t('reserves')}:</span>
                                <span>{reservesCounts[house.id] ?? "0"} {t('times')}</span>
                            </div>

                            <div className='flex gap-2 items-center'>
                                <Home className='text-subText' size={16} />
                                <span className='text-subText'>{t('views')}:</span>
                                <span>{house.capacity} {t('count')}</span>
                            </div>

                            <div className='flex gap-2 items-center'>
                                <Coins className='text-subText' size={16} />
                                <span className='gap-2 flex'>{SplitNumber(house.price)} <p>{t('currency')}</p></span>
                            </div>
                        </div>

                        {openMobileMenuIndex === idx && (
                            <div className={`flex absolute left-0 bottom-0 flex-col backdrop-blur-md border rounded-xl gap-2 p-2 z-20 shadow-2xl`}>
                                <div onClick={() => redirect(`/rent/${house.id}`)} className='px-4 py-1 flex gap-2 rounded-xl justify-end flex-row-reverse cursor-pointer hover:bg-subBg2'> {t('details')} <Info size={16} /> </div>
                                <EditHouseModal house={house} reset={reset} />
                                <CommonModal onClick={() => handleDeleteHouse(house.id)} handleClick={t('delete')} title={t('deleteConfirm')} button={<div className='px-4 py-1 flex gap-2 rounded-xl justify-end flex-row-reverse cursor-pointer hover:bg-subBg2'> {t('delete')} <Delete size={16} /> </div>} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

        </div>
    )
}


export default ContentMyHouses
