'use client'
import React from 'react';
import ViewAllButton from '../../common/buttons/common/ViewAllButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { CallSliderDreams } from './CallSlider';
import { CallSliderRental } from './CallSliderRental';
import { CallSliderMortgage } from './CallSliderMortgage';
import { redirect } from 'next/navigation';
import { useTranslations } from 'next-intl';

const DestinationOfDreams = () => {
  const t = useTranslations('landing.destinations');

  return (
    <div className='flex justify-center items-center py-[50px] gap-16 flex-col relative bg-secondary-light rounded-b-[64px]'>
      <div className='w-full h-fit flex flex-col justify-center items-center gap-4 px-8'>
        <div className='flex gap-1 justify-center items-center'>
          <div className="flex flex-row w-fit items-center gap-4">
            <div className='dark:flex hidden gap-1 justify-center items-center'>
              <svg width="48" height="16" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9.73205C1.66666 8.96225 1.66667 7.03775 3 6.26795L9 2.80385C10.3333 2.03405 12 2.9963 12 4.5359L12 11.4641C12 13.0037 10.3333 13.966 9 13.1962L3 9.73205Z" fill="#8CFF45" />
                <path d="M24.25 9.29904C23.25 8.72169 23.25 7.27831 24.25 6.70096L28.75 4.10289C29.75 3.52554 31 4.24722 31 5.40192L31 10.5981C31 11.7528 29.75 12.4745 28.75 11.8971L24.25 9.29904Z" fill="#8CFF45" fillOpacity="0.5" />
                <path d="M41.5 8.86602C40.8333 8.48112 40.8333 7.51887 41.5 7.13397L44.5 5.40192C45.1667 5.01702 46 5.49815 46 6.26795L46 9.73205C46 10.5019 45.1667 10.983 44.5 10.5981L41.5 8.86602Z" fill="#8CFF45" fillOpacity="0.25" />
              </svg>
            </div>
            <span className="text-primary text-sm">{t('title')}</span>
          </div>
        </div>
        <h2 className='lg:text-2xl md:text-xl text-base font-[500]'>{t('dreams-title')}</h2>
        <span className='text-subText md:text-sm text-xs'>{t('dreams-subtitle')}</span>
        <div className='mt-[20px] w-full'>
          <CallSliderDreams />
        </div>
      </div>

      <div className='w-full h-fit flex flex-col gap-4 px-8'>
        <div className='flex gap-1 items-center'>
          <div className="flex flex-row w-fit items-center gap-4">
            <span className="text-primary text-sm">{t('with-any-budget')}</span>
          </div>
        </div>
        <div className='relative'>
          <div className='flex justify-between w-full flex-wrap items-center gap-4'>
            <div className='flex gap-4'>
              <h2 className='lg:text-2xl md:text-xl text-base font-[500]'>{t('rent-title')}</h2>
              <span className='lg:block hidden text-2xl'> | </span>
            </div>
            <ViewAllButton onclick={() => redirect('/rent')} classname='max-md:border-none max-md:p-0' />
          </div>

          <Tabs defaultValue="rental" className='rtl'>
            <TabsList className='bg-subBg text-subText lg:absolute lg:mt-0 mt-4 right-[265px] top-0.5'>
              <TabsTrigger value="rental" className='bg-subBg'> {t("tabs.rental")} </TabsTrigger>
              <TabsTrigger value="mortgage" className='bg-subBg'> {t("tabs.mortgage")} </TabsTrigger>
            </TabsList>
            <TabsContent value="rental" className='mt-[30px]'>
              <CallSliderRental />
            </TabsContent>
            <TabsContent value="mortgage" className='mt-[30px]'>
              <CallSliderMortgage />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DestinationOfDreams;
