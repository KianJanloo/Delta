'use client'

import { useEffect, useState } from 'react'
import StatusProfile from './cards/StatusProfile'
import SituationPayroll from './cards/SituationPayroll'
import RecentReserves from './cards/RecentReserves'
import { getDashboardSummary } from '@/utils/service/api/dashboard/getDashboardSummary'
import { IDashboardSummary } from '@/types/dashboard-type/summary-type/summary-type'
import { Booking, getCustomersBookings } from '@/utils/service/api/booking/getCustomersBookings'
import MiniCard from './cards/MiniCard'

const ComSellerDashboard = () => {
  const [reserves, setReserves] = useState<Booking[]>([])
  const [dashboard, setDashboard] = useState<IDashboardSummary | null>(null)

  useEffect(() => {
    const fetchReserves = async () => {
      try {
        const res = await getCustomersBookings(1, 8, "created_at", "DESC");
        setReserves(res?.bookings || []);
      } catch (err) {
        console.error('Failed to fetch reserves', err)
      }
    }

    fetchReserves()
  }, [])

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboardSummary()
        setDashboard(res)
      } catch (err) {
        console.error('Failed to fetch reserves', err)
      }
    }

    fetchDashboard()
  }, [])

  const dataMiniCards = [
    { number: dashboard?.houses, title: " تعداد املاک ", href: "/dashboard/seller/manage-houses/my-houses" },
    { number: dashboard?.bookings.conformedBookings, title: " رزرو های تایید شده ", href: "/dashboard/seller/manage-reserves" },
    { number: dashboard?.bookings.pendingBookings, title: " رزرو های در حال انتظار ", href: "/dashboard/seller/manage-reserves" },
    { number: dashboard?.comments, title: " تعداد نظرات ", href: "/dashboard/seller/manage-houses/my-houses" },
  ]

  return (
    <div className='bg-bgDash rounded-xl py-4 flex flex-col gap-8'>
      <div className='w-full max-lg:flex-col flex flex-row gap-4 justify-between'>
        {dataMiniCards.map((data, idx) => (
          <MiniCard key={idx} {...data} idx={idx} />
        ))}
      </div>
      <div className='flex w-full justify-between gap-4 h-fit max-lg:flex-col'>
        <SituationPayroll />
        <StatusProfile />
      </div>
      <RecentReserves reserves={reserves} />
    </div>
  )
}

export default ComSellerDashboard
