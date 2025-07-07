'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IPasswordInput } from '@/types/input-type/input-types'
import { Eye, EyeOff } from 'lucide-react'
import React, { FC, useState } from 'react'

const PasswordInput: FC<IPasswordInput> = ({ label, placeholder, classname, background, color, onchange, mandatory, id, name }) => {
    const [showPassword, setShowPassword] = useState<boolean>(true)

    return (
        <div className='rtl flex flex-col gap-2'>
            <Label htmlFor={label} className={`text-[13px] text-card-foreground flex gap-0.5 ${color}`}>
                <span> {label} </span>
                {mandatory === true ? <p className='text-danger'> * </p> : <></>}
                <span> : </span>
            </Label>
            <div className='relative w-full'>
                <Input
                    onChange={onchange}
                    type={showPassword ? 'password' : 'text'}
                    placeholder={placeholder || ''}
                    id={id}
                    name={name}
                    className={`py-3 border border-border px-4 text-[#FFFFFF] rounded-[16px] text-sm ${color} ${background} ${classname}`}
                />
                <Button
                    onClick={() => {
                        if (showPassword) {
                            setShowPassword(false)
                        }
                        else {
                            setShowPassword(true)
                        }
                    }}
                    className='cursor-pointer bg-transparent absolute left-3 top-2'
                    variant={'scale'}
                    type='button'
                >
                    {showPassword ? <EyeOff className={`size-[20px] ${color}`} /> : <Eye className={`size-[20px] ${color}`} />}
                </Button>
            </div>
        </div>
    )
}

export default PasswordInput
