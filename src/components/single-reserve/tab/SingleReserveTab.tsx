'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Feather, Notebook, Text } from 'lucide-react';
import React, { FC } from 'react'
import SingleReserveAbout from '../about/SingleReserveAbout';
import SingleReserveFacilities from '../facilitis/SingleReserveFacilities';
import { TFacilities } from '@/types/facilites-type';
import SingleReserveComment from '../comments/SingleReserveComment';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface IProps {
  defaultValue: string;
  facilities: TFacilities;
  caption: string;
  photos: string[];
  id: string;
}

const SingleReserveTab: FC<IProps> = ({ defaultValue, facilities, caption, photos, id }) => {
  const t = useTranslations('singleReserve.tab');
  return (
    <Tabs defaultValue={defaultValue} className='rtl xl:w-9/12 w-full'>
      <TabsList className='bg-subBg text-subText w-full overflow-hidden custom-scrollbar max-sm:overflow-x-scroll rounded-2xl flex justify-start gap-4 py-6 px-4' >
        <TabsTrigger value="about" className='bg-subBg flex items-center gap-2 flex-row-reverse'>
          {t('about')} <Notebook size={16} />
        </TabsTrigger>
        <TabsTrigger value="facilities" className='bg-subBg flex items-center gap-2 flex-row-reverse'>
          {t('facilities')} <Feather size={16} />
        </TabsTrigger>
        <TabsTrigger value="comments" className='bg-subBg flex items-center gap-2 flex-row-reverse'>
          {t('comments')} <Text size={16} />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="about" className='mt-[30px]'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <SingleReserveAbout caption={caption} photos={photos} />
        </motion.div>
      </TabsContent>
      <TabsContent value="facilities" className='mt-[30px]'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <SingleReserveFacilities facilities={facilities} />
        </motion.div>
      </TabsContent>
      <TabsContent value="comments" className='mt-[30px]'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <SingleReserveComment id={id} />
        </motion.div>
      </TabsContent>
    </Tabs>
  )
}

export default SingleReserveTab