'use client'

import { useEffect, useState } from 'react'
import MiniCard from './cards/MiniCard'
import StatusProfile from './cards/StatusProfile'
import SituationPayroll from './cards/SituationPayroll'
import RecentReserves from './cards/RecentReserves'
import { getAllBookings } from '@/utils/service/api/booking/getAllBookings'
import { IReserveType } from '@/types/reserves-type/reserves-type'
import { getDashboardSummary } from '@/utils/service/api/dashboard/getDashboardSummary'
import { IDashboardSummary } from '@/types/dashboard-type/summary-type/summary-type'

const ComSellerDashboard = () => {
  const [reserves, setReserves] = useState<IReserveType[]>([])
  const [dashboard, setDashboard] = useState<IDashboardSummary | null>(null)

  useEffect(() => {
    const fetchReserves = async () => {
      try {
        const res = await getAllBookings(1, 8, "created_at", "DESC") as { data: IReserveType[] }
        setReserves(res.data)
      } catch (err) {
        console.error('Failed to fetch reserves', err)
      }
    }

    fetchReserves()
  }, [])

  useEffect(() => {
    const fetchReserves = async () => {
      try {
        const res = await getDashboardSummary()
        setDashboard(res)
      } catch (err) {
        console.error('Failed to fetch reserves', err)
      }
    }

    fetchReserves()
  }, [])

  const dataMiniCards = [
    { number: dashboard?.houses, title: "totalProperties", href: "/dashboard/seller/manage-houses/my-houses" },
    { number: dashboard?.bookings, title: "activeReserves", href: "/dashboard/seller/manage-reserves" },
    { number: 12, title: "pendingReserves", href: "/dashboard/seller/manage-reserves" },
    { number: 8, title: "todayVisits", href: "/dashboard/seller/manage-houses/my-houses" },
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
