import AuthHeader from '@/components/auth/authHeader'
import RegisterForm from '@/components/auth/registerForm'
import SendForm from '@/components/auth/sendForm'
import TabContent from '@/components/auth/tabContent'
import React from 'react'

const SendPassword = () => {
  return (
    <div>
      <AuthHeader pageName={" تغییر رمز عبور "} />
      <TabContent registerElement={<RegisterForm />} forgetPasswordElement={<SendForm />} defaultValue='forget-password' />
    </div>
  )
}

export default SendPassword
