import { ICard } from '@/types/card-type/card-types'
import { SplitNumber } from '@/utils/helper/spliter/SplitNumber'
import { ArrowLeft, Bath, Bed, Car, MapPin, Trees } from 'lucide-react'
import Link from 'next/link'
import React, { FC } from 'react'
import { motion } from 'framer-motion'
import SliderPhotos from '../sliders/SliderPhotos'

const CardComponent: FC<ICard> = ({ view, photos, rate, title, address, rooms, parking, bathrooms, transaction_type, price, id, discountedPrice, categories }) => {
    const discount_percentage = discountedPrice ? Math.ceil(((Number(price) - discountedPrice) / Number(price)) * 100) : 0

    return (
        <motion.div whileHover={{ scale: 1.02 }} whileInView={{ scale: 1 }} initial={{ scale: 0 }} transition={{ duration: 0.2 }} className='flex flex-col gap-4 text-card-foreground group w-full h-full my-10 mx-auto'>
            <div className='relative '>
                <div className="bg-subBg2 w-full p-4 group-hover:bg-primary relative h-[190] rounded-[24px] flex justify-center items-center ">
                    <div className='px-2 py-1 bg-white text-sm z-[100] absolute -top-[35px] right-0 text-black font-bold flex flex-row-reverse justify-center items-center gap-1 rounded-[10px]'>
                        <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.04894 0.92705C7.3483 0.00573921 8.6517 0.00573969 8.95106 0.92705L10.0206 4.21885C10.1545 4.63087 10.5385 4.90983 10.9717 4.90983H14.4329C15.4016 4.90983 15.8044 6.14945 15.0207 6.71885L12.2205 8.75329C11.87 9.00793 11.7234 9.4593 11.8572 9.87132L12.9268 13.1631C13.2261 14.0844 12.1717 14.8506 11.388 14.2812L8.58778 12.2467C8.2373 11.9921 7.7627 11.9921 7.41221 12.2467L4.61204 14.2812C3.82833 14.8506 2.77385 14.0844 3.0732 13.1631L4.14277 9.87132C4.27665 9.4593 4.12999 9.00793 3.7795 8.75329L0.979333 6.71885C0.195619 6.14945 0.598395 4.90983 1.56712 4.90983H5.02832C5.46154 4.90983 5.8455 4.63087 5.97937 4.21885L7.04894 0.92705Z" fill="#363636" />
                        </svg>
                        {rate || 0}
                    </div>
                    <div className='bg-subBg2 group-hover:bg-primary px-4 cursor-pointer text-card-foreground text-sm rounded-[10px] absolute -top-[30px] left-0'>
                        <Link href={`/rent/${id}`} className=''> <ArrowLeft size={24} className='text-white' /> </Link>
                    </div>
                    <div className='relative w-full h-full flex justify-center'>
                        { photos && photos?.length > 0 ? <SliderPhotos photos={photos || []} /> : <div className='w-full h-[157px] bg-secondary-light2 rounded-2xl'> </div>}            
                    </div>
                </div>
            </div>
            <h2 className='text-[16px] flex justify-between'> <span className='flex gap-2 flex-wrap whitespace-nowrap'> {title} <p className='text-subText'> ( {categories?.name} ) </p> </span> {discountedPrice && <div className='bg-danger rounded-[12px] px-4 text-sm py-1 w-fit'> %{discount_percentage} </div>} </h2>
            {view === '2' && <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-4'>
                    <div className='flex gap-2 text-subText h-[40px] text-sm items-center'>
                        <MapPin size={20} />
                        {address}
                    </div>
                    <div className="flex flex-row flex-wrap items-center text-sm text-subText gap-1 h-[45px]">
                        <span className='flex gap-1'> <Bed size={20} /> <p> {rooms} </p> <p> خوابه </p> </span> |
                        <span className='flex gap-1'> <Car size={20} /> <p> {parking} </p> <p> پارکینگ </p> </span> |
                        <span className='flex gap-1'> <Bath size={20} /> <p> {bathrooms} </p> <p> حمام </p> </span> |
                        <span className='flex gap-1'> <Trees size={20} /> <p> حیاط </p> </span>
                    </div>
                </div>
                <div className='bg-subBg2 group-hover:bg-primary text-muted mt-2 flex flex-wrap justify-between rounded-[12px] w-full px-4 py-2 text-sm'>
                    <span className={` ${discountedPrice && 'text-muted line-through'} whitespace-nowrap `}> {discountedPrice ? SplitNumber(Number(price)) + ' ت' : (transaction_type === 'rental' && "  اجاره ماهیانه : ") || (transaction_type === "direct_purchase" && " قیمت خرید : ") || (transaction_type === "mortgage" && " قیمت رهن : ")} </span>
                    <span className='flex whitespace-nowrap'> <p className={`text-muted`}> {discountedPrice ? SplitNumber(discountedPrice) : SplitNumber(price || '')} ت </p>{transaction_type === 'rental' && " /هر ماه  "} </span>
                </div>
            </div>}
        </motion.div>
    )
}

export default CardComponent
