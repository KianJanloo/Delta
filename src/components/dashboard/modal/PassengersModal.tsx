'use client'
import CommonButton from '@/components/common/buttons/common/CommonButton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { X } from 'lucide-react';
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'

const payments = [
    { name: "امیر محمد ملایی", gender: "مرد", phoneNumber: "0933123963" },
    { name: "امیر محمد ملایی", gender: "مرد", phoneNumber: "0933123963" },
    { name: "امیر محمد ملایی", gender: "مرد", phoneNumber: "0933123963" },
    { name: "امیر محمد ملایی", gender: "مرد", phoneNumber: "0933123963" },
]

const PassengersModal = () => {
    const [open, setOpen] = useState<boolean>(false);
    const t = useTranslations('modals.passengers');

    return (
        <Dialog onOpenChange={setOpen} open={open} >
            <DialogTrigger>
                <CommonButton title={t('passengers')} classname='bg-primary text-primary-foreground' />
            </DialogTrigger>
            <DialogContent onMouseDown={(e) => e.stopPropagation()} className='rounded-2xl max-w-[800px] flex flex-col gap-8 items-center'>
                <DialogHeader className='flex justify-between flex-row w-full items-center my-4'>
                    <DialogTitle className='text-xl'>
                        {t('passengerList')}
                    </DialogTitle>
                    <DialogDescription>
                        <CommonButton onclick={() => setOpen(false)} title={t('close')} icon={<X />} classname='border border-danger bg-transparent text-danger' />
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='w-full'>
                    <div>
                        <svg width="762" height="1" viewBox="0 0 762 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line y1="0.5" x2="762.001" y2="0.5" stroke="#888888" strokeOpacity="0.26" strokeDasharray="7 7" />
                        </svg>
                        <Table className='text-right w-full overflow-hidden'>
                            <TableHeader className='bg-subBg2 rounded-2xl text-foreground'>
                                <TableRow className='text-right'>
                                    <TableHead className='text-right text-foreground'>{t('name')}</TableHead>
                                    <TableHead className='text-right text-foreground'>{t('gender')}</TableHead>
                                    <TableHead className='text-right text-foreground'>{t('phoneNumber')}</TableHead>
                                    <TableHead className='text-right text-foreground'>{t('sendMessage')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((payment, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className='py-4 whitespace-nowrap'>
                                            {payment.name}
                                        </TableCell>
                                        <TableCell className='whitespace-nowrap'>
                                            {payment.gender}
                                        </TableCell>
                                        <TableCell className='whitespace-nowrap'>
                                            {payment.phoneNumber}
                                        </TableCell>
                                        <TableCell className='relative whitespace-nowrap cursor-pointer'>
                                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18.8721 0.598525C20.5277 0.0466543 21.355 -0.229063 21.792 0.2079C22.229 0.644894 21.9532 1.4722 21.4014 3.12782L16.5635 17.6415C15.7791 19.9945 15.3868 21.1708 14.666 21.1708C13.9456 21.1703 13.5537 19.994 12.7695 17.6415L11.0195 12.3925L16.7061 6.70692L16.7754 6.63075C17.0955 6.23798 17.0721 5.65888 16.7061 5.29286C16.3399 4.92717 15.7608 4.90413 15.3682 5.2245L15.292 5.29286L9.60449 10.9794L4.3584 9.23036C2.00587 8.44618 0.829578 8.05433 0.829102 7.33388C0.829102 6.61315 2.00537 6.22076 4.3584 5.43642L18.8721 0.598525Z" fill="#8CFF45" />
                                            </svg>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PassengersModal