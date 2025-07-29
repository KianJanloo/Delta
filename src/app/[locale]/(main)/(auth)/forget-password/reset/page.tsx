import AuthHeader from '@/components/auth/authHeader'
import RegisterForm from '@/components/auth/registerForm'
import ResetForm from '@/components/auth/resetForm'
import TabContent from '@/components/auth/tabContent'
import React from 'react'

const ResetPassword = () => {
  return (
    <div>
      <AuthHeader pageName={" تغییر رمز عبور "} />
      <TabContent registerElement={<RegisterForm />} forgetPasswordElement={<ResetForm />} defaultValue='forget-password' />
    </div>
  )
}

export default ResetPassword
