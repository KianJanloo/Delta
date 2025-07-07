import React from 'react'
import MiniCard from '../../dashboard/cards/MiniCard'
import { SplitNumber } from '@/utils/helper/spliter/SplitNumber'

const PaymentHeader = () => {
    const dataMiniCards = [
        { value: "115000000", title: "currentMonthIncome" },
        { value: "2000000", title: "lastMonthIncome" },
        { value: "25000000", title: "totalIncome" },
        { value: "850000", title: "withdrawableBalance" },
    ]

    return (
        <div className='w-full max-lg:flex-col flex flex-row gap-4 justify-between '>
            {dataMiniCards.map((data, idx) => (
                <MiniCard key={idx} {...data} idx={idx} value={SplitNumber(Number(data.value))} />
            ))}
        </div>
    )
}

export default PaymentHeader