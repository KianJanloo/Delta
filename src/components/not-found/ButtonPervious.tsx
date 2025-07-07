'use client'
import React from 'react'
import CommonButton from '../common/buttons/common/CommonButton'
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ButtonPervious = () => {

    const router = useRouter()

    return (
        <CommonButton
            title=" برگشت "
            classname="flex-row-reverse bg-transparent border border-foreground text-foreground"
            icon={<ChevronRight size={16} />}
            onclick={() => router.back()}
        />
    )
}

export default ButtonPervious
