'use client'
import { Button } from '@/components/ui/button'
import { IButton } from '@/types/buttons-type/buttons-type'
import { useDirection } from '@/utils/hooks/useDirection'
import React, { FC } from 'react'

const CommonButton: FC<IButton> = ({ title, classname, onclick, icon, type, disabled }) => {

    const dir = useDirection()

    return (
        <Button variant={'scale'} disabled={disabled} type={type} onClick={onclick} className={` cursor-pointer px-4 py-2 rounded-[14px] flex text-primary-foreground bg-primary ${classname}`}>
            {title}
            {icon && (
                <span className={dir === "ltr" ? "rotate-180" : ""}>
                    {icon}
                </span>
            )}
        </Button>
    )
}

export default CommonButton
