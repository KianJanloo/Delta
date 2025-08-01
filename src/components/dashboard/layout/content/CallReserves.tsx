'use client'
import { getAllBookings } from '@/utils/service/api/booking/getAllBookings'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import RecentReserves from './RecentReserves'
import { Booking } from '@/utils/service/api/booking/getCustomersBookings'

const CallReserves = () => {

  const { data: reserves } = useQuery<{ data: Booking[] }>({
    queryKey: ['reserves'],
    queryFn: () => getAllBookings(1, 10, 'created_at', 'DESC') as Promise<{ data: Booking[] }>
  })

  return (
    <RecentReserves reserves={reserves?.data || []} />
  )
}

export default CallReserves
