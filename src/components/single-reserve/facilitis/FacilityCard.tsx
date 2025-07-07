'use client'
import React, { FC } from 'react'
import { motion } from 'framer-motion'

interface IProps {
    title: string | React.ReactNode
    content: string | React.ReactNode
}

const FacilityCard: FC<IProps> = ({ title, content }) => {
    return (
        <motion.div whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }} className='bg-secondary-light2 max-md:row-span-1 text-sm md:w-fit h-[94] rounded-[16px] flex gap-2 flex-col p-2 max-md:px-4 justify-center items-center'>
            <span> {title} </span>
            <div className='flex justify-center whitespace-nowrap md:w-fit w-full items-center bg-accent text-accent-foreground rounded-[10px] px-8 py-2'> {content} </div>
        </motion.div>
    )
}

export default FacilityCard
