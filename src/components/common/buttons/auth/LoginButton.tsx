'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { FC } from 'react'
import Google from '@/assets/google.png'
import { ILoginButton } from '@/types/buttons-type/buttons-type'
import { Github } from 'lucide-react'
import { signIn } from 'next-auth/react'

const LoginButton: FC<ILoginButton> = ({ title, classname, icon }) => {
    return (
        <div>
            <Button variant={'scale'} onClick={() => {
                if (icon === 'google') {
                    signIn('google', { callbackUrl: '/dashboard' })
                } else if (icon === 'github') {
                    signIn('github', { callbackUrl: '/dashboard' })
                }
            }} className={`cursor-pointer px-4 flex-row-reverse py-4 w-full justify-center items-center rounded-[12px] text-[16px] flex gap-3 text-black bg-primary ${classname}`}>
                {title}
                {icon === 'google' ? <Image alt='' src={Google} className='w-[24px]' /> : <Github size={24} />}
            </Button>
        </div>
    )
}

export default LoginButton
