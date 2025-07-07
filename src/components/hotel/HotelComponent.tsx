'use client'
import React, { useState } from 'react'
import Stepper from './stepper/Stepper'
import FirstStep from './steps/FirstStep/FirstStep';
import SecondStep from './steps/SecondStep/SecondStep';
import FourthStep from './steps/FourthStep';
import { useBooking } from '@/utils/zustand/booking';

const HotelComponent = () => {

  const { book, addPassenger, setSharedMobile, setSharedEmail, removeBooking, setStep } = useBooking()

  const [currentStep, setCurrentStep] = useState<number>(book?.step || 0);
  const handleCurrentStepIncrease = () => {
    if(setStep) {
      if(currentStep === 1) {
        setCurrentStep(4)
        setStep(4)
        return
      }
      setStep(currentStep + 1)
      setCurrentStep(currentStep +1)
    }
  }
  const handleCurrentStepDecrease = () => {
    if(setStep) {
      setStep(currentStep - 1)
      setCurrentStep(currentStep -1)
    }
  }

  return (
    <div className='flex flex-col gap-8'>
      <Stepper currentStep={currentStep} />
      {currentStep === 0 && book && <FirstStep removeBooking={removeBooking} setSharedEmail={setSharedEmail} setSharedMobile={setSharedMobile} addPassenger={addPassenger} book={book} handleCurrentStepIncrease={handleCurrentStepIncrease} />}
      {currentStep === 1 && book && <SecondStep book={book} handleCurrentStepIncrease={handleCurrentStepIncrease} handleCurrentSteDecrease={handleCurrentStepDecrease} />}
      {currentStep === 4 && <FourthStep removeBooking={removeBooking} />}
    </div>
  )
}

export default HotelComponent
