/* eslint-disable */
import { BlurFade } from '@/components/magicui/blur-fade'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { IReserveType } from '@/types/reserves-type/reserves-type'
import { getHouseById } from '@/utils/service/api/houses-api'
import { CheckCircle2, Coins, Pin, Rocket, Text, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { IHouse } from '@/types/houses-type/house-type'
import { convertToJalaliString } from '@/utils/helper/shamsiDate/ShamsDate'
import { SplitNumber } from '@/utils/helper/spliter/SplitNumber'

const RecentReserves = ({ reserves }: { reserves: IReserveType[] }) => {
    const t = useTranslations('dashboardSeller.dashboard')
    const [housesData, setHousesData] = useState<Record<string, IHouse>>({})

    useEffect(() => {
        const fetchHouses = async () => {
            const houses: Record<string, IHouse> = {}
            for (const reserve of reserves) {
                if (!houses[reserve.houseId]) {
                    const house = await getHouseById(reserve.houseId.toString())
                    houses[reserve.houseId] = house
                }
            }
            setHousesData(houses)
        }

        if (reserves?.length) {
            fetchHouses()
        }
    }, [reserves])

    return <BlurFade delay={1} className='w-full min-h-full rounded-[12px] bg-subBg flex gap-4 px-4 py-4 flex-col'>
        <div className='flex justify-between w-full items-center flex-wrap gap-4'>
            <div className='flex gap-2 w-fit items-center'>
                <Pin size={24} />
                <span className='text-base font-bold'>{t('title')}</span>
            </div>
            <Link href={"/dashboard/manage-reserves"} className='w-fit cursor-pointer gap-8 items-center flex justify-between'>
                <span className='text-muted'>{t('viewAll')}</span>
                <svg width="63" height="18" viewBox="0 0 63 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.7677 10.6382C2.2526 9.91281 2.25259 7.75581 3.76769 7.03041L12.8127 2.69983C14.1402 2.06424 15.6764 3.03189 15.6764 4.50373L15.6764 13.1649C15.6764 14.6367 14.1402 15.6044 12.8127 14.9688L3.7677 10.6382Z" fill="#7A7A7A" />
                    <path d="M31.566 10.1869C30.4297 9.64286 30.4297 8.02511 31.566 7.48106L38.3498 4.23313C39.3454 3.75643 40.4975 4.48217 40.4975 5.58605L40.4975 12.0819C40.4975 13.1858 39.3454 13.9115 38.3498 13.4348L31.566 10.1869Z" fill="#7A7A7A" fillOpacity="0.5" />
                    <path d="M54.1378 9.73561C53.3802 9.37291 53.3802 8.29441 54.1378 7.93171L58.6603 5.76642C59.324 5.44862 60.0921 5.93245 60.0921 6.66837L60.0921 10.9989C60.0921 11.7349 59.324 12.2187 58.6603 11.9009L54.1378 9.73561Z" fill="#7A7A7A" fillOpacity="0.25" />
                </svg>
            </Link>
        </div>
        <svg width="100%" height="2" viewBox="0 0 1115 2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0.972656" y1="1.15332" x2="1114.03" y2="1.15332" stroke="#888888" strokeOpacity="0.26" strokeDasharray="7 7" />
        </svg>

        <Table className='text-right max-lg:hidden overflow-hidden w-full'>
            <TableHeader className='bg-subBg2 rounded-t-2xl text-foreground'>
                <TableRow className='text-right'>
                    <TableHead className='text-right text-foreground'>{t('hotelName')}</TableHead>
                    <TableHead className='text-right text-foreground'>{t('reserveDate')}</TableHead>
                    <TableHead className='text-right text-foreground'>{t('price')}</TableHead>
                    <TableHead className='text-right text-foreground'>{t('status')}</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {reserves && reserves.map((reserve, idx) => {
                    const house = housesData[reserve.houseId]
                    if (!house) return null

                    return <TableRow key={idx}>
                        <TableCell className='py-4 whitespace-nowrap flex gap-2 items-center'>
                            <img src={house.photos[0] || "/"} alt=" " width={107} height={72} className=" rounded-[12px] bg-card-light flex-shrink-0" />
                            {house.title}
                        </TableCell>
                        <TableCell className='whitespace-nowrap'>
                            {convertToJalaliString(reserve.reservedDates[0].value)}
                        </TableCell>
                        <TableCell className='whitespace-nowrap'>
                            {SplitNumber(house.price || "")} {t('currency')}
                        </TableCell>
                        <TableCell>
                            <div className={`px-2 py-1 flex gap-2 whitespace-nowrap w-fit rounded-[16px] pl-6 items-center ${reserve.status !== "pending" ? "bg-primary text-primary-foreground" : "bg-danger text-accent-foreground"}`}> {reserve.status !== "pending" ? <CheckCircle2 size={14} /> : <X size={14} />} {reserve.status !== "pending" ? t('confirmed') : t('notConfirmed')} </div>
                        </TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
        <div className='flex flex-col gap-4 w-full lg:hidden'>
            {reserves && reserves.map((reserve, idx) => {
                const house = housesData[reserve.houseId]
                if (!house) return null

                return <div key={idx} className='w-full max-sm:flex-col bg-subBg2 px-4 py-4 rounded-xl flex gap-4'>
                    <div className=' h-full flex flex-col gap-2 max-sm:gap-4 text-base'>
                        <div className='flex gap-4 items-center flex-wrap'> <Text className='text-subText' size={20} /> <p className='text-subText'> {t('hotelName')} : </p> <span> {house.title} </span> </div>
                        <div className='flex gap-4 items-center flex-wrap'> <Rocket className='text-subText' size={20} />  <p className='text-subText'> {t('reserveDate')} : </p> <span> {convertToJalaliString(reserve.reservedDates[0].value)} </span> </div>
                        <div className='flex gap-4 items-center flex-wrap'> <Coins className='text-subText' size={20} /> <p className='text-subText'> {t('price')} : </p> <span className='gap-2 flex'> {SplitNumber(house.price || "")} <p>{t('currency')}</p>  </span> </div>
                        <div className={`px-2 py-1 flex gap-2 whitespace-nowrap w-fit rounded-[16px] pl-6 items-center ${reserve.status !== "pending" ? "bg-primary text-primary-foreground" : "bg-danger text-accent-foreground"}`}> {reserve.status !== "pending" ? <CheckCircle2 size={14} /> : <X size={14} />} {reserve.status !== "pending" ? t('confirmed') : t('notConfirmed')} </div>
                    </div>
                </div>
            })}
        </div>
    </BlurFade>
}

export default RecentReserves