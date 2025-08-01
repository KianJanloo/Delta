'use client'

import { BlurFade } from '@/components/magicui/blur-fade'
import { getMarketTrends, IMarketTrends } from '@/utils/service/api/dashboard/getMarketTrends'
import { Pin } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'

const ReservesChart = () => {
  const [data, setData] = useState<IMarketTrends[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const trends = await getMarketTrends()
      if (trends) {
        const formatted = trends.map(item => ({
          month: item.month,
          bookingCount: item.bookingCount
        }))
        setData(formatted)
      }
    }
    fetchData()
  }, [])

  return (
    <BlurFade delay={0.35} inView className="lg:w-[60%] gap-4 md:w-full p-4 h-60 bg-subBg rounded-xl flex flex-col">
      <div className='flex justify-between w-full items-center flex-wrap gap-4'>
        <div className='flex gap-2 w-fit items-center'>
          <Pin size={24} />
          <span className='text-base font-bold'>{" روند ماهانه رزروها "}</span>
        </div>
      </div>
      <svg width="100%" height="2" viewBox="0 0 1115 2" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0.972656" y1="1.15332" x2="1114.03" y2="1.15332" stroke="#888888" strokeOpacity="0.26" strokeDasharray="7 7" />
      </svg>
      <div className="w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBooking" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e1e1e", borderColor: "#444", color: "#fff" }}
              labelStyle={{ color: "#aaa" }}
            />
            <Area
              type="monotone"
              dataKey="bookingCount"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorBooking)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </BlurFade>
  )
}

export default ReservesChart
