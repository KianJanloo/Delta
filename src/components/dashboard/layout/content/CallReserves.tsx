'use client'
import { getAllBookings } from '@/utils/service/api/booking/getAllBookings'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import RecentReserves from './RecentReserves'
import { IReserveType } from '@/types/reserves-type/reserves-type'

const CallReserves = () => {

  const { data: reserves } = useQuery<{ data: IReserveType[] }>({
    queryKey: ['reserves'],
    queryFn: () => getAllBookings(1, 10, 'created_at', 'DESC') as Promise<{ data: IReserveType[] }>
  })

  return (
    <RecentReserves reserves={reserves?.data || []} />
  )
}

export default CallReserves
