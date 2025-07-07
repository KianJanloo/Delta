import React, { FC } from 'react'
import FacilityCard from './FacilityCard'
import { TFacilities } from '@/types/facilites-type'

interface IProps {
    facilities: TFacilities
}

const SingleReserveFacilities: FC<IProps> = ({ facilities }) => {
  return (
    <div className='grid grid-rows-2 md:flex flex-wrap gap-4 w-full h-fit'>
      {facilities.map((facility, idx) => (
        <FacilityCard key={idx} content={facility.content} title={facility.title} />
      ))}
    </div>
  )
}

export default SingleReserveFacilities
