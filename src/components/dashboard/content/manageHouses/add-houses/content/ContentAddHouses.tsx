'use client'
import React, { useState } from 'react'
import Stepper from '../stepper/Stepper'
import FirstStep from './steps/FirstStep'
import SecondStep from './steps/SecondStep'
import ThirdStep from './steps/ThirdStep'
import FourthStep from './steps/FourthStep'
import FifthStep from './steps/FifthStep'

const ContentAddHouses = () => {
  const [step, setStep] = useState<number>(0)

  return (
    <div className='flex flex-col gap-6'>
      <Stepper currentStep={step} />
      {step === 0 && <FirstStep setStep={setStep} />}
      
      {step === 1 && <SecondStep setStep={setStep} />}
      
      {step === 2 && <ThirdStep setStep={setStep} />}
      
      {step === 3 && <FifthStep setStep={setStep} />}
      
      {step === 4 && <FourthStep setStep={setStep} />}
    </div>
  )
}

export default ContentAddHouses