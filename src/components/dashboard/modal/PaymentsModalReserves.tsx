'use client'
import CommonButton from '@/components/common/buttons/common/CommonButton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { X } from 'lucide-react';
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'

const payments = [
    { date: "12 مرداد - 1401 / 12:33", phoneNumber: 123456789123456, price: 1250000 },
    { date: "12 مرداد - 1401 / 12:33", phoneNumber: 123456789123456, price: 1250000 },
    { date: "12 مرداد - 1401 / 12:33", phoneNumber: 123456789123456, price: 1250000 },
    { date: "12 مرداد - 1401 / 12:33", phoneNumber: 123456789123456, price: 1250000 },
]

const PaymentsModalReserves = () => {
    const [open, setOpen] = useState<boolean>(false);
    const t = useTranslations('modals.paymentsReserves');

    return (
        <Dialog onOpenChange={setOpen} open={open} >
            <DialogTrigger>
                <CommonButton title={t('payments')} classname='bg-primary text-primary-foreground' />
            </DialogTrigger>
            <DialogContent onMouseDown={(e) => e.stopPropagation()} className='rounded-2xl max-w-[800px] flex flex-col gap-8 items-center'>
                <DialogHeader className='flex justify-between flex-row w-full items-center my-4'>
                    <DialogTitle className='text-xl'>
                        {t('paymentsList')}
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
                                    <TableHead className='text-right text-foreground'>{t('date')}</TableHead>
                                    <TableHead className='text-right text-foreground'>{t('trackingNumber')}</TableHead>
                                    <TableHead className='text-right text-foreground'>{t('amount')}</TableHead>
                                    <TableHead className='text-right text-foreground'></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((payment, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className='py-4 whitespace-nowrap'>
                                            {payment.date}
                                        </TableCell>
                                        <TableCell className='whitespace-nowrap'>
                                            {payment.phoneNumber}
                                        </TableCell>
                                        <TableCell className='whitespace-nowrap'>
                                            {payment.price}
                                        </TableCell>
                                        <TableCell className='relative whitespace-nowrap cursor-pointer'>
                                            {t('viewReceipt')}
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

export default PaymentsModalReserves