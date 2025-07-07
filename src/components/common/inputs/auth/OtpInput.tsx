'use client'
import { InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { IOTPInput } from '@/types/input-type/input-types'
import { OTPInput } from 'input-otp'
import React, { FC } from 'react'

const OtpInput: FC<IOTPInput> = ({ onchange }) => {
    return (
        <div>
            <OTPInput maxLength={6} onChange={onchange} >
                <InputOTPGroup className='flex flex-wrap gap-4'>
                    <InputOTPSlot className='text-card-foreground border-[#565656] rounded-[12px] size-[44px]' index={0} />
                    <InputOTPSlot className='text-card-foreground border-[#565656] rounded-[12px] size-[44px]' index={1} />
                    <InputOTPSlot className='text-card-foreground border-[#565656] rounded-[12px] size-[44px]' index={2} />
                    <InputOTPSlot className='text-card-foreground border-[#565656] rounded-[12px] size-[44px]' index={3} />
                    <InputOTPSlot className='text-card-foreground border-[#565656] rounded-[12px] size-[44px]' index={4} />
                    <InputOTPSlot className='text-card-foreground border-[#565656] rounded-[12px] size-[44px]' index={5} />
                </InputOTPGroup>
            </OTPInput>
        </div>
    )
}

export default OtpInput
