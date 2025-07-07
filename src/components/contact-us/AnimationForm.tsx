'use client'
import React from 'react'
import { motion } from 'framer-motion'
import ContactForm from './ContactForm'

const AnimationForm = () => {
    return (
        <motion.div initial={{ rotate: "180deg" }} whileInView={{ rotate: "0" }} transition={{ duration: 0.3 }} className='bg-card-secondary mx-[100px] min-w-[387px] rounded-[32px] h-[365px] my-auto relative hidden xl:flex justify-center items-center'>
            <motion.div initial={{ rotate: "-180deg" }} whileInView={{ rotate: "0" }} transition={{ duration: 0.5 }} className='w-[479px] h-[340px] bg-card-secondary2 rounded-[32px] absolute flex justify-center items-center'>
                <div className='bg-card-secondary3 min-w-[575px] h-fit absolute rounded-[32px]'>
                    <ContactForm />
                </div>
            </motion.div>
        </motion.div>
    )
}

export default AnimationForm
