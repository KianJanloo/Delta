import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ITextarea } from '@/types/textarea-type/textarea-types'
import React, { FC } from 'react'

const CommonTextarea: FC<ITextarea> = ({ classname, onchange, label, color, background, mandatory, placeholder }) => {
    return (
        <div className='rtl flex flex-col gap-2'>
            <Label htmlFor={label} className={`text-[13px] flex gap-0.5 ${color}`}>
                <span> {label} </span>
                {mandatory === true ? <p className='text-red-500'> * </p> : <></>}
                <span> : </span>
            </Label>
            <Textarea placeholder={placeholder} onChange={onchange} id={label} className={`text-card-foreground rounded-2xl ${classname} ${color} ${background}`} />
        </div>
    )
}

export default CommonTextarea
