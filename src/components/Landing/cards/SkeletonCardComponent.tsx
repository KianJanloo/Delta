import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const SkeletonCardComponent = () => {
  return (
    <div className="flex flex-col gap-4 w-[272px] h-[350px] my-10 mx-auto">
      <div className="relative">
        <Skeleton className="w-full h-[172px] rounded-[20px] bg-secondary-light2 flex justify-center items-center">
          <Skeleton className='w-11/12 h-5/6 rounded-[20px] bg-[#444444] relative justify-center flex'>
            <svg className='absolute bottom-1' width="80" height="16" viewBox="0 0 80 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.73205 3C8.96225 1.66667 7.03775 1.66667 6.26795 3L2.80385 9C2.03405 10.3333 2.9963 12 4.5359 12L11.4641 12C13.0037 12 13.966 10.3333 13.1962 9L9.73205 3Z" fill="white" />
              <circle cx="28" cy="8" r="4" fill="#D9D9D9" />
              <circle cx="44" cy="8" r="4" fill="#D9D9D9" />
              <circle cx="60" cy="8" r="4" fill="#D9D9D9" />
              <circle cx="76" cy="8" r="4" fill="#D9D9D9" />
            </svg>
          </Skeleton>
        </Skeleton>
      </div>
      <Skeleton className="w-3/4 h-[20px] rounded bg-secondary-light2" />
      <div className="flex flex-col gap-2">
        <Skeleton className="w-1/2 h-[14px] rounded bg-muted" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="w-[60px] h-[14px] rounded bg-muted" />
          <Skeleton className="w-[60px] h-[14px] rounded bg-muted" />
          <Skeleton className="w-[60px] h-[14px] rounded bg-muted" />
        </div>
      </div>
      <Skeleton className="w-full h-[40px] rounded-[12px] bg-secondary-light2" />
    </div>
  )
}

export default SkeletonCardComponent
