import { Button } from '@/components/ui/button'
import { IButton } from '@/types/buttons-type/buttons-type'
import React, { FC } from 'react'

const IconButton: FC<IButton> = ({ onclick, icon, classname }) => {
    return (
        <div>
            <Button variant={'scale'} onClick={onclick} className={`cursor-pointer rounded-[14px] flex text-black bg-primary ${classname}`}>
                {icon}
            </Button>
        </div>
    )
}

export default IconButton
