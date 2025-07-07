'use client'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ISelect } from '@/types/select-type/select-types'
import React, { FC } from 'react'

const CommonSelect: FC<ISelect> = ({ background, color, label, mandatory, classname, placeholder, selectItems, onValueChange, icon, value }) => {

    return (
        <div className='rtl flex flex-col gap-1 group'>
            {label && <Label htmlFor={label} className={`text-[13px] flex gap-0.5 ${color}`}>
                <span> {label} </span>
                {mandatory === true ? <span className='text-danger'> * </span> : <></>}
                <span> : </span>
            </Label>}
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className={`rtl rounded-[16px] px-4 py-2 ${classname} ${color} ${background}`}>
                    {icon && <span className="flex-shrink-0">{icon}</span>}
                    <SelectValue placeholder={`${placeholder}`}></SelectValue>
                </SelectTrigger>
                <SelectContent className={`rtl z-[10000] ${background} ${color}`}>
                    <ScrollArea>
                        <SelectGroup defaultValue={value}>
                            <SelectLabel> {label} </SelectLabel>
                            {selectItems.map((item, index) => (
                                <SelectItem key={index} value={item.value}> {item.label} </SelectItem>
                            ))}
                        </SelectGroup>
                    </ScrollArea>
                </SelectContent>
            </Select>
        </div>
    )
}

export default CommonSelect
