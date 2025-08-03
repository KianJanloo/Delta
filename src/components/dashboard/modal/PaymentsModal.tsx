'use client'
import CommonButton from '@/components/common/buttons/common/CommonButton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useDirection } from '@/utils/hooks/useDirection';
import { IPayment } from '@/utils/service/api/seller-finance/getAllCustomersPayments';
import { getPayments } from '@/utils/service/api/payment/getPayments';
import { convertToJalaliString } from '@/utils/helper/shamsiDate/ShamsDate';
import { SplitNumber } from '@/utils/helper/spliter/SplitNumber';

const PaymentsModal = () => {
    const t = useTranslations('modals.payments');
    const dir = useDirection()
    const [open, setOpen] = useState<boolean>(false);
    const [payments, setPayments] = useState<IPayment[]>([])

    const fetchPayments = useCallback(async () => {
        const data = {
            page: 1,
            limit: 5,
            sort: 'createdAt',
            order: 'DESC'
        }
        const response = await getPayments(data);
        if(response) {
            setPayments(response.payments);
        }
    }, [])

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments])

    return (
        <Dialog onOpenChange={setOpen} open={open} >
            <DialogTrigger>
                <div className='flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-md cursor-pointer transition-colors'>
                    <CreditCard size={20} /> {t('transactionsList')}
                </div>
            </DialogTrigger>
            <DialogContent dir={dir} onMouseDown={(e) => e.stopPropagation()} className='rounded-2xl max-w-[800px] flex flex-col gap-8 items-center'>
                <DialogHeader className='flex justify-between flex-row w-full items-center my-4'>
                    <DialogTitle className='text-xl'>
                        {t('yourTransactions')}
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
                        <Table dir={dir} className='text-right w-full overflow-hidden'>
                            <TableHeader className='bg-subBg2 rounded-2xl text-foreground'>
                                <TableRow className='text-right'>
                                    <TableHead className='text-right text-foreground'>{t('date')}</TableHead>
                                    <TableHead className='text-right text-foreground'>{" کد پرداخت "}</TableHead>
                                    <TableHead className='text-right text-foreground'>{t('amount')}</TableHead>
                                    <TableHead className='text-right text-foreground'></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((payment, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className='py-4 whitespace-nowrap'>
                                            {convertToJalaliString(payment.createdAt)}
                                        </TableCell>
                                        <TableCell className='whitespace-nowrap'>
                                            {payment.id}
                                        </TableCell>
                                        <TableCell className='whitespace-nowrap'>
                                            {SplitNumber(Number(payment.amount))} ت
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

export default PaymentsModal