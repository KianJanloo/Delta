import CommonSelect from '@/components/common/inputs/common/CommonSelect'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SplitNumber } from '@/utils/helper/spliter/SplitNumber'
import { CheckCircle2, Coins, Flower, LayoutGrid, Phone, Rocket, X } from 'lucide-react'
import React from 'react'
import { useTranslations } from 'next-intl'

const PaymentsDetail = () => {
    const t = useTranslations('dashboardSeller.payments')

    const payments = [
        { date: t('sampleDate'), phoneNumber: 123456789123456, price: 1250000, status: true, paymentType: t('walletCharge') },
        { date: t('sampleDate'), phoneNumber: 123456789123456, price: 1250000, status: false, paymentType: t('walletCharge') },
        { date: t('sampleDate'), phoneNumber: 123456789123456, price: 1250000, status: false, paymentType: t('walletCharge') },
        { date: t('sampleDate'), phoneNumber: 123456789123456, price: 1250000, status: true, paymentType: t('walletCharge') },
        { date: t('sampleDate'), phoneNumber: 123456789123456, price: 1250000, status: true, paymentType: t('walletCharge') },
    ]

    return (
        <div className='bg-subBg px-4 py-2 rounded-2xl flex flex-col gap-4'>
            <div className='flex w-full max-md:flex-col gap-4 justify-between items-start md:items-center'>
                <h2 className='text-lg max-lg:text-base'>{t('title')} (25)</h2>
                <div className='flex gap-4 md:w-fit w-full'>
                    <CommonSelect label={t('paymentStatus')} placeholder={t('confirmed')} selectItems={[]} classname='border px-8 border-subText py-5' />
                    <CommonSelect label={t('transactionType')} placeholder={t('reserve')} selectItems={[]} classname='border px-8 border-subText py-5' />
                </div>
            </div>
            <div className='flex flex-col justify-between gap-8'>
                <Table className='text-right max-lg:hidden overflow-hidden'>
                    <TableHeader className='bg-subBg2 rounded-2xl text-foreground'>
                        <TableRow className='text-right'>
                            <TableHead className='text-right text-foreground'>{t('date')}</TableHead>
                            <TableHead className='text-right text-foreground'>{t('trackingNumber')}</TableHead>
                            <TableHead className='text-right text-foreground'>{t('amount')}</TableHead>
                            <TableHead className='text-right text-foreground'>{t('paymentStatus')}</TableHead>
                            <TableHead className='text-right text-foreground'>{t('transactionType')}</TableHead>
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
                                    {SplitNumber(payment.price)}
                                </TableCell>
                                <TableCell>
                                    <div className={`px-2 py-1 flex gap-2 whitespace-nowrap w-fit rounded-[16px] pl-6 items-center ${payment.status ? "bg-primary text-primary-foreground" : "bg-danger text-accent-foreground"}`}> {payment.status ? <CheckCircle2 size={14} /> : <X size={14} />} {payment.status ? t('confirmed') : t('notConfirmed')} </div>
                                </TableCell>
                                <TableCell className='whitespace-nowrap'>
                                    {payment.paymentType}
                                </TableCell>
                                <TableCell className='cursor-pointer whitespace-nowrap'>
                                    {t('viewReceipt')}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className='flex flex-col gap-4 w-full lg:hidden'>
                    {payments.map((payment, idx) => (
                        <div key={idx} className='w-full max-sm:flex-col bg-subBg2 px-4 py-4 rounded-xl flex gap-4'>
                            <div className=' h-full flex flex-col gap-2 max-sm:gap-4 text-base'>
                                <div className='flex gap-4 items-center flex-wrap'> <Rocket className='text-subText' size={20} /> <p className='text-subText'>{t('date')} : </p> <span> {payment.date} </span> </div>
                                <div className='flex gap-4 items-center flex-wrap'> <LayoutGrid className='text-subText' size={20} />  <p className='text-subText'>{t('transactionType')} : </p> <span> {payment.paymentType} </span> </div>
                                <div className='flex gap-4 items-center flex-wrap'> <Phone className='text-subText' size={20} /> <p className='text-subText'>{t('trackingNumber')} : </p> <span> {payment.phoneNumber} </span> </div>
                                <div className='flex gap-4 items-center flex-wrap'> <Coins className='text-subText' size={20} /> <p className='text-subText'>{t('amount')} : </p> <span className='gap-2 flex'> {SplitNumber(payment.price)} <p>{t('currency')}</p>  </span> </div>
                                <div className='flex gap-4 items-center flex-wrap'> <Flower className='text-subText' size={20} /> <div className={`px-2 py-1 flex gap-2 whitespace-nowrap w-fit rounded-[16px] pl-6 items-center ${payment.status ? "bg-primary text-primary-foreground" : "bg-danger text-accent-foreground"}`}> {payment.status ? <CheckCircle2 size={14} /> : <X size={14} />} {payment.status ? t('confirmed') : t('notConfirmed')} </div> </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='flex w-full flex-wrap justify-end items-end'>
                    <div>
                        <Pagination className='w-fit'>
                            <PaginationContent className="justify-center mt-6">
                                <PaginationItem>
                                    <PaginationPrevious />
                                </PaginationItem>

                                <PaginationItem className='flex gap-2'>
                                    <PaginationLink className='bg-primary text-primary-foreground'>
                                        1
                                    </PaginationLink>
                                    <PaginationLink className=''>
                                        2
                                    </PaginationLink>
                                </PaginationItem>

                                <PaginationItem>
                                    <PaginationNext />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentsDetail