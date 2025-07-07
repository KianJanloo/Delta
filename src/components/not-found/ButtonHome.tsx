'use client'
import React from 'react'
import CommonButton from '../common/buttons/common/CommonButton'
import { ChevronLeft } from 'lucide-react'
import { redirect } from 'next/navigation'

const ButtonHome = () => {
    return (
        <CommonButton
            title=" خانه "
            icon={<ChevronLeft size={16} />}
            onclick={() => redirect("/")}
        />
    )
}

export default ButtonHome
