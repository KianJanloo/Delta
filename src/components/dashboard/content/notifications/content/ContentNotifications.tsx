'use client'
import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination'
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import CommonButton from '@/components/common/buttons/common/CommonButton'
import { useTranslations } from 'next-intl'

const notifications = [
    {
        date: "12 مرداد / 1401 - 12:33",
        title: "فروشنده امیر محمد طالبی یک خانه برای رزرو انتخاب کرده است",
        subtitle: "به سفارت دانا خوش آمدید",
        read: false,
    },
    {
        date: "12 مرداد / 1401 - 12:33",
        title: "فروشنده امیر محمد طالبی یک خانه برای رزرو انتخاب کرده است",
        subtitle: "به سفارت دانا خوش آمدید",
        read: false,
    },
    {
        date: "12 مرداد / 1401 - 12:33",
        title: "فروشنده امیر محمد طالبی یک خانه برای رزرو انتخاب کرده است",
        subtitle: "به سفارت دانا خوش آمدید",
        read: false,
    },
    {
        date: "12 مرداد / 1401 - 12:33",
        title: "فروشنده امیر محمد طالبی یک خانه برای رزرو انتخاب کرده است",
        subtitle: "به سفارت دانا خوش آمدید",
        read: true,
    },
    {
        date: "12 مرداد / 1401 - 12:33",
        title: "فروشنده امیر محمد طالبی یک خانه برای رزرو انتخاب کرده است",
        subtitle: "به سفارت دانا خوش آمدید",
        read: true,
    }
]

export default function ContentNotifications() {
    const t = useTranslations('dashboardBuyer.notifications')
    const [openUnread, setOpenUnread] = useState(true)
    const [openRead, setOpenRead] = useState(false)

    const unread = notifications.filter(n => !n.read)
    const read = notifications.filter(n => n.read)

    return (
        <div className='flex flex-col gap-8'>
            <Table className='text-right max-lg:hidden overflow-hidden w-full'>
                <TableHeader className='bg-subBg2 rounded-t-2xl text-foreground'>
                    <TableRow className='text-right'>
                        <TableHead className='text-right text-foreground'>{t('notification')}</TableHead>
                        <TableHead className='text-right text-foreground'>{t('date')}</TableHead>
                        <TableHead className='text-right text-foreground'></TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <TableRow
                        onClick={() => setOpenUnread(v => !v)}
                        className='cursor-pointer bg-subBg'
                    >
                        <TableCell colSpan={3} className='flex w-fit gap-4 justify-between items-center py-3'>
                            {t('unread')} ({unread.length})
                            {openUnread ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </TableCell>
                    </TableRow>

                    {openUnread && unread.map((not, idx) => (
                        <TableRow key={idx} className='hover:bg-subBg2 relative'>
                            <TableCell className='py-4 whitespace-nowrap flex gap-4 items-center'>
                                {not.title}
                            </TableCell>
                            <TableCell className='whitespace-nowrap'>{not.date}</TableCell>
                            <TableCell>
                                <CommonButton title={t('markAsRead')} icon={<CheckCircle2 size={14} />} classname='flex-row-reverse' />
                            </TableCell>
                        </TableRow>
                    ))}

                    <TableRow
                        onClick={() => setOpenRead(v => !v)}
                        className='cursor-pointer bg-subBg'
                    >
                        <TableCell colSpan={3} className='flex w-fit gap-4 justify-between items-center py-3'>
                            {t('read')} ({read.length})
                            {openRead ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </TableCell>
                    </TableRow>

                    {openRead && read.map((not, idx) => (
                        <TableRow key={idx} className='hover:bg-subBg2 opacity-70'>
                            <TableCell className='py-4 whitespace-nowrap'>{not.title}</TableCell>
                            <TableCell className='whitespace-nowrap'>{not.date}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className='flex flex-col gap-4 lg:hidden'>
                <div className='space-y-2'>
                    <div
                        onClick={() => setOpenUnread(v => !v)}
                        className='flex justify-between items-center bg-subBg2 px-4 py-2 rounded-lg cursor-pointer'
                    >
                        <span>{t('unread')} ({unread.length})</span>
                        {openUnread ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                    {openUnread && unread.map((not, i) => (
                        <div key={i} className='bg-subBg2 p-4 rounded-lg space-y-2'>
                            <p className='font-medium flex gap-4'>
                                {not.title}
                            </p>
                            <p className='text-sm text-muted-foreground'>{not.subtitle}</p>
                            <div className='flex justify-between items-center'>
                                <span className='text-xs text-muted-foreground'>{not.date}</span>
                                <div className='inline-flex items-center gap-1 bg-primary text-primary-foreground cursor-pointer px-2 py-1 rounded-lg text-xs'>
                                    <CheckCircle2 size={12} /> {t('mark')}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='space-y-2'>
                    <div
                        onClick={() => setOpenRead(v => !v)}
                        className='flex justify-between items-center bg-subBg2 px-4 py-2 rounded-lg cursor-pointer'
                    >
                        <span>{t('read')} ({read.length})</span>
                        {openRead ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                    {openRead && read.map((not, i) => (
                        <div key={i} className='bg-subBg2 p-4 rounded-lg opacity-70 space-y-2'>
                            <p className='font-medium'>{not.title}</p>
                            <p className='text-sm text-muted-foreground'>{not.subtitle}</p>
                            <span className='text-xs text-muted-foreground'>{not.date}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className='flex w-full justify-end items-center'>
                <Pagination className='w-fit'>
                    <PaginationContent className="justify-center mt-6">
                        <PaginationItem><PaginationPrevious /></PaginationItem>
                        <PaginationItem className='flex gap-2'>
                            <PaginationLink className='bg-primary text-primary-foreground'>1</PaginationLink>
                            <PaginationLink>2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem><PaginationNext /></PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}