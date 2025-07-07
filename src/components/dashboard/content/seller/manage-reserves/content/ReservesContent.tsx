'use client'

import CommonModal from '@/components/dashboard/modal/CommonModal'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SplitNumber } from '@/utils/helper/spliter/SplitNumber'
import { CheckCircle, Delete, Info, MoreHorizontal, XCircle } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { IReserveType } from '@/types/reserves-type/reserves-type'
import { IHouse } from '@/types/houses-type/house-type'
import { convertToJalaliString } from '@/utils/helper/shamsiDate/ShamsDate'
import ReserveModal from '../../../manage-reserves/ReserveModal'
import { deleteBooking } from '@/utils/service/api/booking/deleteBooking'
import { showToast } from '@/core/toast/toast'
import { changeStatusBook } from '@/utils/service/api/booking/changeStatusBook'

const ReservesContent = ({ reserves, fetchHouse, reset }: { reset: () => void, reserves: IReserveType[], fetchHouse: (house_id: string) => Promise<IHouse> }) => {
    const t = useTranslations('dashboardSeller.reserves')
    const [houses, setHouses] = useState<Record<number, IHouse>>({})
    const [openModalIndex, setOpenModalIndex] = useState<number | null>(null)
    const [openModalIndex2, setOpenModalIndex2] = useState<number | null>(null)
    const moreRef = useRef<HTMLTableCellElement | null>(null)
    const moreRef2 = useRef<HTMLTableCellElement | null>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
                setOpenModalIndex(null)
            }
            if (moreRef2.current && !moreRef2.current.contains(event.target as Node)) {
                setOpenModalIndex2(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        const fetchAllHouses = async () => {
            const uniqueIds = Array.from(new Set(reserves.map(r => r.houseId)))
            for (const id of uniqueIds) {
                if (!houses[id]) {
                    const house = await fetchHouse(JSON.stringify(id))
                    setHouses(prev => ({ ...prev, [id]: house }))
                }
            }
        }
        if (reserves.length) {
            fetchAllHouses()
        }
    }, [reserves, fetchHouse, houses])

    const changeStatus = async (id: string, status: "continue" | "cancel") => {
        const res = await changeStatusBook(id, status)
        if (res) {
            showToast("success", "وضعیت با موفقیت تغییر یافت")
        }
        reset()
    }

    const deleteBook = async (booking_id: string) => {
        const res = await deleteBooking(booking_id)
        if (res) {
            showToast("success", "رزرو با موفقیت حذف شد")
        }
        reset()
    }

    return (
        <div className='flex flex-col justify-between gap-8'>
            <Table className='text-right max-lg:hidden overflow-hidden'>
                <TableHeader className='bg-subBg2 rounded-2xl text-foreground'>
                    <TableRow>
                        <TableHead>نام ملک</TableHead>
                        <TableHead>{t('passengerInfo')}</TableHead>
                        <TableHead>{t('reserveDate')}</TableHead>
                        <TableHead>{t('amount')}</TableHead>
                        <TableHead>{t('reserveStatus')}</TableHead>
                        <TableHead>  </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reserves.map((reserve, idx) => {
                        const house = houses[reserve.houseId]
                        return (
                            <TableRow key={idx}>
                                <TableCell  className='py-8'>{house?.title || ""}</TableCell>
                                <TableCell>{reserve.traveler_details.length}</TableCell>
                                <TableCell>{convertToJalaliString(reserve.createdAt)}</TableCell>
                                <TableCell>{SplitNumber(house?.price || "")} {t('currencyShort')}</TableCell>
                                <TableCell>
                                    <div className={`px-4 w-[120px] flex justify-center py-1 rounded-2xl 
                                        ${reserve.status === 'confirmed' && "bg-primary text-primary-foreground"} 
                                        ${reserve.status === 'pending' && "bg-orange text-orange-foreground"} 
                                        ${reserve.status === 'canceled' && "bg-danger text-accent-foreground"}`}>
                                        <span>
                                            {reserve.status === "confirmed" && "تایید شده"}
                                            {reserve.status === "pending" && "در حال انتظار"}
                                            {reserve.status === "canceled" && "لغو شده"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className='relative' ref={idx === openModalIndex ? moreRef : null}>
                                    <MoreHorizontal
                                        onClick={() => setOpenModalIndex(prev => prev === idx ? null : idx)}
                                        className='cursor-pointer'
                                    />
                                    {openModalIndex === idx && (
                                        <div className={`flex absolute left-full ${idx <= 0 ? "top-0" : "bottom-0"} flex-col backdrop-blur-md border rounded-xl gap-2 p-2 z-20 shadow-2xl`}>
                                            <div onClick={() => changeStatus(JSON.stringify(reserve.id), "continue")} className='px-4 py-1 flex gap-2 rounded-xl justify-end flex-row-reverse cursor-pointer hover:bg-subBg2 whitespace-nowrap'>{t('approveReserve')} <CheckCircle size={16} /></div>
                                            <div onClick={() => changeStatus(JSON.stringify(reserve.id), "cancel")} className='px-4 py-1 flex gap-2 rounded-xl justify-end flex-row-reverse cursor-pointer hover:bg-subBg2 whitespace-nowrap'>{t('cancelReserve')} <XCircle size={16} /></div>
                                            <ReserveModal button={<div className='px-4 py-1 flex gap-2 rounded-xl justify-end flex-row-reverse cursor-pointer hover:bg-subBg2'>
                                                {t('details')} <Info size={16} />
                                            </div>} houseId={JSON.stringify(reserve.houseId)} />
                                            <CommonModal onClick={() => deleteBook(JSON.stringify(reserve.id))} handleClick={t('delete')} title={t('deleteConfirm')} button={<div className='px-4 py-1 flex gap-2 rounded-xl justify-end flex-row-reverse cursor-pointer hover:bg-subBg2'> {t('delete')} <Delete size={16} /> </div>} />
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>

            <div className='flex flex-col gap-4 w-full lg:hidden'>
                {reserves.map((reserve, idx) => {
                    const house = houses[reserve.houseId]
                    return (
                        <div key={idx} className='w-full px-4 py-4 bg-subBg2 rounded-xl flex flex-col gap-4 text-sm relative'>
                            <div ref={idx === openModalIndex2 ? moreRef2 : null} className='flex justify-between items-center'>
                                <div className='font-bold text-base'>{house?.title || ""}</div>
                                <MoreHorizontal
                                    onClick={() => setOpenModalIndex2(prev => prev === idx ? null : idx)}
                                    className='cursor-pointer'
                                />
                                {openModalIndex2 === idx && (
                                    <div className="flex absolute left-4 bottom-full mt-2 flex-col backdrop-blur-xl border rounded-xl gap-2 p-2 z-20 shadow-2xl w-[200px] bg-transparent">
                                        <div onClick={() => changeStatus(JSON.stringify(reserve.id), "continue")} className='px-4 py-1 flex gap-2 rounded-xl justify-end flex-row-reverse cursor-pointer hover:bg-subBg2 whitespace-nowrap'>{t('approveReserve')} <CheckCircle size={16} /></div>
                                        <div onClick={() => changeStatus(JSON.stringify(reserve.id), "cancel")} className='px-4 py-1 flex gap-2 rounded-xl justify-end flex-row-reverse cursor-pointer hover:bg-subBg2 whitespace-nowrap'>{t('cancelReserve')} <XCircle size={16} /></div>
                                        <ReserveModal button={<div className='px-4 py-1 flex gap-2 rounded-xl justify-end flex-row-reverse cursor-pointer hover:bg-subBg2'>
                                            {t('details')} <Info size={16} />
                                        </div>} houseId={JSON.stringify(reserve.houseId)} />
                                        <CommonModal onClick={() => deleteBook(JSON.stringify(reserve.id))} handleClick={t('delete')} title={t('deleteConfirm')} button={<div className='px-4 py-1 flex gap-2 rounded-xl justify-end flex-row-reverse cursor-pointer hover:bg-subBg2'> {t('delete')} <Delete size={16} /> </div>} />
                                    </div>
                                )}
                            </div>

                            <div className='flex flex-col gap-4 text-right'>
                                <div className='flex gap-2'><span className='font-semibold'>{t('passengerInfo')}:</span> {reserve.traveler_details.length}</div>
                                <div className='flex gap-2'><span className='font-semibold'>{t('reserveDate')}:</span> {convertToJalaliString(reserve.createdAt)}</div>
                                <div className='flex gap-2'><span className='font-semibold'>{t('amount')}:</span> {SplitNumber(house?.price || "")} {t('currencyShort')}</div>
                                <div className='flex gap-2'><span className='font-semibold'>{t('reserveStatus')}:</span>
                                    {reserve.status === "confirmed" && "تایید شده"} {reserve.status === "pending" && "در حال انتظار"} {reserve.status === "canceled" && "لغو شده"}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ReservesContent
