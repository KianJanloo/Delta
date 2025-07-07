import React from 'react'
import PaymentHeader from './header/PaymentHeader'
import PaymentsDetail from './detail/PaymentsDetail'
import { BlurFade } from '@/components/magicui/blur-fade'

const PaymentsComponent = () => {
  return (
    <BlurFade className='flex flex-col gap-4'>
      <PaymentHeader />
      <PaymentsDetail />
    </BlurFade>
  )
}

export default PaymentsComponent
