import React, { FC } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, Users } from 'lucide-react'
import { useTranslations } from 'next-intl';
import { ITablePassengers } from '@/types/booking-type/booking-type';
import { convertToJalaliString } from '@/utils/helper/shamsiDate/ShamsDate';
import UpdatePassengers from './UpdatePassengers';

const TablePassengers: FC<ITablePassengers> = ({ book }) => {
    const t = useTranslations('hotel.second');

    return (
        <div className='w-full bg-secondary-light2 px-2 py-2 gap-8 rounded-2xl flex flex-col'>
            <div className='w-full bg-subBg2 rounded-2xl flex-wrap gap-4 px-4 py-2 flex justify-between'>
                <div className='flex gap-3 items-center'>
                    <Users size={20} />
                    <span>{t('passengerInfo')}</span>
                </div>
            </div>
            <div className='w-full px-4 py-4'>
                <Table className='text-right w-full'>
                    <TableHeader className='rounded-2xl text-foreground'>
                        <TableRow className='text-right'>
                            <TableHead className='text-right whitespace-nowrap text-foreground'>{t('ageZone')}</TableHead>
                            <TableHead className='text-right whitespace-nowrap text-foreground'>{t('fullName')}</TableHead>
                            <TableHead className='text-right whitespace-nowrap text-foreground'>{t('gender')}</TableHead>
                            <TableHead className='text-right whitespace-nowrap text-foreground'>{t('nationalCode')}</TableHead>
                            <TableHead className='text-right whitespace-nowrap text-foreground'>{t('birthDay')}</TableHead>
                            <TableHead className='text-right whitespace-nowrap text-foreground'>{t('facility')}</TableHead>
                            <TableHead className='text-right whitespace-nowrap text-foreground'>{t('priceFacility')}</TableHead>
                            <TableHead className='text-right whitespace-nowrap text-foreground'></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {book?.passengers?.map((passenger, idx) => {
                            return <TableRow key={idx}>
                                <TableCell className='py-4 whitespace-nowrap'>
                                    {passenger.birthDate ? new Date().getFullYear() - new Date(passenger.birthDate).getFullYear() : "-"}
                                </TableCell>
                                <TableCell className='whitespace-nowrap'>
                                    {(passenger.firstName + " " + passenger.lastName) || "-"}
                                </TableCell>
                                <TableCell className='whitespace-nowrap'>
                                    {passenger.gender === "man" ? "مرد" : "زن"}
                                </TableCell>
                                <TableCell className='whitespace-nowrap'>
                                    {passenger.nationalId || "-"}
                                </TableCell>
                                <TableCell className='whitespace-nowrap'>
                                    { passenger?.birthDate && convertToJalaliString((passenger.birthDate).toString()) }
                                </TableCell>
                                <TableCell className='whitespace-nowrap'>
                                    {"-"}
                                </TableCell>
                                <TableCell className='whitespace-nowrap'>
                                    {"-"}
                                </TableCell>
                                <TableCell className='whitespace-nowrap'>
                                    <UpdatePassengers passenger={passenger} button={<Edit size={16} />} />
                                </TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default TablePassengers
